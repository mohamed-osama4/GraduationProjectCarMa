import React from "react";
import TestimonialCard from "../components/TestimonialCard";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const TESTIMONIALS = [
  {
    name: "أحمد علي",
    role: "مالك سيارة تويوتا كامري",
    text: "خدمة ممتازة! الفني وصل في الموعد المحدد وعمل صيانة شاملة لسيارتي. أسعار معقولة وجودة عالية.",
    rating: 5,
  },
  {
    name: "سارة أحمد",
    role: "مالكة سيارة هيونداي توسان",
    text: "تطبيق سهل الاستخدام والحجز تم في دقائق. الفني كان محترف جداً وشرح لي كل التفاصيل.",
    rating: 5,
  },
  {
    name: "خالد مصطفي",
    role: "مالك سيارة نيسان باترول",
    text: "من أفضل خدمات صيانة السيارات اللي جربتها. التقرير المفصل عن حالة السيارة كان مفيد جداً.",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="landing-section bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div data-aos="fade-up">
          <span className="section-badge flex items-center justify-center gap-2 w-fit mx-auto">
            <HiOutlineChatBubbleLeftRight size={20} /> آراء العملاء
          </span>
          <h2 className="section-title">ماذا يقول عملاؤنا</h2>
          <p className="section-subtitle">
            آراء حقيقية من عملائنا الكرام تعكس جودة خدماتنا والتزامنا بالتميز
          </p>
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
