import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import {
  Users,
  CheckCircle,
  Briefcase,
  Search,
  Plus,
  Loader2,
  AlertTriangle,
  User, Phone, Mail, MapPin, Clock, Calendar, Activity, Wrench
} from 'lucide-react';
import { getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop, toggleWorkshopStatus, toggleWorkshopActive } from '../../../services/adminService';

const AVAILABLE_SERVICES = [
  { id: 1, name: "غيار زيت" },
  { id: 2, name: "بطارية" },
  { id: 3, name: "تغير إطار" },
  { id: 4, name: "غسيل" },
  { id: 5, name: "صيانة طارئة" },
  { id: 6, name: "ونش" },
];
import WorkshopStatCard from '../../../component/dashboard/Workshop/WorkshopStatCard';
import WorkshopGridCard from '../../../component/dashboard/Workshop/WorkshopGridCard';
import Model from '../../../component/ui/Model';




const Workshops = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');


  // WorkShop Details Modal
  const [isModalOpen , setIsModalOpen ]=useState(false);
  const [selectedWorkshop , setSelectedWorkshop ]=useState(null);

  const openWorkshopModal = (workshop) => {
  
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
  }
  const closeWorkshopModal = () => {
    setIsModalOpen(false);
    setSelectedWorkshop(null);
  }

  // Add / Edit Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [editingWorkshopId, setEditingWorkshopId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    phoneNumber: '',
    email: '',
    address: '',
    openTime: '09:00:00',
    closeTime: '21:00:00',
    serviceIds: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openFormModal = (mode, workshop = null) => {
    setFormMode(mode);
    if (mode === 'edit' && workshop) {
      setEditingWorkshopId(workshop.id);
      setFormData({
        name: workshop.name || '',
        ownerName: workshop.ownerName || '',
        phoneNumber: workshop.phoneNumber || '',
        email: workshop.email || '',
        address: workshop.address || '',
        openTime: workshop.openTime || '09:00:00',
        closeTime: workshop.closeTime || '21:00:00',
        serviceIds: workshop.services?.map(s => s.id) || []
      });
    } else {
      setEditingWorkshopId(null);
      setFormData({
        name: '',
        ownerName: '',
        phoneNumber: '',
        email: '',
        address: '',
        openTime: '09:00:00',
        closeTime: '21:00:00',
        serviceIds: []
      });
    }
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (serviceId) => {
    setFormData(prev => {
      const currentIds = prev.serviceIds;
      if (currentIds.includes(serviceId)) {
        return { ...prev, serviceIds: currentIds.filter(id => id !== serviceId) };
      } else {
        return { ...prev, serviceIds: [...currentIds, serviceId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (formMode === 'add') {
        await createWorkshop(formData);
      } else {
        await updateWorkshop(editingWorkshopId, formData);
      }
      closeFormModal();
      window.location.reload(); 
    } catch (err) {
      console.error("Error saving workshop:", err);
      alert("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWorkshop = async (id) => {
    if(window.confirm('هل أنت متأكد من حذف هذه الورشة؟')) {
      try {
        await deleteWorkshop(id);
        window.location.reload();
      } catch (err) {
        console.error("Error deleting workshop:", err);
        alert("حدث خطأ أثناء الحذف");
      }
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleWorkshopStatus(id);
      window.location.reload();
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("حدث خطأ أثناء تغيير حالة الورشة");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await toggleWorkshopActive(id);
      window.location.reload();
    } catch (err) {
      console.error("Error toggling active:", err);
      alert("حدث خطأ أثناء تفعيل/تعطيل الورشة");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getWorkshops();
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

  const technicians = data?.workshops || [];

  // Calculate dynamic stats
  const availableCount = technicians.filter(t => t.status === 'available').length;
  const busyCount = technicians.filter(t => t.status === 'busy').length;
  const offlineCount = technicians.filter(t => t.status === 'offline').length;
  const avgRating = technicians.length > 0
    ? (technicians.reduce((acc, t) => acc + (t.rating || 0), 0) / technicians.length).toFixed(1)
    : '0';

  const stats = [
    { title: 'إجمالي الورش', keyValue:"total", icon: Users, colorClass: 'text-cyan-400', bgClass: 'bg-cyan-500/10' },
    { title: 'الورش النشطة', keyValue:"open", icon: CheckCircle, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10' },
    // { title: 'مشغولون', value: busyCount, icon: Activity, colorClass: 'text-blue-400', bgClass: 'bg-blue-500/10' },
    // { title: 'غير متصلين', value: offlineCount, icon: XCircle, colorClass: 'text-slate-400', bgClass: 'bg-white/5' },
    // { title: 'متوسط التقييم', value: avgRating, icon: Star, colorClass: 'text-[#D9B07C]', bgClass: 'bg-[#D9B07C]/10' },
    { title: 'إجمالي الطلبات', keyValue:"totalOrders", icon: Briefcase, colorClass: 'text-indigo-400', bgClass: 'bg-indigo-500/10' },
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
    <>
    <div className="font-tajawal">
      <DashboardHeader title="الورش" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">

        {stats.map((stat, index) => {
          
          return(
          <WorkshopStatCard key={index} {...stat } data={data} />
        )})
      }
      </div>

      {/* Toolbar Layer */}
      <div className="bg-[#121212] p-5 rounded-[2.5rem] shadow-2xl border border-white/5 mb-6 transition-all duration-300 hover:border-white/10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button onClick={() => openFormModal('add')} className="flex items-center justify-center gap-2 bg-[#D9B07C] hover:bg-[#D9B07C]/90 text-black px-8 py-3.5 rounded-2xl font-black transition-all whitespace-nowrap shadow-xl shadow-[#D9B07C]/10 active:scale-95 order-2 md:order-1">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredTechnicians.length > 0 ? (
          filteredTechnicians.map((workshop, idx) => (
             <WorkshopGridCard 
                key={idx} 
                workshop={workshop} 
                openModalHandler={openWorkshopModal} 
                openEditModalHandler={(ws) => openFormModal('edit', ws)} 
                deleteHandler={handleDeleteWorkshop}
                toggleStatusHandler={handleToggleStatus}
                toggleActiveHandler={handleToggleActive}
              />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
            <p className="text-slate-500 font-bold">لا توجد ورش تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
    <Model
      isOpen={isModalOpen} 
      onClose={closeWorkshopModal} 
      title="تفاصيل الورشة"
      showCloseButton={true}
      closeOnBackdropClick={true}
    >

   {
    selectedWorkshop && 
    <div className="space-y-8 text-right" dir="rtl">
      {/* Summary Header */}
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D9B07C]/10 text-[#D9B07C]">
          <Briefcase size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{selectedWorkshop.name}</h2>
          <div className="mt-2 flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${selectedWorkshop.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${selectedWorkshop.isActive ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              {selectedWorkshop.isActive ? 'مفعل' : 'معطلة '}
            </span>
            {selectedWorkshop.isActive && <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${selectedWorkshop.isOpen ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'}`}>
              <Clock size={12} />
              {selectedWorkshop.isOpen ? 'مفتوح الآن' : 'مغلق'}
            </span>}
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-5 shadow-xl transition-all hover:bg-white/10">
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-16 w-16 rounded-full bg-[#D9B07C]/5 blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="rounded-xl bg-[#D9B07C]/10 p-3 text-[#D9B07C]">
              <User size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">المالك</span>
              <p className="mt-1 font-bold text-white">{selectedWorkshop.ownerName}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-5 shadow-xl transition-all hover:bg-white/10">
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-16 w-16 rounded-full bg-blue-500/5 blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
              <Phone size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">رقم الهاتف</span>
              <p className="mt-1 font-bold text-white" dir="ltr">{selectedWorkshop.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-5 shadow-xl transition-all hover:bg-white/10">
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-16 w-16 rounded-full bg-purple-500/5 blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
              <Mail size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">البريد الإلكتروني</span>
              <p className="mt-1 font-bold text-white">{selectedWorkshop.email}</p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-5 shadow-xl transition-all hover:bg-white/10">
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-16 w-16 rounded-full bg-emerald-500/5 blur-2xl"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
              <MapPin size={20} />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500">العنوان</span>
              <p className="mt-1 font-bold text-white">{selectedWorkshop.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services & Schedule */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-2xl">
          <div className="mb-4 flex items-center gap-3">
            <Wrench size={18} className="text-[#D9B07C]" />
            <h3 className="font-black text-white">الخدمات المقدمة</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedWorkshop.services?.map(service => (
              <span key={service.id} className="rounded-lg border border-[#D9B07C]/20 bg-[#D9B07C]/5 px-3 py-1.5 text-xs font-bold text-[#D9B07C]">
                {service.name}
              </span>
            ))}
            {(!selectedWorkshop.services || selectedWorkshop.services.length === 0) && (
              <p className="text-sm text-slate-500">لا توجد خدمات مضافة</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-2xl">
          <div className="mb-4 flex items-center gap-3">
            <Clock size={18} className="text-[#D9B07C]" />
            <h3 className="font-black text-white">مواعيد العمل</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <span className="text-xs font-bold text-slate-400">وقت الفتح</span>
              <span className="font-black text-white" dir="ltr">{selectedWorkshop.openTime}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
              <span className="text-xs font-bold text-slate-400">وقت الإغلاق</span>
              <span className="font-black text-white" dir="ltr">{selectedWorkshop.closeTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between rounded-2xl border border-[#D9B07C]/10 bg-[#D9B07C]/5 px-6 py-4">
        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-[#D9B07C]" />
          <span className="text-sm font-bold text-slate-300">
            تاريخ الانضمام: <span className="ml-1 text-white">{new Date(selectedWorkshop.joinDate).toLocaleDateString('ar-EG')}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Activity size={18} className="text-[#D9B07C]" />
          <span className="text-sm font-bold text-slate-300">
            إجمالي الطلبات: <span className="ml-1 text-white">{selectedWorkshop.totalOrders}</span>
          </span>
        </div>
      </div>
    </div>
   }
    </Model>

    {/* Add / Edit Form Modal */}
    <Model
      isOpen={isFormOpen}
      onClose={closeFormModal}
      title={formMode === 'add' ? "إضافة ورشة جديدة" : "تعديل بيانات الورشة"}
      showCloseButton={true}
      closeOnBackdropClick={false}
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">اسم الورشة</label>
            <input 
              required
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleInputChange}
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D9B07C] focus:ring-1 focus:ring-[#D9B07C] outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">اسم المالك</label>
            <input 
              required
              type="text" 
              name="ownerName"
              value={formData.ownerName} 
              onChange={handleInputChange}
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D9B07C] focus:ring-1 focus:ring-[#D9B07C] outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">رقم الهاتف</label>
            <input 
              required
              type="text" 
              name="phoneNumber"
              value={formData.phoneNumber} 
              onChange={handleInputChange}
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D9B07C] focus:ring-1 focus:ring-[#D9B07C] outline-none transition-all text-left" dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">البريد الإلكتروني</label>
            <input 
              required
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleInputChange}
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D9B07C] focus:ring-1 focus:ring-[#D9B07C] outline-none transition-all text-left" dir="ltr"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-white">العنوان</label>
            <input 
              required
              type="text" 
              name="address"
              value={formData.address} 
              onChange={handleInputChange}
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D9B07C] focus:ring-1 focus:ring-[#D9B07C] outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">وقت الفتح</label>
            <input 
              required
              type="time" 
              step="1"
              name="openTime"
              value={formData.openTime} 
              onChange={handleInputChange}
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D9B07C] focus:ring-1 focus:ring-[#D9B07C] outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">وقت الإغلاق</label>
            <input 
              required
              type="time" 
              step="1"
              name="closeTime"
              value={formData.closeTime} 
              onChange={handleInputChange}
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D9B07C] focus:ring-1 focus:ring-[#D9B07C] outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-white block">الخدمات المتاحة</label>
          <div className="flex flex-wrap gap-3">
            {AVAILABLE_SERVICES.map(service => {
              const isSelected = formData.serviceIds.includes(service.id);
              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => handleServiceToggle(service.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                    isSelected 
                    ? 'bg-[#D9B07C] text-black border-[#D9B07C] shadow-lg shadow-[#D9B07C]/20' 
                    : 'bg-[#121212] text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {service.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#D9B07C] hover:bg-[#D9B07C]/90 text-black px-6 py-3.5 rounded-xl font-black transition-all shadow-xl shadow-[#D9B07C]/10 disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'حفظ البيانات'}
          </button>
          <button
            type="button"
            onClick={closeFormModal}
            className="px-6 py-3.5 rounded-xl font-black text-white bg-white/5 hover:bg-white/10 transition-all border border-white/5"
          >
            إلغاء
          </button>
        </div>
      </form>
    </Model>
    </>
  );
};

export default Workshops;
