import React from "react";
import { HiOutlineCursorArrowRays, HiOutlinePencilSquare, HiOutlineClipboardDocumentCheck, HiOutlineLightBulb } from "react-icons/hi2";
import { FaCarSide } from "react-icons/fa6";

const STEPS = [
  {
    number: "1",
    title: "اختر الخدمة",
    description: "حدد الخدمة التي تحتاجها لسيارتك من قائمة خدماتنا المتنوعة",
    icon: <HiOutlineCursorArrowRays size={40} />,
  },
  {
    number: "2",
    title: "سجل طلبك",
    description: "حدد موقعك والوقت المناسب لك لإتمام الخدمة بسهولة",
    icon: <HiOutlinePencilSquare size={40} />,
  },
  {
    number: "3",
    title: "تأكيد الطلب",
    description: "سيتم تأكيد طلبك وموعدك من قبل فريق خدمة العملاء",
    icon: <HiOutlineClipboardDocumentCheck size={40} />,
  },
  {
    number: "4",
    title: "الاستلام في موقعك",
    description: "سيصلك فريقنا المتخصص في الوقت والمكان المحددين",
    icon: <FaCarSide size={40} />,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="landing-section premium-dark-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div data-aos="fade-up" className="mb-12">
          <h2 className="section-title">كيف يعمل CarMA</h2>
          <p className="section-subtitle mx-auto">
            خطوات بسيطة تفصلك عن صيانة سيارتك
          </p>
        </div>

        <div className="relative">
          {/* Continuous Connection Line (Desktop only) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-[2px] animate-dash opacity-30 z-0" />

          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-4 relative z-10">
            {STEPS.map((step, index) => (
              <div
                key={index}
                className="group text-center flex-1"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div 
                  className="w-24 h-24 mx-auto mb-8 rounded-full bg-midnight/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-premium-gold group-hover:bg-premium-gold group-hover:text-midnight group-hover:shadow-[0_0_30px_rgba(255,195,0,0.4)] transition-all duration-500 relative z-10 cursor-pointer"
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-premium-gold transition-colors duration-300">{step.title}</h3>
                <p className="text-silver/60 text-sm leading-relaxed max-w-[200px] mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
