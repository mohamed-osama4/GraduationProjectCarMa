import React from "react";
import PricingCard from "../components/PricingCard";

const PLANS = [
  {
    name: "الباقة الأساسية",
    price: 199,
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
    price: 499,
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
    price: 899,
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
  return (
    <section id="pricing" className="bg-[#121212] py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header - Unified Right Alignment */}
        <div className="flex flex-col items-start mb-24 text-right" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[#D9B07C] text-[15px] font-bold uppercase tracking-[0.3em]">باقات الصيانة</span>
            <div className="w-12 h-[1px] bg-[#D9B07C]"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
            استثمر في سلامة <br />
            سيارتك مع <span className="text-[#D9B07C]">باقاتنا</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, index) => (
            <PricingCard
              key={index}
              name={plan.name}
              price={plan.price}
              features={plan.features}
              popular={plan.popular}
              showBadge={plan.showBadge}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
