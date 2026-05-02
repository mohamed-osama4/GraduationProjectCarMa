import React from "react";
import PricingCard from "../components/PricingCard";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";

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
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="landing-section bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div data-aos="fade-up">
          <span className="section-badge flex items-center justify-center gap-2 w-fit mx-auto">
            <HiOutlineCurrencyDollar size={20} /> الأسعار
          </span>
          <h2 className="section-title">اختر الباقة المناسبة لك</h2>
          <p className="section-subtitle">
            باقات متنوعة تناسب احتياجاتك مع أسعار تنافسية وشفافة بدون رسوم مخفية
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
          {PLANS.map((plan, index) => (
            <PricingCard
              key={index}
              name={plan.name}
              price={plan.price}
              features={plan.features}
              popular={plan.popular}
              delay={index * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
