import React from 'react';

const AlertCard = ({ title, description, time, icon: Icon, type }) => {
  const styles = {
    emergency: {
      bg: 'bg-red-500/5',
      border: 'border-red-500/20',
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-400',
      titleColor: 'text-red-400',
    },
    warning: {
      bg: 'bg-orange-500/5',
      border: 'border-orange-500/20',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-400',
      titleColor: 'text-orange-400',
    },
    info: {
      bg: 'bg-[#D9B07C]/5',
      border: 'border-[#D9B07C]/10',
      iconBg: 'bg-[#D9B07C]/10',
      iconColor: 'text-[#D9B07C]',
      titleColor: 'text-white',
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`${style.bg} ${style.border} border p-5 rounded-[2rem] flex items-start gap-4 font-tajawal mb-4 hover:border-white/10 transition-all cursor-pointer shadow-lg shadow-black/20`}>
      <div className="flex-1 text-right">
        <h4 className={`${style.titleColor} font-black text-base mb-1`}>{title}</h4>
        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-2">{description}</p>
        <span className="text-slate-400 text-[10px] font-bold">{time}</span>
      </div>
      <div className={`${style.iconBg} p-3 rounded-2xl ${style.iconColor}`}>
        <Icon size={20} />
      </div>
    </div>
  );
};

export default AlertCard;
