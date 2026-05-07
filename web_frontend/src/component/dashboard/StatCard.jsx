import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, subValue, trend, icon: Icon, iconBg, trendUp }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        {/* Text Section (Right) */}
        <div className="flex flex-col items-start text-right">
          <p className="text-slate-500 font-medium text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
          {subValue && (
            <p className="text-xs text-slate-400 mt-1 font-medium">{subValue}</p>
          )}
        </div>

        {/* Icon Section (Left) */}
        <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${iconBg}`}>
          <Icon size={24} className={iconBg.replace('bg-', 'text-').replace('-100', '-600')} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1.5 mt-2 justify-end">
          <span className={`text-xs font-bold ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend}
          </span>
          {trendUp ? (
            <TrendingUp size={14} className="text-green-500" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
