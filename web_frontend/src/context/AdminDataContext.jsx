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
    'Pending': { label: 'قيد المراجعة', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', icon: FiClock },
    'Accepted': { label: 'تمت الموافقة', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500', icon: FiCheckCircle },
    'InProgress': { label: 'جاري التنفيذ', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', icon: FiRefreshCw },
    'Completed': { label: 'مكتمل', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500', icon: FiCheckSquare },
    'Rejected': { label: 'مرفوض', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', icon: FiXCircle },
    'Cancelled': { label: 'ملغي', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500', icon: FiXCircle },
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
    const serviceColor = typeof service === 'object' ? service?.color : null;

    const name = (serviceName || '').toLowerCase();
    const iconKey = (serviceIcon || '').toLowerCase();

    let IconComponent = GiAutoRepair;
    let color = '#1E88E5'; // Default blue

    // Prioritize our defined brand colors for known services to ensure consistency
    if (name.includes('battery') || name.includes('بطارية') || iconKey.includes('battery')) {
      IconComponent = GiBattery;
      color = '#F59E0B'; // Amber
    } else if (name.includes('oil') || name.includes('زيت') || iconKey.includes('oil')) {
      IconComponent = GiOilDrum;
      color = '#3B82F6'; // Blue
    } else if (name.includes('tire') || name.includes('إطار') || iconKey.includes('tire')) {
      IconComponent = GiCarWheel;
      color = '#10B981'; // Emerald
    } else if (name.includes('wash') || name.includes('غسيل') || iconKey.includes('wash')) {
      IconComponent = MdLocalCarWash;
      color = '#6366F1'; // Indigo
    } else if (serviceColor) {
      // Fallback to API color if it's a service we don't recognize
      color = serviceColor;
    }

    return { color, IconComponent };
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
