import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  AlertTriangle,
  Battery,
  Droplets,
  Wrench,
  Briefcase
} from 'lucide-react';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import { searchOrders } from '../../../services/adminService';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await searchOrders();
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("تعذر تحميل قائمة الطلبات");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'مكتمل', icon: CheckCircle };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'قيد الانتظار', icon: Clock };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'ملغي', icon: AlertCircle };
      default:
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: status, icon: Clock };
    }
  };

  const getServiceIcon = (serviceName) => {
    if (!serviceName) return Briefcase;
    const name = serviceName.toLowerCase();
    if (name.includes('battery') || name.includes('بطارية')) return Battery;
    if (name.includes('oil') || name.includes('زيت')) return Droplets;
    if (name.includes('tire') || name.includes('إطارات')) return Wrench;
    return Briefcase;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.id).includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || order.status?.toLowerCase() === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

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
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-bold">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="font-tajawal">
      <DashboardHeader 
        title="إدارة الطلبات" 
        subtitle={`لديك إجمالي ${orders.length} طلب في النظام`}
      />

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            placeholder="البحث برقم الطلب، اسم العميل، أو الخدمة..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pr-12 pl-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-50 border-none rounded-2xl py-3 px-6 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-primary/20 cursor-pointer w-full md:w-auto"
          >
            <option value="all">كل الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
          </select>
          
          <button className="bg-primary/10 text-primary p-3 rounded-2xl hover:bg-primary/20 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Orders Table/List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-50/50 border-bottom border-gray-100">
                <th className="px-6 py-5 text-sm font-black text-slate-800">رقم الطلب</th>
                <th className="px-6 py-5 text-sm font-black text-slate-800">العميل</th>
                <th className="px-6 py-5 text-sm font-black text-slate-800">الخدمة</th>
                <th className="px-6 py-5 text-sm font-black text-slate-800">السعر</th>
                <th className="px-6 py-5 text-sm font-black text-slate-800">الحالة</th>
                <th className="px-6 py-5 text-sm font-black text-slate-800">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const status = getStatusStyle(order.status);
                  const ServiceIcon = getServiceIcon(order.service);
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="font-black text-slate-800 text-sm">#{order.id}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {order.customerName?.[0] || 'ع'}
                          </div>
                          <span className="font-bold text-slate-700 text-sm">{order.customerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <ServiceIcon size={16} className="text-slate-400" />
                          <span className="text-sm font-medium">{order.service}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-black text-slate-800 text-sm">{order.price} جنيه</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg} ${status.text}`}>
                          <status.icon size={14} />
                          <span className="text-[11px] font-black">{status.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-xl text-slate-400 hover:text-primary transition-all">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-slate-400 font-bold">
                    لا توجد طلبات تطابق بحثك
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
