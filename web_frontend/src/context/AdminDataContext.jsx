import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAdminDashboard, searchOrders } from '../services/adminService';
import { FiClock, FiCheckCircle, FiRefreshCw, FiCheckSquare, FiXCircle } from 'react-icons/fi';
import { GiBattery50 as GiBattery, GiOilDrum, GiCarWheel, GiAutoRepair } from 'react-icons/gi';
import { MdLocalCarWash } from 'react-icons/md';

const AdminDataContext = createContext();

export const AdminDataProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async (silent = false) => {
    try {
      if (!silent) setRefreshing(true);
      const response = await searchOrders();
      setOrders(response.data?.orders || response.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("تعذر تحميل قائمة الطلبات");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const fetchDashboard = useCallback(async (silent = false) => {
    try {
      if (!silent) setRefreshing(true);
      const response = await getAdminDashboard();
      setDashboardData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("تعذر تحميل بيانات لوحة التحكم");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchOrders(true), fetchDashboard(true)]);
    setRefreshing(false);
  }, [fetchOrders, fetchDashboard]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(true), fetchDashboard(true)]);
      setLoading(false);
    };
    init();
  }, [fetchOrders, fetchDashboard]);

  const statusConfig = {
    'Pending': { label: 'قيد المراجعة', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500', icon: FiClock },
    'Accepted': { label: 'تمت الموافقة', bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', dot: 'bg-teal-500', icon: FiCheckCircle },
    'InProgress': { label: 'جاري التنفيذ', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-500', icon: FiRefreshCw },
    'Completed': { label: 'مكتمل', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500', icon: FiCheckSquare },
    'Rejected': { label: 'مرفوض', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500', icon: FiXCircle },
    'Cancelled': { label: 'ملغي', bg: 'bg-white/5', text: 'text-slate-400', border: 'border-white/10', dot: 'bg-slate-500', icon: FiXCircle },
  };

  const getStatus = useCallback((status) => {
    let value = status?.value || status;
    const mapping = {
      0: 'Pending',
      1: 'Accepted',
      2: 'Accepted',
      3: 'Rejected',
      4: 'Completed',
      5: 'InProgress'
    };
    if (mapping[value]) value = mapping[value];

    if (typeof value === 'string') {
      const normalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      if (statusConfig[normalized]) value = normalized;
      else if (value.toLowerCase() === 'inprogress') value = 'InProgress';
    }

    const config = statusConfig[value] || statusConfig['Pending'];
    return { ...config, value: value || 'Pending' };
  }, []);

  const getServiceStyle = useCallback((service) => {
    const serviceName = typeof service === 'string' ? service : service?.name;
    const serviceIcon = typeof service === 'object' ? service?.icon : '';
    
    const name = (serviceName || '').toLowerCase();
    const iconKey = (serviceIcon || '').toLowerCase();

    let IconComponent = GiAutoRepair;
    let bgClass = 'bg-blue-500/10';
    let textColorClass = 'text-blue-400';

    if (name.includes('battery') || name.includes('بطارية') || iconKey.includes('battery')) {
      IconComponent = GiBattery;
      bgClass = 'bg-amber-500/10';
      textColorClass = 'text-amber-400';
    } else if (name.includes('oil') || name.includes('زيت') || iconKey.includes('oil')) {
      IconComponent = GiOilDrum;
      bgClass = 'bg-blue-500/10';
      textColorClass = 'text-blue-400';
    } else if (name.includes('tire') || name.includes('إطار') || iconKey.includes('tire')) {
      IconComponent = GiCarWheel;
      bgClass = 'bg-emerald-500/10';
      textColorClass = 'text-emerald-400';
    } else if (name.includes('wash') || name.includes('غسيل') || iconKey.includes('wash')) {
      IconComponent = MdLocalCarWash;
      bgClass = 'bg-indigo-500/10';
      textColorClass = 'text-indigo-400';
    }

    return { IconComponent, bgClass, textColorClass };
  }, []);

  const value = {
    orders,
    dashboardData,
    loading,
    error,
    refreshing,
    refreshOrders: fetchOrders,
    refreshDashboard: fetchDashboard,
    refreshAll,
    getStatus,
    getServiceStyle
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
