import React, { useState, useRef, useEffect } from 'react';
import { Eye, Pencil, Trash2, Phone, MapPin, Mail, Clock, Star, MoreVertical, Power, DoorOpen, DoorClosed, Warehouse } from 'lucide-react';

const WorkshopGridCard = ({ workshop, openModalHandler, openEditModalHandler, deleteHandler, toggleStatusHandler, toggleActiveHandler }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAvailable = workshop?.isActive;
  const isOpen = workshop?.isOpen;
//   TODO : if is avaibable and isOpen make it green and if is avaibable and isClose make it yellow and if is not avaibable make it red
    const statusLabel = 
    isAvailable && isOpen ? 'متاح' : isAvailable && !isOpen ? 'مغلقة' : 'غير متاح';
    
    const statusColor = 
    isAvailable && isOpen ? 'bg-emerald-500/10 text-emerald-400' : isAvailable && !isOpen ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400';

  return (
    <div className="bg-[#121212] rounded-[2.5rem] p-6 shadow-2xl border border-white/5 hover:border-white/10 transition-all duration-300 group">
      {/* Header Profile Section */}
      <div className="flex justify-between items-start mb-6 relative">
        <div className="flex gap-4">
          <div className="bg-[#D9B07C] text-black rounded-2xl w-14 h-14 flex items-center justify-center font-black text-2xl shadow-lg shadow-[#D9B07C]/20 shrink-0 transition-transform duration-300 group-hover:scale-105">
            {<Warehouse size={24} strokeWidth={2.5}/> || workshop?.name[0] }
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className={`text-[10px] px-3 py-1 rounded-full font-black border border-white/5 ${statusColor
              }`}>
              {statusLabel}
            </span>
            <h3 className="font-black text-white text-lg leading-tight mt-1">{workshop?.name}</h3>
            <p className="text-[10px] text-[#D9B07C] font-black uppercase tracking-widest">المالك : {workshop?.ownerName }</p>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 absolute top-[0px] end-[0px]">
          <button onClick={() => openModalHandler(workshop)} className="p-1.5 text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white rounded-xl transition-colors" title="عرض التفاصيل">
            <Eye size={16} strokeWidth={2.5} />
          </button>
          <button onClick={() => openEditModalHandler(workshop)} className="p-1.5 text-amber-400 bg-amber-500/10 hover:bg-amber-500 hover:text-white rounded-xl transition-colors" title="تعديل">
            <Pencil size={16} strokeWidth={2.5} />
          </button>

          {/* More Options Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)} 
              className="p-1.5 text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl transition-colors"
            >
              <MoreVertical size={16} strokeWidth={2.5} />
            </button>

            {showDropdown && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col p-1">

                {isAvailable && <button 
                  onClick={() => { toggleStatusHandler(workshop.id); setShowDropdown(false); }} 
                  className="w-full text-right px-4 py-2.5 text-sm font-bold text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-colors"
                >
                  {workshop.isOpen ? <DoorClosed size={16} className="text-amber-400" /> : <DoorOpen size={16} className="text-emerald-400" />}
                  {workshop.isOpen ? 'إغلاق الورشة' : 'فتح الورشة'}
                </button>
                }
                
                <button 
                  onClick={() => { toggleActiveHandler(workshop.id); setShowDropdown(false); }} 
                  className="w-full text-right px-4 py-2.5 text-sm font-bold text-white hover:bg-white/5 rounded-xl flex items-center gap-3 transition-colors"
                >
                  <Power size={16} className={workshop.isActive ? "text-red-400" : "text-emerald-400"} />
                  {workshop.isActive ? 'تعطيل الورشة' : 'تفعيل الورشة'}
                </button>

                <div className="h-[1px] bg-white/10 my-1 mx-2"></div>
                
                <button 
                  onClick={() => { deleteHandler(workshop.id); setShowDropdown(false); }} 
                  className="w-full text-right px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-colors"
                >
                  <Trash2 size={16} />
                  حذف الورشة
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Box */}
      <div className="bg-white/5 rounded-2xl p-4 mb-6 grid grid-cols-3 divide-x  divide-white/5 border border-white/5">
       <div className="flex flex-col items-center justify-center px-2">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black text-white">{4.7}</span>
            <Star size={16} className="text-[#D9B07C] fill-[#D9B07C]" />
          </div>
          <span className="text-[10px] text-[#D9B07C] font-black uppercase tracking-widest mt-1">التقييم</span>
        </div>
        <div className="flex flex-col items-center justify-center px-2">
          <span className="text-2xl font-black text-white">{workshop?.totalOrders}</span>
          <span className="text-[10px] text-[#D9B07C] font-black uppercase tracking-widest mt-1">إجمالي الطلبات</span>
        </div>
        <div className="flex flex-col items-center justify-center px-2">
          <span className="text-2xl font-black text-white">{workshop?.joinDate.split('T')[0]}</span>
          <span className="text-[10px] text-[#D9B07C] font-black uppercase tracking-widest mt-1">تاريخ الانضمام</span>
        </div>
       
      </div>

      {/* Contact Info */}
      <div className="mb-6 px-1 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
          <Phone size={16} className="text-[#D9B07C]" />
          <span className="text-sm font-bold" dir="ltr">{workshop?.phoneNumber || '01234567890'}</span>
        </div>
         <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
          <Mail size={16} className="text-[#D9B07C]" />
          <span className="text-sm font-bold" dir="ltr">{workshop?.email || 'TEST@GMAIL.COM'}</span>
        </div>
        <div className="flex items-start gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
          <MapPin size={16} className="shrink-0 mt-0.5 text-[#D9B07C]" />
          <span className="text-sm font-bold leading-tight">{workshop?.address || 'القاهرة، مصر'}</span>
        </div>
          <div className="flex items-start gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
          <Clock size={16} className="shrink-0 mt-0.5 text-[#D9B07C]" />
         <div className="flex items-center gap-[6px]">
            <span className="text-sm font-bold leading-tight">{workshop?.openTime || ''}</span>
                        <span className="text-sm font-bold leading-tight">-</span>

             <span className="text-sm font-bold leading-tight">{workshop?.closeTime || ''}</span>
         </div>
        </div>
      </div>

      {/* Avaible Services*/} 
      <div className="">
        <div className="text-[14px] font-black text-slate-200 uppercase tracking-widest mt-1 mb-3 ">الخدمات المتاحة</div>
        <div className=' px-1 flex flex-wrap gap-[8px]'>
          {workshop?.services?.map((service ) => (
            <span key={service.id} className="text-[10px] py-1 px-2 rounded-xl bg-[#D9B07C]/10 text-[#D9B07C]">{service.name}</span>
          ))}
          
        </div>

        
      </div>
      
    </div>
  );
};

export default WorkshopGridCard;