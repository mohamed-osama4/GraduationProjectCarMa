import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  AlertTriangle,
  Star,
  RefreshCw,

  ChevronLeft,
  ChevronRight,
  XCircle,
  Check,
  X,
  MapPin,
  Calendar,
  CreditCard,
  MoreVertical,
  User,
  Settings,
  ClipboardList
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import { searchOrders, acceptOrder, rejectOrder, getOrderById } from '../../../services/adminService';
import { GiBattery50 as GiBattery, GiOilDrum, GiCarWheel, GiAutoRepair } from 'react-icons/gi';
import { MdLocalCarWash } from 'react-icons/md';
import { FiList, FiClock, FiCheckCircle, FiRefreshCw, FiCheckSquare, FiXCircle } from 'react-icons/fi';

import { useAdminData } from '../../../context/AdminDataContext';

const ITEMS_PER_PAGE = 8;

const AdminOrders = () => {
  const [searchParams] = useSearchParams();
  const orderIdFromUrl = searchParams.get('id');

  const { orders, loading, error, refreshing, refreshAll, getStatus, getServiceStyle } = useAdminData();
  const [searchTerm, setSearchTerm] = useState(orderIdFromUrl || '');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  
  // Details Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (orderIdFromUrl) {
      setSearchTerm(orderIdFromUrl);
    }
  }, [orderIdFromUrl]);

  const fetchOrders = async (isRefresh = false) => {
    refreshAll();
  };

  // Count orders by status
  const statusCounts = useMemo(() => {
    const counts = { all: orders.length, Pending: 0, Accepted: 0, InProgress: 0, Completed: 0, Rejected: 0, Cancelled: 0 };
    orders.forEach(order => {
      const val = order.status?.value || order.status;
      if (counts[val] !== undefined) counts[val]++;
    });
    return counts;
  }, [orders]);

  // Filter + search
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const statusValue = order.status?.value || order.status;
      const matchesFilter = activeFilter === 'all' || statusValue === activeFilter;

      if (!searchTerm) return matchesFilter;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        order.id?.toString().toLowerCase().includes(term) ||
        order.service?.name?.toLowerCase().includes(term) ||
        order.customer?.name?.toLowerCase().includes(term) ||
        order.location?.toLowerCase().includes(term) ||
        order.technician?.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [orders, activeFilter, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);

  // Actions
  const handleAccept = async (orderId) => {
    const cleanId = orderId?.toString().replace('#', '');
    try {
      setActionLoading(cleanId);
      await acceptOrder(cleanId);
      await refreshAll();
    } catch (err) {
      console.error("Error accepting order:", err);
      alert("فشل في قبول الطلب");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (orderId) => {
    const cleanId = orderId?.toString().replace('#', '');
    try {
      setActionLoading(cleanId);
      await rejectOrder(cleanId);
      await refreshAll();
    } catch (err) {
      console.error("Error rejecting order:", err);
      alert("فشل في رفض الطلب");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = async (orderId) => {
    const cleanId = orderId?.toString().replace('#', '');
    try {
      setModalLoading(true);
      setShowModal(true);
      const { data } = await getOrderById(cleanId);
      setSelectedOrder(data.data || data);
    } catch (err) {
      console.error("Error fetching order details:", err);
    } finally {
      setModalLoading(false);
    }
  };


  // Summary cards config
  const summaryCards = [
    { key: 'all', label: 'الكل', count: statusCounts.all, color: 'text-indigo-400', bgClass: 'bg-indigo-500/10', borderClass: 'border-indigo-500/20', Icon: FiList },
    { key: 'Pending', label: 'قيد المراجعة', count: statusCounts.Pending, color: 'text-amber-400', bgClass: 'bg-amber-500/10', borderClass: 'border-amber-500/20', Icon: FiClock },
    { key: 'Accepted', label: 'تمت الموافقة', count: statusCounts.Accepted, color: 'text-teal-400', bgClass: 'bg-teal-500/10', borderClass: 'border-teal-500/20', Icon: FiCheckCircle },
    { key: 'InProgress', label: 'جاري التنفيذ', count: statusCounts.InProgress, color: 'text-blue-400', bgClass: 'bg-blue-500/10', borderClass: 'border-blue-500/20', Icon: FiRefreshCw },
    { key: 'Completed', label: 'مكتمل', count: statusCounts.Completed, color: 'text-emerald-400', bgClass: 'bg-emerald-500/10', borderClass: 'border-emerald-500/20', Icon: FiCheckSquare },
    { key: 'Rejected', label: 'مرفوض', count: statusCounts.Rejected, color: 'text-red-400', bgClass: 'bg-red-500/10', borderClass: 'border-red-500/20', Icon: FiXCircle },
  ];

  // Filter chips (same as summary cards but as inline chips)
  const filterChips = [
    { key: 'all', label: 'الكل', count: statusCounts.all },
    { key: 'Pending', label: 'قيد المراجعة', count: statusCounts.Pending },
    { key: 'Accepted', label: 'تمت الموافقة', count: statusCounts.Accepted },
    { key: 'InProgress', label: 'جاري التنفيذ', count: statusCounts.InProgress },
    { key: 'Completed', label: 'مكتمل', count: statusCounts.Completed },
    { key: 'Rejected', label: 'مرفوض', count: statusCounts.Rejected },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-tajawal">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-slate-500 font-bold">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-tajawal">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <p className="text-red-600 font-bold">{error}</p>
        <button onClick={() => { setError(null); fetchOrders(); }} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-bold">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="font-tajawal min-h-screen">
      <DashboardHeader
        title="الطلبات"
        subtitle={`إجمالي ${orders.length} طلب في النظام`}
      />

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 mt-6">
        {summaryCards.map((card) => (
            <button
            key={card.key}
            onClick={() => setActiveFilter(card.key)}
            className={`relative group overflow-hidden rounded-[2rem] p-5 transition-all duration-500 border-2 
              ${activeFilter === card.key
                ? `${card.bgClass} ${card.borderClass} shadow-2xl scale-[1.05] z-10`
                : 'bg-[#121212] border-white/5 hover:border-white/10 hover:shadow-xl hover:-translate-y-1'
              }`}
          >
            <div className={`absolute top-0 right-0 w-16 h-16 ${card.bgClass} blur-2xl rounded-full -mr-8 -mt-8 opacity-50 group-hover:opacity-100 transition-all`}></div>
            <div className="flex flex-col items-center gap-3 relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12
                ${activeFilter === card.key ? `bg-white text-black shadow-lg` : `${card.bgClass} ${card.color}`}`}>
                <card.Icon size={24} />
              </div>
              <div className="flex flex-col items-center">
                <span className={`text-4xl font-black tracking-tight ${activeFilter === card.key ? 'text-white' : 'text-white'}`}>
                  {card.count}
                </span>
                <span className={`text-[11px] font-black mt-1 uppercase tracking-widest ${activeFilter === card.key ? 'text-white/70' : 'text-slate-500'}`}>
                  {card.label}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-[#121212] p-5 rounded-[2.5rem] shadow-2xl border border-white/5 mb-6 transition-all duration-300 hover:border-white/10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full group">
            <input
              type="text"
              placeholder="ابحث برقم الطلب، اسم العميل، الخدمة، أو الموقع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-2xl py-4 pr-14 pl-6 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-[#D9B07C]/10 focus:border-[#D9B07C]/30 focus:bg-[#1a1a1a] transition-all duration-300"
            />
            <Search size={22} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#D9B07C] transition-colors" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 text-[#D9B07C] px-6 py-4 rounded-2xl text-sm font-black transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={18} className={`${refreshing ? 'animate-spin' : ''} text-[#D9B07C]`} />
              <span className="hidden sm:inline">تحديث البيانات</span>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
          {filterChips.map((chip) => {
            const card = summaryCards.find(c => c.key === chip.key);
            const isActive = activeFilter === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => setActiveFilter(chip.key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all duration-300
                  ${isActive
                    ? `${card?.bgClass || 'bg-[#D9B07C]/10'} ${card?.color || 'text-[#D9B07C]'} border border-white/10 shadow-lg scale-105`
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                  }`}
              >
                <span className={isActive ? (card?.color === 'text-white' ? 'text-white' : card?.color) : 'text-[#D9B07C]'}>
                  {chip.count}
                </span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121212] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-5 text-xs font-black text-[#D9B07C] whitespace-nowrap uppercase tracking-widest">#</th>
                <th className="px-6 py-5 text-xs font-black text-[#D9B07C] whitespace-nowrap uppercase tracking-widest">الخدمة</th>
                <th className="px-6 py-5 text-xs font-black text-[#D9B07C] whitespace-nowrap uppercase tracking-widest">العميل</th>
                <th className="px-6 py-5 text-xs font-black text-[#D9B07C] whitespace-nowrap uppercase tracking-widest">الموقع</th>
                <th className="px-6 py-5 text-xs font-black text-[#D9B07C] whitespace-nowrap uppercase tracking-widest">التاريخ والوقت</th>
                <th className="px-6 py-5 text-xs font-black text-[#D9B07C] whitespace-nowrap uppercase tracking-widest">الحالة</th>
                <th className="px-6 py-5 text-xs font-black text-[#D9B07C] whitespace-nowrap uppercase tracking-widest">الدفع</th>
                <th className="px-6 py-5 text-xs font-black text-[#D9B07C] whitespace-nowrap uppercase tracking-widest">السعر</th>
                <th className="px-6 py-5 text-xs font-black text-[#D9B07C] whitespace-nowrap uppercase tracking-widest text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => {
                  const status = getStatus(order.status);
                  const serviceStyle = getServiceStyle(order.service);
                  const cleanId = order.id?.toString().replace('#', '');
                  const isThisLoading = actionLoading === cleanId;
                  const statusValue = order.status?.value || order.status;

                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-all duration-300 group">
                      {/* Order ID */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-white">#{order.id}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">رقم العملية</span>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div 
                            className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-black/20 shrink-0 ${serviceStyle.bgClass} ${serviceStyle.textColorClass}`}
                          >
                            <serviceStyle.IconComponent size={20} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-200 whitespace-nowrap">{order.service?.name}</span>
                            <span className="text-[10px] text-slate-500 font-bold">صيانة احترافية</span>
                          </div>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-200">{order.customer?.name}</span>
                          <span className="text-xs text-slate-500 font-medium" dir="ltr">{order.customer?.phone}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-200 transition-colors">
                          <MapPin size={14} className="text-[#D9B07C]" />
                          <span className="text-xs font-bold truncate max-w-[150px]">{order.location}</span>
                        </div>
                      </td>

                      {/* Date/Time */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col text-slate-400 group-hover:text-slate-200 transition-colors">
                          <div className="flex items-center gap-1 text-xs font-black">
                            <Calendar size={12} className="text-[#D9B07C]" />
                            <span>{order.dateTime}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border transition-all ${status.bg} ${status.text} border-white/5`}>
                          <status.icon size={12} className={statusValue === 'InProgress' ? 'animate-spin' : ''} />
                          {status.label}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-400">
                          <CreditCard size={14} className="text-[#D9B07C]" />
                          <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{order.paymentStatus}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-white whitespace-nowrap">
                          {order.price} <span className="text-[10px] text-[#D9B07C] font-bold">ج.م</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          {statusValue === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleAccept(order.id)}
                                disabled={isThisLoading}
                                className="p-2.5 bg-[#D9B07C]/10 text-[#D9B07C] hover:bg-[#D9B07C] hover:text-black rounded-xl transition-all active:scale-90"
                                title="قبول الطلب"
                              >
                                {isThisLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                              </button>
                              <button
                                onClick={() => handleReject(order.id)}
                                disabled={isThisLoading}
                                className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-90"
                                title="رفض الطلب"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleViewDetails(order.id)}
                            className="p-2.5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white rounded-xl transition-all active:scale-90"
                            title="عرض التفاصيل"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center text-slate-600">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-500 font-bold">لا توجد طلبات تطابق معايير البحث</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-[#121212] border-t border-white/5 flex flex-col sm:flex-row gap-6 items-center justify-between">
            {/* Next */}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 text-sm font-black text-slate-400 hover:bg-white/5 hover:text-[#D9B07C] rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              <span>التالي</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-black transition-all duration-300
                    ${currentPage === page 
                      ? 'bg-[#D9B07C] text-black shadow-lg shadow-[#D9B07C]/20 scale-110' 
                      : 'text-slate-500 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'}`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Previous */}
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 text-sm font-black text-slate-400 hover:bg-white/5 hover:text-[#D9B07C] rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>السابق</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="px-6 py-3 bg-white/5 text-center border-t border-white/5">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
            عرض {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} من أصل {filteredOrders.length} طلب
          </p>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#121212] w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]" data-aos="zoom-in" data-aos-duration="300">
            {/* Header */}
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#D9B07C]/10 rounded-2xl text-[#D9B07C]">
                  <FiList size={24} />
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-black text-white">تفاصيل الطلب</h3>
                  <p className="text-[#D9B07C] text-[10px] font-black uppercase tracking-widest mt-0.5">#{selectedOrder?.id || '...'}</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 size={48} className="text-[#D9B07C] animate-spin mb-4" />
                  <p className="text-slate-500 font-bold">جاري تحميل البيانات...</p>
                </div>
              ) : selectedOrder ? (
                <div className="space-y-8 text-right">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#D9B07C]/5 blur-2xl rounded-full -mr-8 -mt-8"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 relative z-10">الحالة</span>
                      <div className="flex items-center gap-2 relative z-10">
                        <span className="font-black text-white">{getStatus(selectedOrder.status).label}</span>
                        <div className={`p-1.5 rounded-lg ${getStatus(selectedOrder.status).bg} ${getStatus(selectedOrder.status).text} bg-opacity-20 border border-white/5`}>
                          {getStatus(selectedOrder.status).icon}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5 shadow-xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#D9B07C]/5 blur-2xl rounded-full -mr-8 -mt-8"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 relative z-10">التكلفة</span>
                      <div className="flex items-center gap-1 justify-end text-[#D9B07C] relative z-10">
                        <span className="text-2xl font-black">{selectedOrder.totalPrice}</span>
                        <span className="text-xs font-bold">ج.م</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-white/5 rounded-2xl text-[#D9B07C] border border-white/5">
                        <User size={20} />
                      </div>
                      <div className="text-right">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">بيانات العميل</h4>
                        <p className="text-slate-500 text-[10px] font-bold mt-0.5 uppercase tracking-widest">معلومات الاتصال والموقع</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6 p-8 rounded-3xl border border-white/5 shadow-2xl bg-white/5 relative overflow-hidden">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#D9B07C] block font-black uppercase tracking-widest">اسم العميل</span>
                        <p className="font-bold text-white">{selectedOrder.customer?.name || 'غير متوفر'}</p>
                      </div>
                      <div className="space-y-1 text-left sm:text-right">
                        <span className="text-[10px] text-[#D9B07C] block font-black uppercase tracking-widest">رقم الهاتف</span>
                        <p className="font-bold text-white" dir="ltr">{selectedOrder.customer?.phone || 'غير متوفر'}</p>
                      </div>
                      <div className="sm:col-span-2 space-y-2 pt-4 border-t border-white/5">
                        <span className="text-[10px] text-[#D9B07C] block font-black uppercase tracking-widest">العنوان</span>
                        <div className="flex items-start gap-3 text-slate-300">
                          <MapPin size={18} className="text-[#D9B07C] mt-0.5 shrink-0" />
                          <p className="font-bold text-sm leading-relaxed">{selectedOrder.location || 'غير متوفر'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Info */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-white/5 rounded-2xl text-[#D9B07C] border border-white/5">
                        <ClipboardList size={20} />
                      </div>
                      <div className="text-right">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">بيانات الخدمة</h4>
                        <p className="text-slate-500 text-[10px] font-bold mt-0.5 uppercase tracking-widest">تفاصيل الصيانة والوقت</p>
                      </div>
                    </div>
                    <div className="p-8 rounded-3xl border border-white/5 space-y-8 shadow-2xl bg-white/5">
                      <div className="flex items-center gap-5">
                        <div className="p-5 rounded-2xl bg-[#D9B07C] text-black shadow-lg shadow-[#D9B07C]/10">
                          {getServiceStyle(selectedOrder.service?.name).icon}
                        </div>
                        <div className="text-right">
                          <p className="font-black text-white text-xl">{selectedOrder.service?.name}</p>
                          <p className="text-[#D9B07C] text-[10px] font-black uppercase tracking-widest mt-0.5">نوع الخدمة المختارة</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                        <div className="flex flex-col items-start bg-white/5 p-4 rounded-2xl border border-white/5">
                          <span className="text-[10px] text-[#D9B07C] font-black uppercase tracking-widest mb-2">وقت التنفيذ</span>
                          <div className="flex items-center gap-2 text-white">
                            <Clock size={14} className="text-[#D9B07C]" />
                            <span className="font-black text-sm">{selectedOrder.executionTime || '---'}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-start bg-white/5 p-4 rounded-2xl border border-white/5">
                          <span className="text-[10px] text-[#D9B07C] font-black uppercase tracking-widest mb-2">تاريخ الحجز</span>
                          <div className="flex items-center gap-2 text-white">
                            <Calendar size={14} className="text-[#D9B07C]" />
                            <span className="font-black text-sm">{new Date(selectedOrder.createdAt).toLocaleDateString('ar-EG')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  {selectedOrder.notes && (
                    <div className="pb-4">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-3 justify-end">
                        ملاحظات إضافية
                        <div className="flex-1 h-[1px] bg-white/5"></div>
                      </h4>
                      <div className="p-6 rounded-2xl bg-[#D9B07C]/5 border border-[#D9B07C]/10 text-white text-sm font-bold leading-relaxed">
                        {selectedOrder.notes}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20">
                  <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">حدث خطأ أثناء تحميل تفاصيل الطلب</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-white/5 border-t border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-500">
                <CreditCard size={18} className="text-[#D9B07C]" />
                <span className="text-[10px] font-black uppercase tracking-widest">الدفع عند الاستلام</span>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="px-10 py-3.5 bg-[#D9B07C] text-black rounded-2xl font-black text-sm hover:bg-[#D9B07C]/90 transition-all shadow-xl shadow-[#D9B07C]/10 active:scale-95"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
