import React from 'react';
import { MapPin, Star } from 'lucide-react';

const TechnicianCard = ({ name, initial, specialty, location, rating, orders, available }) => {
  return (
    <div className="bg-gray-50/50 p-4 rounded-3xl mb-3 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
      <div className="flex-1 text-right">
        <div className="flex items-center justify-end gap-2 mb-1">
          {available && (
            <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-lg">متاح</span>
          )}
          <h4 className="font-bold text-slate-800 text-sm">{name}</h4>
        </div>
        <p className="text-slate-400 text-[11px] mb-2 font-medium">{specialty}</p>
        <div className="flex items-center justify-end gap-3 text-[10px] font-bold">
          <div className="flex items-center gap-1 text-slate-400">
            <span>{location}</span>
            <MapPin size={12} />
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            <span>{rating}</span>
            <Star size={12} fill="currentColor" />
          </div>
          <span className="text-slate-400">{orders} طلب</span>
        </div>
      </div>
      
      <div className="h-12 w-12 rounded-2xl bg-green-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-green-100 group-hover:scale-110 transition-transform">
        {initial}
      </div>
    </div>
  );
};

export default TechnicianCard;
