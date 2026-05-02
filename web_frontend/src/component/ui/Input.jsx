import React from 'react';

const Input = ({ label, icon, type = "text", placeholder, labelClassName = "text-slate-700", ...props }) => {
  return (
    <div className="w-full space-y-1 text-right" dir="rtl">
      {label && <label className={`block text-sm font-bold mb-1 ${labelClassName}`}>{label}</label>}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none pr-10 transition-all placeholder:text-slate-300 bg-slate-50"
          {...props}
        />
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;