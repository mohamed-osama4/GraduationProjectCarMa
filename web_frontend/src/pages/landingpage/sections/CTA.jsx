import React from "react";
import mobileMockup from "../../../assets/mockup2.png";
import { FaApple, FaGooglePlay } from "react-icons/fa6";

export default function CTA() {
  return (
    <section id="cta" className="bg-[#121212] py-24 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D9B07C]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div data-aos="fade-left" className="text-right">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#D9B07C] text-[15px] font-bold tracking-[0.3em]">حمّل التطبيق</span>
              <div className="w-12 h-[1px] bg-[#D9B07C]"></div>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              احجز خدماتك <br />
              من <span className="text-[#D9B07C]">موبايلك</span>
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-lg">
              حمّل تطبيق <span className="text-gray-300">CarMa</span> الآن واحصل على خصم ٢٠٪ على أول خدمة.
              متوفر على iOS و Android.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* App Store */}
              <button className="flex items-center gap-3 bg-[#D9B07C] text-black font-bold px-6 py-3.5 hover:brightness-110 transition-all duration-300 cursor-pointer">
                <FaApple size={22} />
                <div className="text-right">
                  <div className="text-[9px] opacity-60 uppercase tracking-wider">حمّل من</div>
                  <div className="text-sm font-black">App Store</div>
                </div>
              </button>

              {/* Google Play */}
              <button className="flex items-center gap-3 border border-[#D9B07C]/30 text-white font-bold px-6 py-3.5 hover:border-[#D9B07C] hover:text-[#D9B07C] transition-all duration-300 cursor-pointer">
                <FaGooglePlay size={20} />
                <div className="text-right">
                  <div className="text-[9px] opacity-60 uppercase tracking-wider">حمّل من</div>
                  <div className="text-sm font-black">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Mockup Image */}
          <div data-aos="fade-right" data-aos-delay="200" className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#D9B07C]/10 blur-[60px] rounded-full scale-75" />
              <img
                src={mobileMockup}
                alt="تطبيق CarMa"
                className="relative z-10 drop-shadow-2xl max-h-[520px] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
