import React, { useState } from "react";
import PricingCard from "../components/PricingCard";

const PLANS = [
  {
    name: "الباقة الأساسية",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    features: [
      "فحص شامل للسيارة",
      "تغيير زيت المحرك",
      "فحص البطارية",
      "فحص الإطارات",
      "تقرير مفصل عن حالة السيارة",
    ],
    popular: false,
    showBadge: false,
  },
  {
    name: "الباقة المتقدمة",
    monthlyPrice: 499,
    yearlyPrice: 4990,
    features: [
      "جميع خدمات الباقة الأساسية",
      "صيانة نظام التكييف",
      "فحص الفرامل وتبديلها",
      "فحص كمبيوتر السيارة",
      "غسيل وتلميع خارجي",
      "ضمان 3 أشهر",
    ],
    popular: true,
    showBadge: true,
  },
  {
    name: "الباقة الشاملة",
    monthlyPrice: 899,
    yearlyPrice: 8990,
    features: [
      "جميع خدمات الباقة المتقدمة",
      "صيانة ناقل الحركة",
      "فحص نظام التعليق",
      "تلميع وحماية سيراميك",
      "أولوية في الحجز",
      "ضمان 6 أشهر",
    ],
    popular: false,
    showBadge: false,
  },
];

export default function PricingV2() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="relative bg-[#050505] py-32 overflow-hidden selection:bg-[#D9B07C] selection:text-black">
      {/* Background Shadow Text */}
      <div className="absolute top-28 left-4 text-[12rem] font-black text-white/[0.02] pointer-events-none select-none hidden lg:block uppercase tracking-tighter">
        OFFERS
      </div>
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D9B07C]/20 to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D9B07C]/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 text-right" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[#D9B07C] text-[13px] font-bold uppercase tracking-[0.4em]">باقات الصيانة</span>
            <div className="w-12 h-px bg-[#D9B07C]"></div>
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white leading-tight mb-4 tracking-tighter">
            استثمر في سلامة <br />
            سيارتك مع <span className="text-[#D9B07C]">باقاتنا</span>
          </h2>
        </div>

        {/* Pricing Toggle - Centered */}
        <div className="flex justify-center mb-20" data-aos="fade-up" data-aos-delay="100">
          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-1.5 rounded-2xl backdrop-blur-md">
            <button 
              onClick={() => setIsYearly(false)}
              className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${!isYearly ? "bg-[#D9B07C] text-black shadow-xl" : "text-gray-500 hover:text-white"}`}
            >
              شهرياً
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all duration-300 relative ${isYearly ? "bg-[#D9B07C] text-black shadow-xl" : "text-gray-500 hover:text-white"}`}
            >
              سنوياً
              <span className="absolute -top-3 -right-3 bg-[#D9B07C] text-black text-[9px] font-black px-2 py-1 rounded-md rotate-12 shadow-lg">
                وفر ٢٠٪
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, index) => (
            <PricingCard
              key={index}
              name={plan.name}
              price={isYearly ? plan.yearlyPrice : plan.monthlyPrice}
              period={isYearly ? "سنوياً" : "شهرياً"}
              features={plan.features}
              popular={plan.popular}
              showBadge={plan.showBadge}
              delay={index * 100}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
