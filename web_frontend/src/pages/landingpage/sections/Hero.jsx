import React from "react";
import {
  HiOutlineArrowDownTray,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineStar,
} from "react-icons/hi2";
import heroImage from "../../../assets/images/landing/hero-section-image.png";

export default function Hero() {
  return (
    <section id="hero" className="hero-section relative min-h-screen bg-[#020817] overflow-hidden">
      {/* Full-width Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Car Maintenance Service"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays to blend image into dark background on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#020817]/50 to-[#020817]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-[#020817]/70" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-between pt-28 pb-10">
        {/* Main Content */}
        <div className="flex-grow flex items-end pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
            {/* Text Content — right side in RTL (first child = right) */}
            <div className="mt-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/90 text-xs font-bold px-4 py-2 rounded-full mb-8 mt-[40px] border border-white/15">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                خدمة موثوقة على مدار الساعة
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.15] mb-6">
                صيانة عربيتك
                <br />
                <span className="text-premium-gold"> في اي مكان</span>
              </h1>

              <p className="text-gray-400 text-sm lg:text-base leading-relaxed mb-8 max-w-md">
                خدمات صيانة وإصلاح السيارات في أي مكان
                بسهولة وسرعة مع فنيين متخصصين ومعتمدين.
              </p>

              {/* Action Button */}
              <div className="flex flex-wrap items-center gap-5">
                <a
                  href="#cta"
                  className="inline-flex items-center gap-3 bg-premium-gold text-midnight font-bold px-8 py-4 rounded-xl hover:bg-gold-light transition-all duration-300 shadow-[0_0_25px_rgba(255,195,0,0.4)] hover:shadow-[0_0_35px_rgba(255,195,0,0.6)] hover:-translate-y-0.5 text-sm"
                >
                  <HiOutlineArrowDownTray size={18} />
                  تحميل التطبيق
                </a>
              </div>
            </div>

            {/* Empty spacer — image shows through on the left in RTL */}
            <div className="hidden lg:block" />
          </div>
        </div>

        {/* Bottom Bar: Stats */}
        <div className="flex justify-start mt-8">

          {/* Stats */}
          <div className="flex items-center gap-3">
            {[
              { value: "+5000", label: "عميل سعيد", icon: <HiOutlineStar size={20} className="text-premium-gold" /> },
              { value: "+200", label: "فني معتمد", icon: <HiOutlineShieldCheck size={20} className="text-green-400" /> },
              { value: "4.9", label: "تقييم العملاء", icon: <HiOutlineUsers size={20} className="text-amber-400" /> },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/5 px-6 py-5 rounded-2xl min-w-[120px] text-center"
              >
                <div className="flex justify-center mb-2 opacity-80">
                  {stat.icon}
                </div>
                <div className="text-xl font-black text-white">{stat.value}</div>
                <div className="text-gray-500 text-[10px] mt-1 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
