import React from "react";
import {
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineWrenchScrewdriver,
  HiOutlineMapPin,
  HiOutlineDevicePhoneMobile,
  HiOutlineStar,
} from "react-icons/hi2";

const FEATURES = [
  {
    icon: <HiOutlineShieldCheck size={28} />,
    title: "فنيين معتمدين",
    description: "جميع فنيينا مرخصين ومعتمدين بخبرة لا تقل عن 5 سنوات",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: <HiOutlineClock size={28} />,
    title: "خدمة 24/7",
    description: "متاحين على مدار الساعة طوال أيام الأسبوع لخدمتك",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: <HiOutlineCurrencyDollar size={28} />,
    title: "أسعار شفافة",
    description: "لا رسوم مخفية - تعرف على التكلفة الكاملة قبل البدء",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: <HiOutlineWrenchScrewdriver size={28} />,
    title: "قطع غيار أصلية",
    description: "نستخدم فقط قطع غيار أصلية ومعتمدة مع ضمان شامل",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: <HiOutlineMapPin size={28} />,
    title: "خدمة متنقلة",
    description: "نصل إليك في أي مكان - البيت، المكتب، أو أي موقع تختاره",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: <HiOutlineDevicePhoneMobile size={28} />,
    title: "تطبيق سهل الاستخدام",
    description: "احجز وتابع حالة خدمتك بسهولة من خلال تطبيقنا الذكي",
    color: "bg-cyan-50 text-cyan-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="landing-section bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div data-aos="fade-up">
          <span className="section-badge flex items-center justify-center gap-2 w-fit mx-auto">
            <HiOutlineStar size={20} /> لماذا نحن
          </span>
          <h2 className="section-title">لماذا تختار CarMA؟</h2>
          <p className="section-subtitle">
            نتميز بتقديم خدمات صيانة سيارات استثنائية تجمع بين الجودة والراحة
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={`feature-icon ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
