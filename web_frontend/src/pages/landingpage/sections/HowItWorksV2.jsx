import React from "react";
import { HiOutlineCursorArrowRays, HiOutlinePencilSquare, HiOutlineClipboardDocumentCheck } from "react-icons/hi2";
import { FaCarSide } from "react-icons/fa6";

const STEPS = [
  {
    number: "1",
    title: "اختر الخدمة",
    description: "حدد الخدمة التي تحتاجها لسيارتك من قائمة خدماتنا المتنوعة",
    icon: <HiOutlineCursorArrowRays size={32} />,
  },
  {
    number: "2",
    title: "سجل طلبك",
    description: "حدد موقعك والوقت المناسب لك لإتمام الخدمة بسهولة",
    icon: <HiOutlinePencilSquare size={32} />,
  },
  {
    number: "3",
    title: "تأكيد الطلب",
    description: "سيتم تأكيد طلبك وموعدك من قبل فريق خدمة العملاء",
    icon: <HiOutlineClipboardDocumentCheck size={32} />,
  },
  {
    number: "4",
    title: "الاستلام في موقعك",
    description: "سيصلك فريقنا المتخصص في الوقت والمكان المحددين",
    icon: <FaCarSide size={32} />,
  },
];

export default function HowItWorksV2() {
  return (
    <section id="how-it-works" className="bg-[#121212] py-32 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div data-aos="fade-up" className="mb-24 flex flex-col items-start text-right">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[#D9B07C] text-[15px] font-bold uppercase tracking-[0.3em]">ببساطة</span>
            <div className="w-12 h-[1px] bg-[#D9B07C]"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">كيف يعمل <span className="text-[#D9B07C]">CarMa</span></h2>
          <p className="text-gray-500 max-w-2xl">
            خطوات بسيطة تفصلك عن صيانة سيارتك بأعلى معايير الجودة والاحترافية
          </p>
        </div>

        <div className="relative">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-0 relative z-10">
            {STEPS.map((step, index) => (
              <React.Fragment key={index}>
                {/* Step Item */}
                <div
                  className="group text-center lg:w-[200px]"
                  data-aos="fade-left"
                  data-aos-delay={index * 400}
                >
                  <div 
                    className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#050505] border border-[#D9B07C]/20 flex items-center justify-center text-[#D9B07C] group-hover:bg-[#D9B07C] group-hover:text-black group-hover:border-[#D9B07C] group-hover:shadow-[0_0_40px_rgba(217,176,124,0.2)] transition-all duration-700 relative z-10 cursor-pointer"
                  >
                    <div className="relative">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#D9B07C] transition-colors duration-300">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-[200px] mx-auto group-hover:text-gray-400 transition-colors duration-300">
                    {step.description}
                  </p>
                </div>

                {/* Connection Line Segment */}
                {index < STEPS.length - 1 && (
                  <div 
                    className="hidden lg:block flex-grow h-[12px] mt-12 overflow-hidden opacity-80 mx-[-30px]"
                    data-aos="fade-left"
                    data-aos-delay={index * 400 + 200}
                  >
                    <div 
                      className="w-full h-full animate-flow-rtl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 5L7 10L12 15' stroke='%23D9B07C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat-x',
                        backgroundSize: '20px 100%',
                        filter: 'drop-shadow(0 0 3px rgba(217, 176, 124, 0.8))'
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
