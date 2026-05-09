import React from 'react';

const Input = ({ label, icon, type = "text", placeholder, labelClassName = "text-slate-700", ...props }) => {
  return (
    <div className="w-full space-y-1 text-right" dir="rtl">
      {label && <label className={`block text-sm font-bold mb-1 ${labelClassName}`}>{label}</label>}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 outline-none pr-10 transition-all placeholder:text-white/20 bg-white/5 text-white"
          {...props}
        />
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;