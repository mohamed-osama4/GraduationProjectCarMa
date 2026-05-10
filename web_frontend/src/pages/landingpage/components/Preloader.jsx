import React from "react";

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D9B07C]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative flex flex-col items-center">
        {/* Animated Logo */}
        <div className="mb-12 relative">
          <h1 className="text-6xl font-black text-white italic tracking-tighter animate-preloader-pulse">
            Car<span className="text-[#D9B07C]">Ma</span>
          </h1>
          {/* Reflection Effect */}
          <h1 className="text-6xl font-black text-white italic tracking-tighter absolute top-0 left-0 opacity-10 blur-sm scale-y-[-0.5] translate-y-12">
            Car<span className="text-[#D9B07C]">Ma</span>
          </h1>
        </div>

        {/* Loading Bar Container */}
        <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden relative group">
          {/* The Progress Bar */}
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-[#D9B07C] to-transparent animate-preloader-bar shadow-[0_0_15px_rgba(217,176,124,0.5)]"></div>
        </div>

        {/* Loading Text */}
        <p className="mt-6 text-[10px] text-gray-500 uppercase tracking-[0.5em] font-black animate-pulse">
          تحميل التجربة المميزة
        </p>
      </div>

      {/* Decorative Corner Accents */}
      <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-[#D9B07C]/20 rounded-tr-3xl"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-[#D9B07C]/20 rounded-bl-3xl"></div>
    </div>
  );
}
