import React from 'react';
import { Eye } from 'lucide-react';

const CurrentOrderRow = ({ id, customer, service, location, status, technician, time, price, icon: Icon }) => {
  const statusStyles = {
    processing: 'bg-cyan-50 text-cyan-600',
    completed: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-gray-50/50 p-4 rounded-2xl mb-3 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-gray-100">
      {/* Service Icon (Far Right in RTL) */}
      <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform flex-shrink-0">
        <Icon size={20} />
      </div>

      {/* Service Info (Right-Middle in RTL) */}
      <div className="flex-1 text-right">
        <div className="flex items-center justify-end gap-2 mb-0.5">
          <h4 className="font-black text-slate-800 text-sm">{customer}</h4>
          <span className="text-slate-400 text-[10px] font-bold">#{id}</span>
        </div>
        <p className="text-slate-500 text-[11px] font-medium leading-tight">
          {service} • {location}
        </p>
      </div>

      {/* Status Badge (Center in RTL) */}
      <div className="flex justify-center min-w-[100px]">
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-tight ${statusStyles[status] || statusStyles.processing}`}>
          {status === 'processing' ? 'جاري التنفيذ' : 'مكتمل'}
        </span>
      </div>

      {/* Technician Info (Left-Middle in RTL) */}
      <div className="hidden lg:flex flex-col items-center min-w-[120px] text-center border-l border-r border-gray-100 px-2 space-y-0.5">
        <span className="text-[11px] font-bold text-slate-600 truncate max-w-[110px]">{technician}</span>
        <span className="text-[10px] text-slate-400 font-medium" dir="ltr">{time}</span>
      </div>

      {/* Price & View Actions (Far Left in RTL) */}
      <div className="flex items-center justify-end gap-3 min-w-[160px] pr-2">
        <div className="text-right">
          <span className="text-lg font-black text-slate-800 whitespace-nowrap">{price} جنيه</span>
        </div>
        <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors bg-white rounded-lg border border-gray-50 hover:border-blue-100 shadow-sm">
          <Eye size={18} />
        </button>
      </div>
    </div>
  );
};

export default CurrentOrderRow;
