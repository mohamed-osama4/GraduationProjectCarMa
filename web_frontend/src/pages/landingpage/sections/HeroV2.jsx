import React from "react";
import { HiOutlineArrowLeft, HiOutlineArrowDownTray } from "react-icons/hi2";

export default function HeroV2({ isLoaded }) {
  return (
    <section className={`relative min-h-screen flex flex-col bg-[#050505] selection:bg-[#D9B07C] selection:text-black transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>


      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-40 mix-blend-luminosity"
        >
          <source src="/videos/bgg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/60 to-[#050505]"></div>
      </div>


      <nav className="absolute top-0 left-0 right-0 z-[100] px-6 py-5 bg-[#050505]/40 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black text-white italic tracking-tighter">
              Car<span className="text-[#D9B07C]">Ma</span>
            </h1>
          </div>


          <div className="hidden lg:flex items-center gap-8 text-[16px] font-bold text-white">
            <a href="#hero" className="hover:text-[#D9B07C] transition-colors">الرئيسية</a>
            <a href="#services" className="hover:text-[#D9B07C] transition-colors">خدماتنا</a>
            <a href="#how-it-works" className="hover:text-[#D9B07C] transition-colors">كيف يعمل</a>
            <a href="#why-us" className="hover:text-[#D9B07C] transition-colors">لماذا نحن</a>
            <a href="#pricing" className="hover:text-[#D9B07C] transition-colors">الأسعار</a>
            <a href="#testimonials" className="hover:text-[#D9B07C] transition-colors">آراء العملاء</a>
          </div>


          <button className="bg-[#D9B07C] text-black px-6 py-2.5 rounded-sm font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2">
            <HiOutlineArrowDownTray className="text-sm" />
            تحميل التطبيق
          </button>
        </div>
      </nav>


      <div className="relative z-10 flex-grow flex items-center pt-24 lg:pt-20">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center justify-center gap-12 text-center">
          {/* Main Text Content Area - Centered */}
          <div className="w-full max-w-4xl" data-aos="fade-up">
            {/* Top Label */}
            <div className="flex items-center justify-center gap-4 mb-6 md:mb-10">
              <div className="w-10 md:w-16 h-[1px] bg-[#D9B07C]/30"></div>
              <span className="text-[11px] md:text-[15px] uppercase tracking-[0.2em] md:tracking-[0.25em] font-bold text-[#D9B07C]/80">أفضل خدمة سيارات في المنطقة</span>
              <div className="w-10 md:w-16 h-[1px] bg-[#D9B07C]/30"></div>
            </div>


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
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 md:mb-16 max-w-2xl mx-auto">
              رعاية متخصصة، معاملة فاخرة، وصفر تنازلات. CarMa تقدم خدمة الوكالة مباشرة إلى باب منزلك - لأن سيارتك أكثر من مجرد آلة.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="w-full sm:w-auto bg-[#D9B07C] text-black px-10 py-5 rounded-sm font-black text-sm hover:translate-y-[-4px] transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(217,176,124,0.3)] flex items-center justify-center gap-4 group">
                احجز موعدك الآن
                <HiOutlineArrowLeft className="group-hover:translate-x-[-8px] transition-transform" size={20} />
              </button>
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
