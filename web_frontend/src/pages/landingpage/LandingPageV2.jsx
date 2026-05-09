import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import HeroV2 from "./sections/HeroV2";
import ServicesV2 from "./sections/ServicesV2";
import HowItWorksV2 from "./sections/HowItWorksV2";
import WhyChooseUsV2 from "./sections/WhyChooseUsV2";
import PricingV2 from "./sections/PricingV2";
import TestimonialsV2 from "./sections/TestimonialsV2";
import CTA from "./sections/CTA";
import Footer from "./sections/Footer";
import "./styles/landing.css";

export default function LandingPageV2() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: "ease-out-cubic",
      offset: 80,
    });
    window.addEventListener("scroll", () => AOS.refresh());
    return () => window.removeEventListener("scroll", () => AOS.refresh());
  }, []);

  return (
    <div className="font-alyamama bg-[#020817] text-white min-h-screen" dir="rtl">
      <main>
        <HeroV2 />
        <ServicesV2 />
        <HowItWorksV2 />
        <WhyChooseUsV2 />
        <PricingV2 />
        <TestimonialsV2 />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
