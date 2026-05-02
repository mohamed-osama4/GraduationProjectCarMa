import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { HiOutlineArrowDownTray } from "react-icons/hi2";

import slide1 from "../../../assets/images/landing/slide1.png";
import slide2 from "../../../assets/images/landing/slide2.png";
import slide3 from "../../../assets/images/landing/slide3.png";

const SLIDES = [slide1, slide2, slide3];

export default function Hero() {
  return (
    <section id="hero" className="hero-section flex items-center pt-20">
      {/* Decorative blobs */}
      <div className="hero-blob hero-blob-1 animate-pulse-soft" />
      <div className="hero-blob hero-blob-2 animate-pulse-soft" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-16">
          {/* Text Content */}
          <div data-aos="fade-left" data-aos-duration="1000">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              خدمة متوفرة على مدار الساعة
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              صيانة عربيتك
              <br />
              <span className="text-blue-200">في أي مكان</span>
            </h1>

            <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-lg">
              خدمات صيانة السيارات الاحترافية تصلك لحد باب بيتك. 
              احجز خدمتك بسهولة وسرعة مع فنيين متخصصين ومعتمدين.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#cta"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
              >
                <HiOutlineArrowDownTray size={18} />
                حمّل التطبيق الآن
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10">
              {[
                { value: "+5000", label: "عميل سعيد" },
                { value: "+200", label: "فني معتمد" },
                { value: "4.9", label: "تقييم العملاء" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-blue-200 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Swiper Slider */}
          <div data-aos="fade-right" data-aos-duration="1200" data-aos-delay="200" className="relative group/slider mt-8 lg:mt-0">
            {/* Decorative background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-300 to-primary rounded-[2.5rem] blur-xl opacity-30 animate-pulse-soft mix-blend-screen transition-opacity duration-500 group-hover/slider:opacity-50"></div>
            
            {/* Glassmorphism Frame */}
            <div className="absolute -inset-2 bg-white/10 rounded-[2.5rem] backdrop-blur-sm border border-white/20 z-0 shadow-2xl"></div>
            
            <Swiper
              modules={[Autoplay, Pagination, Navigation, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              spaceBetween={0}
              slidesPerView={1}
              loop
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation
              dir="rtl"
              className="hero-swiper relative z-10 rounded-[2rem] overflow-hidden shadow-2xl"
            >
              {SLIDES.map((src, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full h-full group">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-black/10 z-10 mix-blend-multiply"></div>
                    <img
                      src={src}
                      alt={`خدمة صيانة السيارات ${i + 1}`}
                      className="w-full h-full object-cover transform transition-transform duration-[2000ms] group-hover:scale-110"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
