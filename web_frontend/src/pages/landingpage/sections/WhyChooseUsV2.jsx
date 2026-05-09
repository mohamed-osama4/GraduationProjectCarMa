import React, { useState } from "react";
import {
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineMapPin,
  HiOutlineDevicePhoneMobile,
  HiOutlineCpuChip,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

const FEATURES = [
  {
    icon: <HiOutlineShieldCheck size={28} />,
    title: "مراكز صيانة معتمدة",
    description: "جميع فنيينا مرخصين ومعتمدين بخبرة لا تقل عن 5 سنوات لضمان أعلى مستويات الجودة والسلامة لسيارتك.",
    number: "٠١",
  },
  {
    icon: <HiOutlineClock size={28} />,
    title: "خدمة 24/7",
    description: "متاحون على مدار الساعة طوال أيام الأسبوع لخدمتك في أي وقت وأي مكان دون أي تأخير.",
    number: "٠٢",
  },
  {
    icon: <HiOutlineCurrencyDollar size={28} />,
    title: "أسعار شفافة",
    description: "لا رسوم مخفية - تعرف على التكلفة الكاملة قبل البدء في أي عمل صيانة. شفافية كاملة في كل خطوة.",
    number: "٠٣",
  },
  {
    icon: <HiOutlineCpuChip size={28} />,
    title: "تشخيص متطور",
    description: "نستخدم أحدث تقنيات التشخيص الإلكتروني لتحديد أعطال سيارتك بدقة فائقة وفي وقت قياسي.",
    number: "٠٤",
  },
  {
    icon: <HiOutlineMapPin size={28} />,
    title: "خدمة متنقلة",
    description: "نصل إليك في أي مكان - البيت، المكتب، أو أي موقع تختاره لراحتك الكاملة وبدون أي عناء.",
    number: "٠٥",
  },
  {
    icon: <HiOutlineDevicePhoneMobile size={28} />,
    title: "تطبيق ذكي",
    description: "احجز وتابع حالة خدمتك وادفع بسهولة من خلال تطبيقنا المتطور المتاح على iOS وAndroid.",
    number: "٠٦",
  },
];

export default function WhyChooseUsV2() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="why-us" className="bg-[#050505] py-32 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-start mb-24 text-right" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[#D9B07C] text-[15px] font-bold tracking-[0.3em]">لماذا نحن</span>
            <div className="w-12 h-[1px] bg-[#D9B07C]"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
            نحن نهتم بسيارتك <br />
            كما تهتم <span className="text-[#D9B07C]">بها تماماً</span>
          </h2>
        </div>

        {/* Accordion Cards */}
        <div className="flex flex-col lg:flex-row gap-1 h-auto lg:h-[420px]" data-aos="fade-up" data-aos-delay="200">
          {FEATURES.map((feature, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`
                  relative overflow-hidden cursor-pointer border border-white/5
                  transition-all duration-700 ease-in-out
                  ${isActive
                    ? "lg:flex-[4] bg-[#D9B07C] border-[#D9B07C]"
                    : "lg:flex-[1] bg-[#121212] hover:bg-[#1a1a1a] hover:border-white/10"
                  }
                  flex flex-col justify-between p-8 min-h-[100px] lg:min-h-0
                `}
              >
                {/* Number watermark */}
                <span
                  className={`absolute bottom-4 left-4 text-[80px] font-black leading-none select-none transition-all duration-700
                    ${isActive ? "text-black/[0.06]" : "text-white/[0.04]"}
                  `}
                >
                  {feature.number}
                </span>

                {/* Top: Icon + title — horizontal when collapsed, vertical when expanded */}
                <div className="relative z-10">
                  <div className={`transition-all duration-500 ${isActive ? "flex flex-col" : "flex flex-row items-center gap-4"}`}>
                    {/* Icon */}
                    <div
                      className={`rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                        ${isActive
                          ? "w-12 h-12 mb-6 bg-black/10 text-black border border-black/20"
                          : "w-10 h-10 bg-[#050505] border border-[#D9B07C]/20 text-[#D9B07C]"
                        }
                      `}
                    >
                      {feature.icon}
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-black tracking-tight transition-all duration-500 text-right
                        ${isActive ? "text-black text-2xl" : "text-white text-sm whitespace-nowrap"}
                      `}
                    >
                      {feature.title}
                    </h3>
                  </div>
                </div>

                {/* Description — only visible when active */}
                <div
                  className={`relative z-10 text-right transition-all duration-500
                    ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
                  `}
                >
                  <p className="text-black/70 text-sm leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-black/60 hover:text-black transition-colors"
                  >
                    <HiOutlineArrowLeft size={14} />
                    <span>اعرف أكثر</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* External Navigation Controls */}
        <div className="flex items-center justify-between mt-8" data-aos="fade-up" data-aos-delay="300">
          
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {FEATURES.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-500 rounded-full
                  ${activeIndex === index
                    ? "w-8 h-2 bg-[#D9B07C]"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }
                `}
              />
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + FEATURES.length) % FEATURES.length)}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-[#D9B07C] hover:text-[#D9B07C] transition-all duration-300 group"
            >
              <HiOutlineArrowLeft size={18} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % FEATURES.length)}
              className="w-12 h-12 rounded-full bg-[#D9B07C] flex items-center justify-center text-black hover:brightness-110 transition-all duration-300 group"
            >
              <HiOutlineArrowLeft size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
