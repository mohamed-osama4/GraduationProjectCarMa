import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  DollarSign, 
  Activity,
  Battery,
  Droplets,
  Wrench,
  Clock,
  AlertTriangle,
  Info,
  Loader2,
  CheckCircle
} from 'lucide-react';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import StatCard from '../../../component/dashboard/StatCard';
import OrderApprovalCard from '../../../component/dashboard/OrderApprovalCard';
import AlertCard from '../../../component/dashboard/AlertCard';
import { getAdminDashboard, updateOrderStatus } from '../../../services/adminService';

const AdminHome = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await getAdminDashboard();
      setData(response.data);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      setError("تعذر تحميل بيانات لوحة التحكم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleApprove = async (id) => {
    try {
      // Assuming status 2 is Accepted
      await updateOrderStatus(id, 2);
      fetchDashboard();
    } catch (err) {
      console.error("Error approving order:", err);
      alert("فشل في قبول الطلب");
    }
  };

  const handleReject = async (id) => {
    try {
      // Assuming status 3 is Rejected/Cancelled
      await updateOrderStatus(id, 3);
      fetchDashboard();
    } catch (err) {
      console.error("Error rejecting order:", err);
      alert("فشل في رفض الطلب");
    }
  };

  // Map API data to UI stats
  const stats = [
    {
      title: 'إيرادات اليوم',
      value: data?.stats?.todayRevenue !== undefined ? `${data.stats.todayRevenue.toLocaleString()} جنيه` : '0 جنيه',
      trend: '+0%',
      trendUp: true,
      icon: DollarSign,
      iconBg: 'bg-green-100',
    },
    {
      title: 'الورش المتاحة',
      value: data?.stats?.totalTechs || '0',
      subValue: `إجمالي الورش`,
      icon: Users,
      iconBg: 'bg-purple-100',
    },
    {
      title: 'مكتملة اليوم',
      value: data?.stats?.completedToday || '0',
      trend: '+0%',
      trendUp: true,
      icon: CheckCircle,
      iconBg: 'bg-green-100',
    },
    {
      title: 'جاري التنفيذ',
      value: data?.stats?.inProgressOrders || '0',
      trend: '+0',
      trendUp: true,
      icon: Activity,
      iconBg: 'bg-cyan-100',
    },
    {
      title: 'قيد المراجعة',
      value: data?.stats?.pendingOrders || '0',
      trend: '+0',
      trendUp: true,
      icon: Clock,
      iconBg: 'bg-yellow-100',
    },
    {
      title: 'إجمالي الطلبات',
      value: data?.stats?.totalOrders ? data.stats.totalOrders.toLocaleString() : '0',
      trend: '+0%',
      trendUp: true,
      icon: TrendingUp,
      iconBg: 'bg-blue-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-tajawal">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-slate-500 font-bold">جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-tajawal">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <p className="text-red-600 font-bold">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-bold"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const pendingOrders = data?.requestsNeedingApproval || [];
  const activeOrders = data?.currentOrders || [];
  const alerts = data?.notifications || [];

  const getServiceIcon = (serviceName) => {
    if (!serviceName) return Briefcase;
    const name = serviceName.toLowerCase();
    if (name.includes('battery') || name.includes('بطارية')) return Battery;
    if (name.includes('oil') || name.includes('زيت')) return Droplets;
    if (name.includes('tire') || name.includes('إطارات')) return Wrench;
    return Briefcase;
  };

  const getServiceColor = (serviceName) => {
    if (!serviceName) return 'bg-slate-500 shadow-slate-100';
    const name = serviceName.toLowerCase();
    if (name.includes('battery') || name.includes('بطارية')) return 'bg-amber-500 shadow-amber-100';
    if (name.includes('oil') || name.includes('زيت')) return 'bg-blue-500 shadow-blue-100';
    if (name.includes('tire') || name.includes('إطارات')) return 'bg-emerald-500 shadow-emerald-100';
    return 'bg-indigo-500 shadow-indigo-100';
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="font-tajawal">
      <DashboardHeader 
        title="لوحة التحكم" 
        subtitle="مرحباً بك مجدداً، إليك ملخص العمليات اليوم"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Pending Approvals */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">طلبات بانتظار الموافقة</h2>
            <button className="text-primary font-bold hover:underline">عرض الكل</button>
          </div>
          
          <div className="space-y-4">
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order, idx) => (
                <OrderApprovalCard 
                  key={order.id || idx} 
                  id={order.id}
                  service={order.serviceName}
                  customer={order.customerName}
                  phone={order.phoneNumber}
                  time={formatTime(order.createdAt)}
                  location={order.address}
                  price={order.price}
                  rating={order.customerRate || "5.0"}
                  prevOrders={order.customerPrevOrders || "0"}
                  icon={getServiceIcon(order.serviceName)}
                  colorClass={getServiceColor(order.serviceName)}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))

            ) : (
              <div className="bg-white p-8 rounded-[2.5rem] text-center border border-dashed border-gray-200">
                <p className="text-slate-400 font-bold">لا توجد طلبات جديدة حالياً</p>
              </div>
            )}
          </div>

          {/* Active Orders Section */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">الطلبات النشطة</h2>
              <button className="text-primary font-bold hover:underline">عرض الكل</button>
            </div>
            
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-sm font-black text-slate-800">رقم الطلب</th>
                      <th className="px-6 py-4 text-sm font-black text-slate-800">الخدمة</th>
                      <th className="px-6 py-4 text-sm font-black text-slate-800">العميل</th>
                      <th className="px-6 py-4 text-sm font-black text-slate-800">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {activeOrders.length > 0 ? (
                      activeOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-sm text-slate-800">#{order.id}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{order.serviceName}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{order.customerName}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black">
                              {order.status === 'Accepted' ? 'مقبول' : order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-bold">لا توجد طلبات نشطة حالياً</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>


        {/* Sidebar Content: Alerts & Recent Activity */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-6">تنبيهات هامة</h2>
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <AlertCard 
                    key={alert.id}
                    title={alert.title}
                    description={alert.description}
                    time={alert.time}
                    type={alert.type === 'urgent' ? 'emergency' : alert.type || 'info'}
                    icon={alert.type === 'urgent' ? AlertTriangle : Info}
                  />
                ))
              ) : (
                <div className="bg-white p-6 rounded-[2.5rem] text-center border border-dashed border-gray-200">
                  <p className="text-slate-400 font-bold text-sm">لا توجد تنبيهات جديدة</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-xl font-black text-slate-800 mb-6">نشاط الورش</h2>
            <div className="space-y-6">
              {data?.techniciansActivity?.length > 0 ? (
                data.techniciansActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                      {activity.technicianName?.[0] || 'ف'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{activity.technicianName}</p>
                      <p className="text-xs text-slate-500">{activity.description}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mr-auto">{activity.timeAgo}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center">لا يوجد نشاط مسجل مؤخراً</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
