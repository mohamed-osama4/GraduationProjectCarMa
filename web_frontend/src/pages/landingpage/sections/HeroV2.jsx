import React from "react";
import { HiOutlineArrowLeft, HiOutlineArrowDownTray } from "react-icons/hi2";

export default function HeroV2({ isLoaded }) {
  return (
    <section className={`relative min-h-screen flex flex-col bg-[#050505] selection:bg-[#D9B07C] selection:text-black transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      
      {/* Integrated Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-[100] px-6 py-5 bg-[#050505]/40 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - Right in RTL */}
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white italic tracking-tighter">
              Car<span className="text-[#D9B07C]">Ma</span>
            </h1>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold text-white">
            <a href="#hero" className="hover:text-[#D9B07C] transition-colors">الرئيسية</a>
            <a href="#services" className="hover:text-[#D9B07C] transition-colors">خدماتنا</a>
            <a href="#how-it-works" className="hover:text-[#D9B07C] transition-colors">كيف يعمل</a>
            <a href="#why-us" className="hover:text-[#D9B07C] transition-colors">لماذا نحن</a>
            <a href="#pricing" className="hover:text-[#D9B07C] transition-colors">الأسعار</a>
            <a href="#testimonials" className="hover:text-[#D9B07C] transition-colors">آراء العملاء</a>
          </div>

          {/* CTA Button - Left */}
          <button className="bg-[#D9B07C] text-black px-6 py-2.5 rounded-sm font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2">
            <HiOutlineArrowDownTray className="text-sm" />
            تحميل التطبيق
          </button>
        </div>
      </nav>

      {/* Hero Content Wrapper */}
      <div className="flex-grow flex items-center pt-24 lg:pt-20">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* Right Side - Text Content Area */}
          <div className="w-full lg:w-1/2 text-right" data-aos="fade-up">
            {/* Top Label */}
            <div className="flex items-center justify-start gap-4 mb-6 md:mb-10">
              <span className="text-[11px] md:text-[15px] uppercase tracking-[0.2em] md:tracking-[0.25em] font-bold text-[#D9B07C]/80">أفضل خدمة سيارات في المنطقة</span>
              <div className="w-10 md:w-16 h-[1px] bg-[#D9B07C]/30"></div>
            </div>

            {/* Main Headlines - Responsive Scaling */}
            <h2 className="text-5xl sm:text-7xl lg:text-[90px] font-black text-white leading-[0.9] tracking-tighter">
              سيارتك
            </h2>
            <h2 className="text-5xl sm:text-7xl lg:text-[90px] font-black text-[#D9B07C] leading-[0.9] mb-8 md:mb-16 tracking-tighter">
              تستحق
            </h2>

            <h2 className="text-[60px] sm:text-[100px] lg:text-[140px] font-black text-white leading-none mb-8 md:mb-10 tracking-tighter uppercase">
              الأفضل
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 md:mb-16 max-w-lg mr-0 ml-auto">
              رعاية متخصصة، معاملة فاخرة، وصفر تنازلات. CarMa تقدم خدمة الوكالة مباشرة إلى باب منزلك - لأن سيارتك أكثر من مجرد آلة.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-6">
              <button className="w-full sm:w-auto bg-[#D9B07C] text-black px-10 py-5 rounded-sm font-black text-sm hover:translate-y-[-4px] transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(217,176,124,0.3)] flex items-center justify-center gap-4 group">
                احجز موعدك الآن
                <HiOutlineArrowLeft className="group-hover:translate-x-[-8px] transition-transform" size={20} />
              </button>
              <a href="#services" className="text-white font-bold text-sm tracking-widest hover:text-[#D9B07C] transition-colors border-b border-white/10 pb-1 uppercase">
                اكتشف خدماتنا
              </a>
            </div>
          </div>

          {/* Left Side - Car Scene - Positioned differently on mobile */}
          <div className="relative w-full lg:absolute lg:bottom-14 lg:left-8 lg:w-[35%] z-10 py-10 lg:py-0" data-aos="fade-up" data-aos-delay="200">
            <div className="relative group max-w-md mx-auto lg:max-w-none">
              {/* Glow Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-[#D9B07C]/5 blur-[40px] lg:blur-[60px] rounded-full group-hover:bg-[#D9B07C]/10 transition-all duration-700"></div>

              <div className="relative z-10 animate-float">
                <svg viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <ellipse cx="400" cy="370" rx="300" ry="18" fill="rgba(0,0,0,0.6)" />
                  <rect x="100" y="270" width="600" height="80" rx="8" fill="#1a1a1a" />
                  <path d="M200 270 L240 180 L350 150 L450 150 L560 180 L600 270 Z" fill="#222" />
                  <path d="M260 270 L290 190 L350 165 L450 165 L510 190 L540 270 Z" fill="#2a2a2a" />
                  <path d="M295 188 L310 175 L370 162 L430 162 L490 175 L505 188 Z" fill="#0a1628" opacity="0.9" />
                  <path d="M295 188 L310 175 L370 162 L430 162 L490 175 L505 188 Z" fill="rgba(200,169,110,0.05)" />
                  <path d="M260 268 L290 195 L295 188 L250 270 Z" fill="#0a1628" opacity="0.85" />
                  <path d="M540 268 L510 195 L505 188 L550 270 Z" fill="#0a1628" opacity="0.85" />
                  <line x1="350" y1="160" x2="340" y2="270" stroke="#333" stroke-width="2" />
                  <line x1="450" y1="160" x2="460" y2="270" stroke="#333" stroke-width="2" />
                  <rect x="310" y="230" width="24" height="6" rx="3" fill="#c8a96e" opacity="0.6" />
                  <rect x="466" y="230" width="24" height="6" rx="3" fill="#c8a96e" opacity="0.6" />
                  <rect x="100" y="280" width="60" height="24" rx="4" fill="#c8a96e" opacity="0.15" />
                  <rect x="108" y="284" width="44" height="16" rx="3" fill="#e2c98e" opacity="0.5" />
                  
                  {/* Tail light right */}
                  <rect x="680" y="290" width="20" height="14" rx="2" fill="#aa0000" />
                  <rect x="682" y="292" width="16" height="10" rx="1" fill="#ff0000" />

                  <path d="M105 270 L695 270" stroke="#c8a96e" stroke-width="1.5" opacity="0.4" />
                  <line x1="400" y1="150" x2="400" y2="130" stroke="#444" stroke-width="2" />
                  <path d="M195 220 L210 215 L210 240 L195 238 Z" fill="#1a1a1a" stroke="#333" stroke-width="1" />
                  <path d="M590 220 L605 215 L605 240 L590 238 Z" fill="#1a1a1a" stroke="#333" stroke-width="1" />

                  {/* Left Wheel */}
                  <circle cx="200" cy="340" r="45" fill="#111" />
                  <circle cx="200" cy="340" r="35" fill="#222" />
                  <circle cx="200" cy="340" r="28" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
                  <path d="M200 312 L200 368 M172 340 L228 340 M180 320 L220 360 M180 360 L220 320" stroke="#444" strokeWidth="4" />
                  <circle cx="200" cy="340" r="10" fill="#c8a96e" opacity="0.8" />

                  {/* Right Wheel */}
                  <circle cx="600" cy="340" r="45" fill="#111" />
                  <circle cx="600" cy="340" r="35" fill="#222" />
                  <circle cx="600" cy="340" r="28" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
                  <path d="M600 312 L600 368 M572 340 L628 340 M580 320 L620 360 M580 360 L620 320" stroke="#444" strokeWidth="4" />
                  <circle cx="600" cy="340" r="10" fill="#c8a96e" opacity="0.8" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Services Marquee */}
      <div className="absolute bottom-0 left-0 w-full bg-[#D9B07C] py-3 z-20 overflow-hidden">
        <marquee behavior="scroll" direction="left" scrollamount="8" className="flex items-center">
          <div className="flex items-center gap-12 text-black font-black text-sm whitespace-nowrap">
            {/* Set 1 */}
            <span>تغيير البطارية</span> <span className="text-[8px]">◆</span>
            <span>تغيير الزيت</span> <span className="text-[8px]">◆</span>
            <span>خدمة الإطارات</span> <span className="text-[8px]">◆</span>
            <span>غسيل السيارة</span> <span className="text-[8px]">◆</span>
            <span>خدمة الطوارئ</span> <span className="text-[8px]">◆</span>
            <span>خدمة الونش</span> 
            <span className="mx-16"></span>

            {/* Set 2 */}
            <span>تغيير البطارية</span> <span className="text-[8px]">◆</span>
            <span>تغيير الزيت</span> <span className="text-[8px]">◆</span>
            <span>خدمة الإطارات</span> <span className="text-[8px]">◆</span>
            <span>غسيل السيارة</span> <span className="text-[8px]">◆</span>
            <span>خدمة الطوارئ</span> <span className="text-[8px]">◆</span>
            <span>خدمة الونش</span>
            <span className="mx-16"></span>

            {/* Set 3 */}
            <span>تغيير البطارية</span> <span className="text-[8px]">◆</span>
            <span>تغيير الزيت</span> <span className="text-[8px]">◆</span>
            <span>خدمة الإطارات</span> <span className="text-[8px]">◆</span>
            <span>غسيل السيارة</span> <span className="text-[8px]">◆</span>
            <span>خدمة الطوارئ</span> <span className="text-[8px]">◆</span>
            <span>خدمة الونش</span>
            <span className="mx-16"></span>

            {/* Set 4 */}
            <span>تغيير البطارية</span> <span className="text-[8px]">◆</span>
            <span>تغيير الزيت</span> <span className="text-[8px]">◆</span>
            <span>خدمة الإطارات</span> <span className="text-[8px]">◆</span>
            <span>غسيل السيارة</span> <span className="text-[8px]">◆</span>
            <span>خدمة الطوارئ</span> <span className="text-[8px]">◆</span>
            <span>خدمة الونش</span>
            <span className="mx-16"></span>
          </div>
        </marquee>
      </div>

      {/* Subtle Bottom Ambient Glow */}
      <div className="absolute bottom-10 left-0 w-full h-[30vh] bg-gradient-to-t from-[#D9B07C]/5 to-transparent pointer-events-none"></div>
    </section>
  );
}
