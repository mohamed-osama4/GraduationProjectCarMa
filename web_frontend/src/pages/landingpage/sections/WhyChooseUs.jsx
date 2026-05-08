import React from "react";
import {
  HiOutlineShieldCheck,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineWrenchScrewdriver,
  HiOutlineMapPin,
  HiOutlineDevicePhoneMobile,
  HiOutlineCpuChip,
  HiOutlineStar,
} from "react-icons/hi2";

const FEATURES = [
  {
    icon: <HiOutlineShieldCheck size={28} />,
    title: "مراكز صيانة معتمدة",
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
    icon: <HiOutlineCpuChip size={28} />,
    title: "تشخيص بالذكاء الاصطناعي",
    description: "نستخدم تقنيات الذكاء الاصطناعي المتطورة لتحديد أعطال سيارتك بدقة وسرعة فائقة",
    color: "bg-indigo-50 text-indigo-600",
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
    <section id="why-us" className="landing-section premium-dark-section">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-premium-gold/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div data-aos="fade-up">
          <span className="section-badge flex items-center justify-center gap-2 w-fit mx-auto">
            <HiOutlineStar size={20} /> لماذا نحن
          </span>
          <h2 className="section-title">لماذا تختار CarMa؟</h2>
          <p className="section-subtitle">
            نتميز بتقديم خدمات صيانة سيارات استثنائية تجمع بين الجودة والراحة
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="feature-card group"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-3 transition-colors group-hover:text-premium-gold">
                {feature.title}
              </h3>
              <p className="text-silver/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
