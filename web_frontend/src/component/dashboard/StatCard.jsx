import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, subValue, trend, icon: Icon, iconBg, iconColor, trendUp }) => {
  return (
    <div className="bg-[#121212] p-6 rounded-[2rem] border border-white/5 shadow-xl shadow-black/20 flex flex-col justify-between hover:border-[#D9B07C]/30 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#D9B07C]/5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-[#D9B07C]/10 transition-all"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        {/* Text Section (Right) */}
        <div className="flex flex-col items-start text-right">
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
          {subValue && (
            <p className="text-xs text-slate-400 mt-1 font-bold">{subValue}</p>
          )}
        </div>

        {/* Icon Section (Left) */}
        <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${iconBg || 'bg-[#D9B07C]/10'} ${iconColor || 'text-[#D9B07C]'}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1.5 mt-2 justify-end relative z-10">
          <span className={`text-xs font-black ${trendUp ? 'text-[#D9B07C]' : 'text-red-400'}`}>
            {trend}
          </span>
          {trendUp ? (
            <TrendingUp size={14} className="text-[#D9B07C]" />
          ) : (
            <TrendingDown size={14} className="text-red-400" />
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
