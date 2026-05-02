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
  Loader2
} from 'lucide-react';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import StatCard from '../../../component/dashboard/StatCard';
import OrderApprovalCard from '../../../component/dashboard/OrderApprovalCard';
import AlertCard from '../../../component/dashboard/AlertCard';
import { getAdminDashboard } from '../../../services/adminService';

const AdminHome = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboard();
        // Assuming response.data contains the dashboard data
        setData(response.data?.data || response.data);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        setError("تعذر تحميل بيانات لوحة التحكم");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Map API data to UI stats (matching the 6 blocks in your image)
  const stats = [
    {
      title: 'إيرادات اليوم',
      value: data?.stats?.totalRevenue ? `${data.stats.totalRevenue.toLocaleString()} جنيه` : '0 جنيه',
      trend: '+18.2%',
      trendUp: true,
      icon: DollarSign,
      iconBg: 'bg-green-100',
    },
    {
      title: 'الفنيون المتاحون',
      value: data?.stats?.totalOrders || '0', // Mapping from your JSON: totalOrders was 34
      subValue: `45 / إجمالي`,
      icon: Users,
      iconBg: 'bg-purple-100',
    },
    {
      title: 'مكتملة اليوم',
      value: data?.stats?.todayOrders || '0',
      trend: '+23.1%',
      trendUp: true,
      icon: Activity, // Check icon
      iconBg: 'bg-green-100',
    },
    {
      title: 'جاري التنفيذ',
      value: data?.stats?.activeOrders || '0',
      trend: '+8',
      trendUp: true,
      icon: Activity, // Pulse icon
      iconBg: 'bg-cyan-100',
    },
    {
      title: 'قيد المراجعة',
      value: data?.stats?.pendingOrders || '0',
      trend: '+5',
      trendUp: true,
      icon: Clock,
      iconBg: 'bg-yellow-100',
    },
    {
      title: 'إجمالي الطلبات',
      value: data?.stats?.totalRequests ? data.stats.totalRequests.toLocaleString() : '0',
      trend: '+12.5%',
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

  const pendingOrders = data?.latestRequests || [];
  const alerts = data?.notifications || [];

  const getServiceIcon = (serviceName) => {
    if (!serviceName) return Briefcase;
    const name = serviceName.toLowerCase();
    if (name.includes('بطارية')) return Battery;
    if (name.includes('زيت')) return Droplets;
    if (name.includes('إطارات')) return Wrench;
    return Briefcase;
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
                  key={order.orderNumber || idx} 
                  id={order.orderNumber}
                  service={order.service}
                  customer={order.customerName}
                  phone={order.phoneNumber}
                  time={order.date}
                  location={order.address}
                  price={order.price}
                  rating={order.customerRate || "5.0"}
                  prevOrders={order.customerPrevOrders || "0"}
                  icon={getServiceIcon(order.service)}
                />
              ))
            ) : (
              <div className="bg-white p-8 rounded-[2.5rem] text-center border border-dashed border-gray-200">
                <p className="text-slate-400 font-bold">لا توجد طلبات جديدة حالياً</p>
              </div>
            )}
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
            <h2 className="text-xl font-black text-slate-800 mb-6">نشاط الفنيين</h2>
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
