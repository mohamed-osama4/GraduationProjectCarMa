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
    <div className="bg-[#121212] p-4 lg:p-5 rounded-[2rem] shadow-2xl border border-white/5 flex flex-col items-center justify-center text-center hover:border-[#D9B07C]/20 hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-16 h-16 bg-[#D9B07C]/5 blur-2xl rounded-full -mr-8 -mt-8 group-hover:bg-[#D9B07C]/10 transition-all"></div>
      <div className={`p-2.5 rounded-2xl mb-3 relative z-10 transition-transform duration-500 group-hover:rotate-12 ${bgClass} ${colorClass}`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <p className="text-slate-500 font-bold text-[11px] uppercase tracking-widest mb-1 relative z-10">{title}</p>
      <h3 className="text-[28px] font-black text-white tracking-tight leading-none mt-1 relative z-10">{value}</h3>
    </div>
  );
};

const TechnicianGridCard = ({ tech }) => {
  const isAvailable = tech.status === 'available' || tech.status === 'متاح';
  const statusLabel = isAvailable ? 'متاح' : (tech.status === 'busy' ? 'مشغول' : 'غير متصل');

  return (
    <div className="bg-[#121212] rounded-[2.5rem] p-6 shadow-2xl border border-white/5 hover:border-white/10 transition-all duration-300 group">
      {/* Header Profile Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4">
          <div className="bg-[#D9B07C] text-black rounded-2xl w-14 h-14 flex items-center justify-center font-black text-2xl shadow-lg shadow-[#D9B07C]/20 shrink-0 transition-transform duration-300 group-hover:scale-105">
            {tech.name?.[0] || 'ف'}
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className={`text-[10px] px-3 py-1 rounded-full font-black border border-white/5 ${isAvailable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-400'
              }`}>
              {statusLabel}
            </span>
            <h3 className="font-black text-white text-lg leading-tight mt-1">{tech.name}</h3>
            <p className="text-[10px] text-[#D9B07C] font-black uppercase tracking-widest">{tech.specialty || 'فني متخصص'}</p>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white rounded-xl transition-colors">
            <Eye size={16} strokeWidth={2.5} />
          </button>
          <button className="p-1.5 text-amber-400 bg-amber-500/10 hover:bg-amber-500 hover:text-white rounded-xl transition-colors">
            <Pencil size={16} strokeWidth={2.5} />
          </button>
          <button className="p-1.5 text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition-colors">
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Stats Box */}
      <div className="bg-white/5 rounded-2xl p-4 mb-6 grid grid-cols-3 divide-x divide-x-reverse divide-white/5 border border-white/5">
        <div className="flex flex-col items-center justify-center px-2">
          <span className="text-2xl font-black text-white">{tech.completedJobs || tech.completed || 0}</span>
          <span className="text-[10px] text-[#D9B07C] font-black uppercase tracking-widest mt-1">مكتمل</span>
        </div>
        <div className="flex flex-col items-center justify-center px-2">
          <span className="text-2xl font-black text-white">{tech.activeJobs || tech.active || 0}</span>
          <span className="text-[10px] text-[#D9B07C] font-black uppercase tracking-widest mt-1">نشط</span>
        </div>
        <div className="flex flex-col items-center justify-center px-2">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black text-white">{tech.rating || 0}</span>
            <Star size={16} className="text-[#D9B07C] fill-[#D9B07C]" />
          </div>
          <span className="text-[10px] text-[#D9B07C] font-black uppercase tracking-widest mt-1">التقييم</span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 mb-6 px-1">
        <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
          <Phone size={16} className="text-[#D9B07C]" />
          <span className="text-sm font-bold" dir="ltr">{tech.phone || '01234567890'}</span>
        </div>
        <div className="flex items-start gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
          <MapPin size={16} className="shrink-0 mt-0.5 text-[#D9B07C]" />
          <span className="text-sm font-bold leading-tight">{tech.location || 'القاهرة، مصر'}</span>
        </div>
      </div>

      {/* Progress Bar border-t added for separation similar to line in image */}
      <div className="pt-5 border-t border-white/5">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">معدل الإنجاز</span>
          <span className="text-sm font-black text-[#D9B07C]">{tech.progress || 95}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-[#D9B07C] h-2 rounded-full shadow-[0_0_10px_rgba(217,176,124,0.5)]"
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
    { title: 'إجمالي الورش', value: technicians.length, icon: Users, colorClass: 'text-cyan-400', bgClass: 'bg-cyan-500/10' },
    { title: 'متاحون', value: availableCount, icon: CheckCircle, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10' },
    { title: 'مشغولون', value: busyCount, icon: Activity, colorClass: 'text-blue-400', bgClass: 'bg-blue-500/10' },
    { title: 'غير متصلين', value: offlineCount, icon: XCircle, colorClass: 'text-slate-400', bgClass: 'bg-white/5' },
    { title: 'متوسط التقييم', value: avgRating, icon: Star, colorClass: 'text-[#D9B07C]', bgClass: 'bg-[#D9B07C]/10' },
    { title: 'إجمالي الطلبات', value: data?.stats?.totalOrders || '0', icon: Briefcase, colorClass: 'text-indigo-400', bgClass: 'bg-indigo-500/10' },
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
      <DashboardHeader title="الورش" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <TechnicianStatCard key={index} {...stat} />
        ))}
      </div>

      {/* Toolbar Layer */}
      <div className="bg-[#121212] p-5 rounded-[2.5rem] shadow-2xl border border-white/5 mb-6 transition-all duration-300 hover:border-white/10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button className="flex items-center justify-center gap-2 bg-[#D9B07C] hover:bg-[#D9B07C]/90 text-black px-8 py-3.5 rounded-2xl font-black transition-all whitespace-nowrap shadow-xl shadow-[#D9B07C]/10 active:scale-95 order-2 md:order-1">
            <Plus size={20} strokeWidth={2.5} />
            إضافة ورشة جديدة
          </button>

          <div className="relative flex-1 order-1 md:order-2 group">
            <input
              type="text"
              placeholder="ابحث باسم الورشة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#121212] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#D9B07C]/10 focus:border-[#D9B07C]/30 transition-all text-white placeholder-slate-500 focus:bg-[#1a1a1a]"
            />
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#D9B07C] transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar pt-4 border-t border-white/5">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-black text-xs transition-all whitespace-nowrap shadow-sm ${activeFilter === filter.id
                  ? 'bg-[#D9B07C] text-black shadow-lg shadow-[#D9B07C]/20 scale-105'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                }`}
            >
              <span className={activeFilter === filter.id ? 'text-black' : 'text-[#D9B07C]'}>
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
          <div className="col-span-full py-20 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
            <p className="text-slate-500 font-bold">لا توجد ورش تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Technicians;
