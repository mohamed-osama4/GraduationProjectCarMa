import React from "react";
import slide3 from "../../../assets/images/landing/slide3.png";
import { FaApple, FaGooglePlay } from "react-icons/fa6";

export default function CTA() {
  return (
    <section id="cta" className="cta-section py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div data-aos="fade-left">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 leading-tight">
              احجز خدماتك بسهولة
              <br />
              <span className="text-blue-200">من موبايلك</span>
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-lg">
              حمّل تطبيق CarMA الآن واحصل على خصم 20% على أول خدمة. 
              متوفر على iOS و Android.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-3 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg cursor-pointer">
                <FaApple size={24} />
                <div className="text-right">
                  <div className="text-[10px] opacity-70">حمّل من</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <FaGooglePlay size={22} />
                <div className="text-right">
                  <div className="text-[10px] opacity-70">حمّل من</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Image */}
          <div data-aos="fade-right" data-aos-delay="200" className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl" />
              <img
                src={slide3}
                alt="تطبيق CarMA"
                className="relative rounded-2xl shadow-2xl max-h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
