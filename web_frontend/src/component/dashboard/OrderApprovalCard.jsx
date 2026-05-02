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
  icon: Icon 
}) => {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 mb-4 font-tajawal hover:shadow-md transition-shadow">
      {/* Top Header Row */}
      <div className="flex justify-between items-center mb-4">
        {/* ID Details (Left in RTL) */}
        <div className="flex items-center gap-3 order-2">
          <span className="text-slate-400 text-xs font-medium">{prevOrders} طلب سابق</span>
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-lg text-xs font-bold">
            <span>{rating}</span>
            <Star size={12} fill="currentColor" />
          </div>
          <span className="text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-lg text-sm">#{id}</span>
        </div>
        
        {/* Icon (Right in RTL) */}
        <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200 order-1">
          <Icon size={24} />
        </div>
      </div>

      {/* Service Info */}
      <div className="text-right mb-4">
        <h3 className="text-xl font-black text-slate-800 mb-1">{service}</h3>
        <p className="text-slate-500 text-sm font-medium">{customer}</p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-t border-b border-gray-50 py-4">
        <div className="flex items-center gap-2 justify-end text-slate-500 order-1">
          <span className="text-sm font-medium">{phone}</span>
          <Phone size={16} className="text-slate-400" />
        </div>
        <div className="flex items-center gap-2 justify-end text-slate-500 order-2">
          <span className="text-sm font-medium" dir="ltr">{time}</span>
          <Clock size={16} className="text-slate-400" />
        </div>
        <div className="flex items-center gap-2 justify-end text-slate-500 order-3">
          <span className="text-sm font-medium text-right">{location}</span>
          <MapPin size={16} className="text-slate-400 shrink-0" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3 w-2/3">
          <button className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors">
            <X size={18} />
            رفض
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95">
            <Check size={18} />
            قبول وتعيين فني
          </button>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-blue-800">{price} جنيه</span>
        </div>
      </div>
    </div>
  );
};

export default OrderApprovalCard;
