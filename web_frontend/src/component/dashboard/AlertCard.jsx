import React from 'react';

const AlertCard = ({ title, description, time, icon: Icon, type }) => {
  const styles = {
    emergency: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      titleColor: 'text-red-800',
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-500',
      titleColor: 'text-orange-800',
    },
    info: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
      titleColor: 'text-green-800',
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`${style.bg} ${style.border} border p-5 rounded-[2rem] flex items-start gap-4 font-tajawal mb-4 hover:shadow-sm transition-all cursor-pointer`}>
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
