import React from "react";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { FaDroplet, FaWater, FaTruckPickup, FaBatteryFull } from "react-icons/fa6";
import { GiCarWheel } from "react-icons/gi";
import { HiOutlinePhone } from "react-icons/hi2";

const SERVICES = [
  {
    number: "٠١",
    title: "تغيير البطارية",
    description: "تبديل بطارية سيارتك بأفضل الأنواع المتوفرة والمضمونة لضمان استمرارية أداء سيارتك.",
    icon: <FaBatteryFull size={24} />,
  },
  {
    number: "٠٢",
    title: "تغيير الزيت",
    description: "تغيير زيت المحرك والفلتر بزيوت أصلية تناسب محركك للحفاظ على عمره الافتراضي.",
    icon: <FaDroplet size={24} />,
  },
  {
    number: "٠٣",
    title: "خدمة الإطارات",
    description: "فحص وتبديل وإصلاح وترصيص جميع أنواع الإطارات بأحدث الأجهزة والتقنيات.",
    icon: <GiCarWheel size={24} />,
  },
  {
    number: "٠٤",
    title: "غسيل السيارة",
    description: "غسيل شامل وتنظيف داخلي وخارجي احترافي بأفضل المواد التي تحافظ على طلاء سيارتك.",
    icon: <FaWater size={24} />,
  },
  {
    number: "٠٥",
    title: "خدمة الطوارئ",
    description: "استجابة سريعة لجميع حالات الطوارئ والأعطال المفاجئة على مدار الساعة في أي مكان.",
    icon: <HiOutlinePhone size={24} />,
  },
  {
    number: "٠٦",
    title: "خدمة الونش",
    description: "نقل سيارتك بأمان واحترافية إلى أي مكان في الجمهورية باستخدام أحدث سيارات النقل.",
    icon: <FaTruckPickup size={24} />,
  },
];

export default function ServicesV2() {
  return (
    <section id="services" className="bg-[#050505] py-32 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Section Header - Unified Alignment */}
        <div className="flex flex-col items-start mb-24 text-right" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[#D9B07C] text-[15px] font-bold uppercase tracking-[0.3em]">ما نقدمه</span>
            <div className="w-12 h-[1px] bg-[#D9B07C]"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
            كل خدمة تحتاجها <br />
            تجاه سيارتك <span className="text-[#D9B07C]">بعناية</span>
          </h2>
        </div>

        {/* Services Grid - 3 Columns, 2 Rows with Minimal Gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {SERVICES.map((service, index) => (
            <div 
              key={index}
              className="relative group p-10 py-8 bg-[#121212] border border-white/5 transition-all duration-500 overflow-hidden hover:bg-[#1a1a1a] hover:border-[#D9B07C]/30"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Stylized Background Number */}
              <span className="absolute top-8 left-8 text-[60px] font-black text-[#D9B07C]/[0.08] leading-none select-none group-hover:text-[#D9B07C]/[0.15] transition-colors duration-700 font-alyamama">
                {service.number}
              </span>

              {/* Icon in Circle - Top Right Side */}
              <div className="relative z-10 flex justify-start mb-10">
                <div className="w-12 h-12 rounded-full border border-[#D9B07C]/30 flex items-center justify-center text-[#D9B07C] group-hover:border-[#D9B07C] group-hover:scale-110 transition-all duration-500">
                  {service.icon}
                </div>
              </div>

              {/* Content - Right Aligned */}
              <div className="relative z-10 text-right">
                <h3 className="text-2xl font-black text-white mb-5 tracking-tight group-hover:text-[#D9B07C] transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-[16px] font-medium leading-relaxed mb-8 max-w-[400px] mr-0 ml-auto group-hover:text-white transition-colors duration-300">
                  {service.description}
                </p>
                
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] text-[#D9B07C]/60 group-hover:text-[#D9B07C] transition-all duration-300"
                >
                  <HiOutlineArrowLeft className="group-hover:-translate-x-2 transition-transform duration-300" size={18} />
                  <span>اعرف أكثر</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
