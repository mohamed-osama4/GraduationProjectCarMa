import React from "react";
import mobileMockup from "../../../assets/mockup2.PNG";
import { FaApple, FaGooglePlay } from "react-icons/fa6";

export default function CTA() {
  return (
    <section id="cta" className="cta-section py-6 sm:py-8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div data-aos="fade-left">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
              احجز خدماتك بسهولة
              <br />
              <span className="text-premium-gold">من موبايلك</span>
            </h2>
            <p className="text-blue-100 text-[20px] text-base leading-relaxed mb-6 max-w-lg">
              حمّل تطبيق CarMa الآن واحصل على خصم 20% على أول خدمة. 
              متوفر على iOS و Android.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-3 bg-premium-gold text-midnight font-bold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-all duration-300 shadow-lg cursor-pointer">
                <FaApple size={22} />
                <div className="text-right">
                  <div className="text-[9px] opacity-70">حمّل من</div>
                  <div className="text-xs font-bold">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-3 bg-white text-midnight font-bold px-5 py-2.5 rounded-xl hover:bg-silver transition-all duration-300 cursor-pointer shadow-lg">
                <FaGooglePlay size={20} />
                <div className="text-right">
                  <div className="text-[9px] opacity-70">حمّل من</div>
                  <div className="text-xs font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Image */}
          <div data-aos="fade-right" data-aos-delay="200" className="flex justify-center">
            <div className="relative">
              <img
                src={mobileMockup}
                alt="تطبيق CarMa"
                className="relative drop-shadow-3xl max-h-[570px] w-auto object-contain transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
