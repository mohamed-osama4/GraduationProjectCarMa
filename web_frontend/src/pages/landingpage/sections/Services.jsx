import React from "react";
import ServiceCard from "../components/ServiceCard";
import { HiOutlinePhone } from "react-icons/hi2";
import { FaDroplet, FaCircleDot, FaWater, FaTruckPickup, FaBatteryFull } from "react-icons/fa6";
import { MdMiscellaneousServices } from "react-icons/md";

const SERVICES = [
  {
    icon: <FaBatteryFull size={32} />,
    title: "تغيير البطارية",
    description: "تبديل بطارية سيارتك بأفضل الأنواع المتوفرة",
    bgColor: "bg-blue-600 text-white",
    price: 500,
  },
  {
    icon: <FaDroplet size={28} />,
    title: "تغيير الزيت",
    description: "تغيير زيت المحرك والفلتر بزيوت أصلية",
    bgColor: "bg-orange-500 text-white",
    price: 350,
  },
  {
    icon: <FaCircleDot size={28} />,
    title: "خدمة الإطارات",
    description: "فحص وتبديل وإصلاح جميع أنواع الإطارات",
    bgColor: "bg-slate-700 text-white",
    price: 250,
  },
  {
    icon: <FaWater size={28} />,
    title: "غسيل السيارة",
    description: "غسيل شامل وتنظيف داخلي وخارجي احترافي",
    bgColor: "bg-cyan-500 text-white",
    price: 200,
  },
  {
    icon: <HiOutlinePhone size={30} />,
    title: "خدمة الطوارئ",
    description: "استجابة سريعة لجميع حالات الطوارئ على الطريق",
    bgColor: "bg-red-600 text-white",
    price: 300,
  },
  {
    icon: <FaTruckPickup size={30} />,
    title: "خدمة الونش",
    description: "نقل سيارتك بأمان إلى أي مكان تريد",
    bgColor: "bg-purple-600 text-white",
    price: 600,
  },
];

export default function Services() {
  return (
    <section id="services" className="landing-section bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div data-aos="fade-up">
          <span className="section-badge flex items-center justify-center gap-2 w-fit mx-auto">
            <MdMiscellaneousServices size={20} />
            خدماتنا
          </span>
          <h2 className="section-title">خدمات شاملة لسيارتك</h2>
          <p className="section-subtitle">
            نوفر لك مجموعة واسعة من خدمات الصيانة والإصلاح بأعلى معايير الجودة
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              bgColor={service.bgColor}
              price={service.price}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
