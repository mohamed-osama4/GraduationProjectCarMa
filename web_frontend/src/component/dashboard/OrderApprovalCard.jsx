import React from 'react';
import { Phone, Clock, MapPin, Star, X, Check, Droplets, Battery } from 'lucide-react';

const OrderApprovalCard = ({
  id,
  service,
  customer,
  phone,
  time,
  location,
  price,
  rating,
  prevOrders,
  icon: Icon,
  iconBgClass,
  iconColorClass,
  onApprove,
  onReject
}) => {
  return (
    <div className="bg-[#121212] p-6 rounded-[2.5rem] border border-white/5 shadow-xl shadow-black/20 mb-4 font-tajawal hover:border-[#D9B07C]/30 transition-all duration-300 group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3 order-2">
          <span className="text-slate-500 text-xs font-bold">{prevOrders} طلب سابق</span>
          <div className="flex items-center gap-1 text-[#D9B07C] bg-[#D9B07C]/10 px-2 py-0.5 rounded-lg text-xs font-black">
            <span>{rating}</span>
            <Star size={12} fill="currentColor" />
          </div>
          <span className="text-[#D9B07C] font-black bg-[#D9B07C]/10 border border-[#D9B07C]/20 px-3 py-1 rounded-lg text-sm">#{id}</span>
        </div>

        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:rotate-12 ${iconBgClass || 'bg-[#D9B07C]'} ${iconColorClass || 'text-black'}`}>
          <Icon size={24} />
        </div>
      </div>

      <div className="text-right mb-4">
        <h3 className="text-xl font-black text-white mb-1">{service}</h3>
        <p className="text-[#D9B07C] text-sm font-bold opacity-80">{customer}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-t border-b border-white/5 py-4">
        <div className="flex items-center gap-2 justify-end text-slate-400 order-1">
          <span className="text-sm font-bold" dir="ltr">{phone}</span>
          <Phone size={16} className="text-slate-500" />
        </div>
        <div className="flex items-center gap-2 justify-end text-slate-400 order-2">
          <span className="text-sm font-bold" dir="ltr">{time}</span>
          <Clock size={16} className="text-slate-500" />
        </div>
        <div className="flex items-center gap-2 justify-end text-slate-400 order-3">
          <span className="text-sm font-bold text-right leading-relaxed">{location}</span>
          <MapPin size={16} className="text-slate-500 shrink-0" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3 w-2/3">
          <button
            onClick={() => onReject && onReject(id)}
            className="flex items-center justify-center gap-2 bg-white/5 text-slate-400 px-6 py-3 rounded-2xl font-black text-sm hover:bg-red-500/10 hover:text-red-400 transition-all active:scale-95"
          >
            <X size={18} />
            رفض
          </button>
          <button
            onClick={() => onApprove && onApprove(id)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#D9B07C] text-black px-6 py-3 rounded-2xl font-black text-sm hover:bg-[#D9B07C]/90 shadow-xl shadow-[#D9B07C]/10 transition-all active:scale-95"
          >
            <Check size={18} />
            قبول
          </button>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-white">{price} <span className="text-xs text-[#D9B07C]">ج.م</span></span>
        </div>
      </div>
    </div>
  );
};


export default OrderApprovalCard;
