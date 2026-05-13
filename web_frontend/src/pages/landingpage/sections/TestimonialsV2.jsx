import React from "react";
import TestimonialCard from "../components/TestimonialCard";

const TESTIMONIALS = [
  {
    name: "محمد أسامة",
    role: "مالك سيارة تويوتا كامري",
    text: "خدمة ممتازة! الفني وصل في الموعد المحدد وعمل صيانة شاملة لسيارتي. أسعار معقولة وجودة عالية تفوق جميع الوكالات.",
    rating: 5,
  },
  {
    name: "هويدة العدل",
    role: "مالكة سيارة هيونداي توسان",
    text: "تطبيق سهل الاستخدام والحجز تم في خلال دقائق معدودة. الفني كان محترف جداً وشرح لي كل التفاصيل التي كانت تقلقني.",
    rating: 5,
  },
  {
    name: "عبد الرحمن المونجي",
    role: "مالك سيارة نيسان باترول",
    text: "من أفضل خدمات صيانة السيارات التي جربتها في مصر. التقرير المفصل عن حالة السيارة كان مفيداً جداً لاتخاذ القرار.",
    rating: 5,
  },
];

export default function TestimonialsV2() {
  return (
    <section id="testimonials" className="bg-[#050505] py-32 border-t border-white/5 relative overflow-hidden">
      {/* Background Shadow Text */}
      <div className="absolute top-28 left-4 text-[12rem] font-black text-white/[0.02] pointer-events-none select-none hidden lg:block uppercase tracking-tighter">
        Reviews
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header - Unified Right Alignment */}
        <div className="flex flex-col items-start mb-24 text-right" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[#D9B07C] text-[15px] font-bold tracking-[0.3em]">قصص عملائنا</span>
            <div className="w-12 h-[1px] bg-[#D9B07C]"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
            يثقون في <span className="italic">Car<span className="text-[#D9B07C]">Ma</span></span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, index) => (
            <TestimonialCard
              key={index}
              name={item.name}
              role={item.role}
              text={item.text}
              rating={item.rating}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
