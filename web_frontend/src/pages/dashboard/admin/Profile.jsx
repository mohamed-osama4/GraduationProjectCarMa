import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  Clock, 
  Shield, 
  CheckCircle2, 
  Edit3,
  Camera,
  Activity,
  DollarSign,
  Users,
  ShoppingBag,
  Bell,
  Settings,
  FileText,
  Lock,
  Smartphone,
  Loader2,
  AlertCircle
} from 'lucide-react';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import StatCard from '../../../component/dashboard/StatCard';
import { getProfile, uploadProfileImage } from '../../../services/authService';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      setProfileData(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("فشل تحميل بيانات الملف الشخصي");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صحيح');
      return;
    }

    try {
      setUploading(true);
      await uploadProfileImage(file);
      // Refresh profile data to show the new image
      const response = await getProfile();
      setProfileData(response.data);
      // Optional: Show success message
    } catch (err) {
      console.error("Error uploading image:", err);
      alert('فشل رفع الصورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setUploading(false);
    }
  };

  // Mock Stats - these could also be fetched from an admin dashboard API
  const stats = [
    {
      title: 'إجمالي الإيرادات',
      value: '295,000 جنيه',
      trend: '+18.2%',
      trendUp: true,
      icon: DollarSign,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'إجمالي الطلبات',
      value: '1,760',
      trend: '+12.5%',
      trendUp: true,
      icon: ShoppingBag,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      title: 'عدد الفنيين',
      value: '47',
      trend: '+5%',
      trendUp: true,
      icon: Briefcase,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
    {
      title: 'عدد العملاء',
      value: '847',
      trend: '+23.1%',
      trendUp: true,
      icon: Users,
      iconBg: 'bg-[#D9B07C]/10',
      iconColor: 'text-[#D9B07C]',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'تفعيل حساب فني جديد',
      desc: 'محمد أحمد علي',
      time: 'منذ ساعتين',
      icon: User,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      id: 2,
      title: 'إرسال إشعار جماعي',
      desc: 'تحديث نظام الدفع',
      time: 'منذ 4 ساعات',
      icon: Bell,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      id: 3,
      title: 'مراجعة تقرير مالي',
      desc: 'تقرير شهر مارس',
      time: 'منذ يوم',
      icon: FileText,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      id: 4,
      title: 'تعديل إعدادات المنصة',
      desc: 'تحديث رسوم الخدمات',
      time: 'منذ يومين',
      icon: Settings,
      color: 'text-slate-400',
      bg: 'bg-white/10'
    }
  ];

  const permissions = [
    'إدارة جميع الطلبات',
    'إدارة الفنيين',
    'إدارة العملاء',
    'الوصول للتقارير المالية',
    'إرسال الإشعارات',
    'إدارة الإعدادات العامة',
    'مراجعة التقييمات',
    'إدارة الصلاحيات'
  ];

  if (loading && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#D9B07C] animate-spin" />
          <p className="text-slate-400 font-bold animate-pulse">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
        <div className="bg-[#121212] border border-red-500/20 p-8 rounded-[2.5rem] text-center max-w-md w-full">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">عذراً، حدث خطأ</h2>
          <p className="text-slate-400 font-bold mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-[#D9B07C] text-black py-4 rounded-2xl font-black hover:brightness-110 transition-all"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-tajawal min-h-screen pb-10">
      <DashboardHeader
        title="الملف الشخصي"
        subtitle="متابعة وإدارة الحساب الشخصي والصلاحيات"
      />

      {/* Main Profile Banner */}
      <div className="bg-[#121212] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden mb-8 relative">
        {/* Top Purple Banner Area */}
        <div className="h-40 md:h-48 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 relative">
          <div className="absolute inset-0 bg-black/20 mix-blend-overlay"></div>
        </div>

        {/* Profile Info Area */}
        <div className="px-8 pb-8 pt-0 relative flex flex-col md:flex-row items-end md:items-center justify-between gap-6" dir="rtl">
          <div className="flex items-center gap-6 w-full md:w-auto mt-[-4rem] relative z-10">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-[#121212] p-2 flex items-center justify-center shadow-xl relative">
                {uploading && (
                  <div className="absolute inset-0 z-20 bg-black/60 rounded-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-[#D9B07C] animate-spin" />
                  </div>
                )}
                {profileData?.profileImageUrl ? (
                  <img 
                    src={profileData.profileImageUrl} 
                    alt={profileData.name}
                    className="h-full w-full rounded-full object-cover border border-purple-500/30"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <User size={64} strokeWidth={1.5} />
                  </div>
                )}
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              <button 
                onClick={handleCameraClick}
                disabled={uploading}
                className="absolute bottom-2 left-2 bg-[#D9B07C] text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 z-30"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* User Details */}
            <div className="text-right pt-16 md:pt-12">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{profileData?.name || 'مستخدم CarMa'}</h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-slate-400 font-bold text-sm">
                  {profileData?.role === 'admin' ? 'مدير المنصة • الإدارة العليا' : profileData?.role || 'عضو المنصة'}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-600"></span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-black rounded-lg border border-emerald-500/20">
                  <CheckCircle2 size={12} /> نشط
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-black rounded-lg border border-purple-500/20">
                  <Shield size={12} /> {profileData?.role === 'admin' ? 'مدير النظام' : 'مستخدم'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full md:w-auto flex justify-end mt-4 md:mt-0 relative z-10">
            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xl">
              <Edit3 size={16} />
              تعديل الملف الشخصي
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Right Column: Info & System */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Personal Information */}
          <div className="bg-[#121212] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <User className="text-[#D9B07C]" size={24} />
              المعلومات الشخصية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1">الاسم الكامل</p>
                  <p className="text-sm font-black text-white">{profileData?.name || 'غير متوفر'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Briefcase size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1">المسمى الوظيفي</p>
                  <p className="text-sm font-black text-white">{profileData?.role === 'admin' ? 'مدير المنصة' : 'موظف'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1">البريد الإلكتروني</p>
                  <p className="text-sm font-black text-white">{profileData?.email || 'غير متوفر'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-[#D9B07C]/10 text-[#D9B07C] flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1">رقم الهاتف</p>
                  <p className="text-sm font-black text-white" dir="ltr">{profileData?.phoneNumber || 'غير متوفر'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Roles and Permissions */}
          <div className="bg-[#121212] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <Shield className="text-[#D9B07C]" size={24} />
              الصلاحيات والأذونات
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {permissions.map((perm, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-purple-500/20 bg-purple-500/5">
                  <div className="w-5 h-5 rounded-md bg-purple-500 flex items-center justify-center text-[#121212] shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-sm font-bold text-slate-200">{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Left Column: System & Activity */}
        <div className="space-y-8">
          
          {/* System Information */}
          <div className="bg-[#121212] p-8 rounded-[2.5rem] border border-white/5 shadow-xl">
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              <Activity className="text-[#D9B07C]" size={24} />
              معلومات النظام
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1">تاريخ الانضمام</p>
                  <p className="text-sm font-black text-white" dir="ltr">2024-01-01</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold mb-1">آخر تسجيل دخول</p>
                  <p className="text-sm font-black text-white" dir="ltr">2026-05-15 09:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-[#121212] p-8 rounded-[2.5rem] border border-white/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#D9B07C]/5 blur-3xl rounded-full -ml-16 -mt-16"></div>
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
              <Activity className="text-[#D9B07C]" size={24} />
              النشاطات الأخيرة
            </h3>
            
            <div className="space-y-6 relative z-10">
              {recentActivities.map((activity, idx) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activity.bg} ${activity.color}`}>
                    <activity.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-white">{activity.title}</p>
                    <p className="text-xs text-slate-400 font-bold mt-1">{activity.desc}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-black whitespace-nowrap bg-white/5 px-2 py-1 rounded-md">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-[#121212] rounded-[2.5rem] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden" dir="rtl">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-[#D9B07C]/5 blur-[80px] rounded-full"></div>
        
        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white shrink-0 border border-white/5">
            <Shield size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white mb-2">حساب آمن ومحمي</h3>
            <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-xl">
              حسابك محمي بأعلى معايير الأمان. المصادقة الثنائية مفعلة وجميع الأنشطة مسجلة ومراقبة لضمان أمان المنصة.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 relative z-10 w-full md:w-auto">
          <div className="flex flex-col items-center bg-[#0a0a0a] px-6 py-4 rounded-2xl border border-white/5 w-1/2 md:w-auto">
            <Lock size={20} className="text-emerald-400 mb-2" />
            <span className="text-xs text-white font-black mb-1">كلمة المرور</span>
            <span className="text-[10px] text-emerald-400 font-bold">قوية جداً</span>
          </div>
          <div className="flex flex-col items-center bg-[#0a0a0a] px-6 py-4 rounded-2xl border border-white/5 w-1/2 md:w-auto">
            <Smartphone size={20} className="text-[#D9B07C] mb-2" />
            <span className="text-xs text-white font-black mb-1">المصادقة الثنائية</span>
            <span className="text-[10px] text-[#D9B07C] font-bold">مفعلة</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;
