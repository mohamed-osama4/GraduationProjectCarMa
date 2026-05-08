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
  MoreVertical
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import { searchOrders, acceptOrder, rejectOrder } from '../../../services/adminService';
import { GiBattery50 as GiBattery, GiOilDrum, GiCarWheel, GiAutoRepair } from 'react-icons/gi';
import { MdLocalCarWash } from 'react-icons/md';
import { FiList, FiClock, FiCheckCircle, FiRefreshCw, FiCheckSquare, FiXCircle } from 'react-icons/fi';

const ITEMS_PER_PAGE = 8;

const AdminOrders = () => {
  const [searchParams] = useSearchParams();
  const orderIdFromUrl = searchParams.get('id');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(orderIdFromUrl || '');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (orderIdFromUrl) {
      setSearchTerm(orderIdFromUrl);
    }
  }, [orderIdFromUrl]);

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const response = await searchOrders();
      setOrders(response.data?.orders || response.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("تعذر تحميل قائمة الطلبات");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Status config
  const statusConfig = {
    'Pending': { label: 'قيد المراجعة', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', cardBg: 'bg-amber-50', cardBorder: 'border-amber-200', cardText: 'text-amber-700', icon: FiClock },
    'Accepted': { label: 'تمت الموافقة', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500', cardBg: 'bg-teal-50', cardBorder: 'border-teal-200', cardText: 'text-teal-700', icon: FiCheckCircle },
    'InProgress': { label: 'جاري التنفيذ', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', cardBg: 'bg-blue-50', cardBorder: 'border-blue-200', cardText: 'text-blue-700', icon: FiRefreshCw },
    'Completed': { label: 'مكتمل', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500', cardBg: 'bg-green-50', cardBorder: 'border-green-200', cardText: 'text-green-700', icon: FiCheckSquare },
    'Rejected': { label: 'مرفوض', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', cardBg: 'bg-red-50', cardBorder: 'border-red-200', cardText: 'text-red-700', icon: FiXCircle },
    'Cancelled': { label: 'ملغي', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500', cardBg: 'bg-gray-50', cardBorder: 'border-gray-200', cardText: 'text-gray-700', icon: FiXCircle },
  };

  const getStatus = (status) => {
    const value = status?.value || status;
    return statusConfig[value] || statusConfig['Pending'];
  };

  // Service icon color mapping
  const getServiceStyle = (service) => {
    const color = service?.color || '#1E88E5';
    const icon = service?.icon || '';
    let IconComponent = GiAutoRepair;
    if (icon.includes('battery')) IconComponent = GiBattery;
    else if (icon.includes('oil')) IconComponent = GiOilDrum;
    else if (icon.includes('tire')) IconComponent = GiCarWheel;
    else if (icon.includes('wash')) IconComponent = MdLocalCarWash;
    return { color, IconComponent };
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
      await fetchOrders(true);
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
      await fetchOrders(true);
    } catch (err) {
      console.error("Error rejecting order:", err);
      alert("فشل في رفض الطلب");
    } finally {
      setActionLoading(null);
    }
  };


  // Summary cards config
  const summaryCards = [
    { key: 'all', label: 'الكل', count: statusCounts.all, color: 'bg-blue-600', lightBg: 'bg-blue-50', textColor: 'text-blue-600', Icon: FiList },
    { key: 'Pending', label: 'قيد المراجعة', count: statusCounts.Pending, color: 'bg-amber-500', lightBg: 'bg-amber-50', textColor: 'text-amber-600', Icon: FiClock },
    { key: 'Accepted', label: 'تمت الموافقة', count: statusCounts.Accepted, color: 'bg-teal-500', lightBg: 'bg-teal-50', textColor: 'text-teal-600', Icon: FiCheckCircle },
    { key: 'InProgress', label: 'جاري التنفيذ', count: statusCounts.InProgress, color: 'bg-blue-500', lightBg: 'bg-blue-50', textColor: 'text-blue-600', Icon: FiRefreshCw },
    { key: 'Completed', label: 'مكتمل', count: statusCounts.Completed, color: 'bg-green-500', lightBg: 'bg-green-50', textColor: 'text-green-600', Icon: FiCheckSquare },
    { key: 'Rejected', label: 'مرفوض', count: statusCounts.Rejected, color: 'bg-red-500', lightBg: 'bg-red-50', textColor: 'text-red-600', Icon: FiXCircle },
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
    <div className="font-tajawal">
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
                ? `${card.lightBg} ${card.textColor} border-current shadow-[0_20px_50px_rgba(0,0,0,0.1)] scale-[1.05] z-10` 
                : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1'
              }`}
          >
            <div className="flex flex-col items-center gap-3 relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12
                ${activeFilter === card.key ? `${card.color} text-white shadow-lg` : `${card.lightBg} ${card.textColor}`}`}>
                <card.Icon size={24} />
              </div>
              <div className="flex flex-col items-center">
                <span className={`text-4xl font-black tracking-tight ${activeFilter === card.key ? card.textColor : 'text-slate-800'}`}>
                  {card.count}
                </span>
                <span className={`text-[13px] font-bold mt-1 uppercase tracking-wider ${activeFilter === card.key ? card.textColor : 'text-slate-500'}`}>
                  {card.label}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white/70 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-sm border border-gray-100 mb-6 sticky top-4 z-20 transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full group">
            <input 
              type="text" 
              placeholder="ابحث برقم الطلب، اسم العميل، الخدمة، أو الموقع..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-4 pr-14 pl-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all duration-300"
            />
            <Search size={22} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => fetchOrders(true)} 
              disabled={refreshing}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 px-6 py-4 rounded-2xl text-sm font-black transition-all duration-300 shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={18} className={`${refreshing ? 'animate-spin' : ''} text-primary`} />
              <span className="hidden sm:inline">تحديث البيانات</span>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-50">
          {filterChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => setActiveFilter(chip.key)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200
                ${activeFilter === chip.key
                  ? 'bg-primary text-white shadow-md shadow-primary/30 scale-105'
                  : 'bg-gray-50 text-slate-600 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              <span>{chip.count}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gradient-to-l from-gray-50 to-white border-b border-gray-100">
                <th className="px-4 py-4 text-xs font-black text-slate-500 whitespace-nowrap">#</th>
                <th className="px-4 py-4 text-xs font-black text-slate-500 whitespace-nowrap">الخدمة</th>
                <th className="px-4 py-4 text-xs font-black text-slate-500 whitespace-nowrap">العميل</th>
                <th className="px-4 py-4 text-xs font-black text-slate-500 whitespace-nowrap">الموقع</th>
                <th className="px-4 py-4 text-xs font-black text-slate-500 whitespace-nowrap">التاريخ والوقت</th>
                <th className="px-4 py-4 text-xs font-black text-slate-500 whitespace-nowrap">الحالة</th>
                <th className="px-4 py-4 text-xs font-black text-slate-500 whitespace-nowrap">الدفع</th>
                <th className="px-4 py-4 text-xs font-black text-slate-500 whitespace-nowrap">السعر</th>
                <th className="px-4 py-4 text-xs font-black text-slate-500 whitespace-nowrap">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => {
                  const status = getStatus(order.status);
                  const serviceStyle = getServiceStyle(order.service);
                  const cleanId = order.id?.toString().replace('#', '');
                  const isThisLoading = actionLoading === cleanId;
                  const statusValue = order.status?.value || order.status;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition-all duration-200 group">
                      {/* Order ID */}
                      <td className="px-4 py-4">
                        <span className="font-black text-slate-800 text-sm">{order.id}</span>
                      </td>

                      {/* Service */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                            style={{ backgroundColor: serviceStyle.color }}
                          >
                            <serviceStyle.IconComponent size={18} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 whitespace-nowrap">{order.service?.name}</span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{order.customer?.name}</span>
                          {order.customer?.rating && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star size={12} className="text-amber-400 fill-amber-400" />
                              <span className="text-xs text-slate-500 font-bold">{order.customer.rating}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-slate-400 shrink-0" />
                          <span className="text-sm text-slate-600 truncate max-w-[120px]">{order.location}</span>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-400 shrink-0" />
                          <span className="text-xs text-slate-600 font-medium whitespace-nowrap">{order.dateTime}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}>
                          <status.icon size={13} className={statusValue === 'InProgress' ? 'animate-spin' : ''} />
                          <span className="text-[11px] font-black whitespace-nowrap">{order.status?.label || status.label}</span>
                        </div>
                      </td>



                      {/* Payment */}
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold
                          ${order.paymentStatus === 'مدفوع'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-orange-50 text-orange-700 border border-orange-200'}`}
                        >
                          <CreditCard size={12} />
                          <span className="whitespace-nowrap">{order.paymentStatus}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-4">
                        <span className="font-black text-slate-800 text-sm whitespace-nowrap">{order.price}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          {/* Show accept/reject only for Pending (قيد المراجعة) */}
                          {(statusValue === 'Pending' || statusValue === 'pending' || statusValue === 'قيد المراجعة') && (
                            <>
                              <button
                                onClick={() => handleAccept(order.id)}
                                disabled={isThisLoading}
                                title="قبول"
                                className="p-2 hover:bg-green-50 rounded-xl text-green-600 hover:text-green-700 transition-all disabled:opacity-50"
                              >
                                {isThisLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                              </button>
                              <button
                                onClick={() => handleReject(order.id)}
                                disabled={isThisLoading}
                                title="حذف"
                                className="p-2 hover:bg-red-50 rounded-xl text-red-500 hover:text-red-600 transition-all disabled:opacity-50"
                              >
                                <X size={16} />
                              </button>
                            </>
                          )}
                          <button
                            title="عرض التفاصيل"
                            className="p-2 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"
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
                  <td colSpan="10" className="px-6 py-16 text-center">
                    <Search size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-400 font-bold text-lg">لا توجد طلبات تطابق بحثك</p>
                    <p className="text-slate-300 text-sm mt-1">جرّب تغيير عبارة البحث أو مرشح الحالة</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 gap-3">
            {/* Next */}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-gray-50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              <span>التالي</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 rounded-xl text-sm font-black transition-all duration-200
                    ${currentPage === page
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                      : 'text-slate-600 hover:bg-gray-100'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Previous */}
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-gray-50 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span>السابق</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="px-6 py-3 bg-gray-50/50 text-center border-t border-gray-100">
          <p className="text-xs text-slate-400 font-bold">
            عرض {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} من أصل {filteredOrders.length} طلب
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
