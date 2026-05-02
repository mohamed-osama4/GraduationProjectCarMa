import React from "react";
import { HiOutlineCursorArrowRays, HiOutlinePencilSquare, HiOutlineClipboardDocumentCheck, HiOutlineLightBulb } from "react-icons/hi2";
import { FaCarSide } from "react-icons/fa6";

const STEPS = [
  {
    number: "1",
    title: "اختر الخدمة",
    description: "حدد الخدمة التي تحتاجها لسيارتك من قائمة خدماتنا المتنوعة",
    icon: <HiOutlineCursorArrowRays size={28} />,
  },
  {
    number: "2",
    title: "سجل طلبك",
    description: "حدد موقعك والوقت المناسب لك لإتمام الخدمة بسهولة",
    icon: <HiOutlinePencilSquare size={28} />,
  },
  {
    number: "3",
    title: "تأكيد الطلب",
    description: "سيتم تأكيد طلبك وموعدك من قبل فريق خدمة العملاء",
    icon: <HiOutlineClipboardDocumentCheck size={28} />,
  },
  {
    number: "4",
    title: "الاستلام في موقعك",
    description: "سيصلك فريقنا المتخصص في الوقت والمكان المحددين",
    icon: <FaCarSide size={28} />,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="landing-section bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div data-aos="fade-up">
          <span className="section-badge flex items-center justify-center gap-2 w-fit mx-auto">
            <HiOutlineLightBulb size={20} /> كيف يعمل
          </span>
          <h2 className="section-title">احجز خدمتك في 4 خطوات بسيطة</h2>
          <p className="section-subtitle">
            عملية بسيطة وسريعة من الحجز حتى استلام سيارتك بأفضل حال
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line - desktop only */}
          <div className="hidden lg:block step-connector right-[12.5%] left-[12.5%]" />

          {STEPS.map((step, index) => (
            <div
              key={index}
              className="step-card relative z-10"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div className="step-circle">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
