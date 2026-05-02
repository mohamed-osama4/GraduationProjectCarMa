import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import { 
  Users, 
  CheckCircle, 
  Activity, 
  XCircle, 
  Star, 
  Briefcase,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Phone,
  MapPin,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { getAdminDashboard } from '../../../services/adminService';

const TechnicianStatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => {
  return (
    <div className="bg-white p-4 lg:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow h-full">
      <div className={`p-2.5 rounded-2xl mb-3 ${bgClass} ${colorClass}`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <p className="text-slate-500 font-bold text-[13px] mb-1">{title}</p>
      <h3 className="text-[28px] font-black text-slate-800 tracking-tight leading-none mt-1">{value}</h3>
    </div>
  );
};

const TechnicianGridCard = ({ tech }) => {
  const isAvailable = tech.status === 'available' || tech.status === 'متاح';
  const statusLabel = isAvailable ? 'متاح' : (tech.status === 'busy' ? 'مشغول' : 'غير متصل');
  
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header Profile Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="bg-[#254BA6] text-white rounded-2xl w-14 h-14 flex items-center justify-center font-bold text-2xl shadow-md shadow-blue-100 shrink-0">
            {tech.name?.[0] || 'ف'}
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className={`text-[10px] px-3 py-1 rounded-full font-bold ${
              isAvailable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-slate-500'
            }`}>
              {statusLabel}
            </span>
            <h3 className="font-black text-slate-800 text-lg leading-tight mt-1">{tech.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{tech.specialty || 'فني متخصص'}</p>
          </div>
        </div>
        
        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Eye size={16} strokeWidth={2.5} />
          </button>
          <button className="p-1.5 text-amber-500 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
            <Pencil size={16} strokeWidth={2.5} />
          </button>
          <button className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Stats Box */}
      <div className="bg-gray-50/70 rounded-2xl p-4 mb-6 grid grid-cols-3 divide-x divide-x-reverse divide-gray-200">
        <div className="flex flex-col items-center justify-center px-2">
          <span className="text-2xl font-black text-blue-600">{tech.completedJobs || tech.completed || 0}</span>
          <span className="text-[11px] text-slate-500 font-bold mt-1">مكتمل</span>
        </div>
        <div className="flex flex-col items-center justify-center px-2">
          <span className="text-2xl font-black text-cyan-500">{tech.activeJobs || tech.active || 0}</span>
          <span className="text-[11px] text-slate-500 font-bold mt-1">نشط</span>
        </div>
        <div className="flex flex-col items-center justify-center px-2">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black text-slate-800">{tech.rating || 0}</span>
            <Star size={16} className="text-amber-400 fill-amber-400" />
          </div>
          <span className="text-[11px] text-slate-500 font-bold mt-1">التقييم</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 mb-6 px-1">
        <div className="flex items-center gap-3 text-slate-500">
          <Phone size={16} />
          <span className="text-sm font-medium" dir="ltr">{tech.phone || '01234567890'}</span>
        </div>
        <div className="flex items-start gap-3 text-slate-500">
          <MapPin size={16} className="shrink-0 mt-0.5" />
          <span className="text-sm font-medium leading-tight">{tech.location || 'القاهرة، مصر'}</span>
        </div>
      </div>

      {/* Progress Bar border-t added for separation similar to line in image */}
      <div className="pt-5 border-t border-gray-100">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-slate-600">معدل الإنجاز</span>
          <span className="text-sm font-black text-green-500">{tech.progress || 95}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${tech.progress || 95}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const Technicians = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboard();
        setData(response.data?.data || response.data);
      } catch (err) {
        console.error("Error fetching technicians:", err);
        setError("تعذر تحميل بيانات الفنيين");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-tajawal">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-slate-500 font-bold">جاري تحميل بيانات الفنيين...</p>
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

  const technicians = data?.technicians || [];
  
  // Calculate dynamic stats
  const availableCount = technicians.filter(t => t.status === 'available').length;
  const busyCount = technicians.filter(t => t.status === 'busy').length;
  const offlineCount = technicians.filter(t => t.status === 'offline').length;
  const avgRating = technicians.length > 0 
    ? (technicians.reduce((acc, t) => acc + (t.rating || 0), 0) / technicians.length).toFixed(1)
    : '0';

  const stats = [
    { title: 'إجمالي الفنيين', value: technicians.length, icon: Users, colorClass: 'text-blue-500', bgClass: 'bg-blue-50' },
    { title: 'متاحون', value: availableCount, icon: CheckCircle, colorClass: 'text-emerald-500', bgClass: 'bg-emerald-50' },
    { title: 'مشغولون', value: busyCount, icon: Activity, colorClass: 'text-blue-400', bgClass: 'bg-blue-50' },
    { title: 'غير متصلين', value: offlineCount, icon: XCircle, colorClass: 'text-slate-400', bgClass: 'bg-slate-50' },
    { title: 'متوسط التقييم', value: avgRating, icon: Star, colorClass: 'text-amber-500', bgClass: 'bg-amber-50' },
    { title: 'إجمالي الطلبات', value: data?.stats?.totalOrders || '0', icon: Briefcase, colorClass: 'text-purple-500', bgClass: 'bg-purple-50' },
  ];

  const filters = [
    { id: 'all', label: 'الكل', count: technicians.length },
    { id: 'available', label: 'متاحون', count: availableCount },
    { id: 'busy', label: 'مشغولون', count: busyCount },
    { id: 'offline', label: 'غير متصلين', count: offlineCount },
  ];

  // Filtering logic
  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || tech.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="font-tajawal">
      <DashboardHeader title="الفنيون" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <TechnicianStatCard key={index} {...stat} />
        ))}
      </div>

      {/* Toolbar Layer */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button className="flex items-center justify-center gap-2 bg-[#254BA6] hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-colors whitespace-nowrap shadow-md shadow-blue-200 order-2 md:order-1">
            <Plus size={20} strokeWidth={2.5} />
            إضافة فني جديد
          </button>
          
          <div className="relative flex-1 order-1 md:order-2">
            <input 
              type="text" 
              placeholder="ابحث باسم الفني..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
            />
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                activeFilter === filter.id 
                  ? 'bg-[#254BA6] text-white shadow-md shadow-blue-200' 
                  : 'bg-gray-50 text-slate-600 hover:bg-gray-100'
              }`}
            >
              <span className={`flex items-center justify-center h-6 min-w-[24px] px-2 text-[11px] rounded-full font-black ${
                activeFilter === filter.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-slate-500'
              }`}>
                {filter.count}
              </span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTechnicians.length > 0 ? (
          filteredTechnicians.map((tech, idx) => (
            <TechnicianGridCard key={idx} tech={tech} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
            <p className="text-slate-400 font-bold">لا يوجد فنيون يطابقون بحثك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Technicians;
