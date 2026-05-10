import React, { useEffect, useState } from "react";
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
import Preloader from "./components/Preloader";
import "./styles/landing.css";

export default function LandingPageV2() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: "ease-out-cubic",
      offset: 80,
    });

    // Handle Preloader timeout or window load
    const timer = setTimeout(() => {
      setLoading(false);
      // Refresh AOS after preloader is gone
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }, 2500); // 2.5 seconds for a premium feel

    window.addEventListener("scroll", () => AOS.refresh());
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", () => AOS.refresh());
    };
  }, []);

  return (
    <>
      {loading && <Preloader />}
      <div className={`font-alyamama bg-[#020817] text-white min-h-screen transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`} dir="rtl">
        <main>
          <HeroV2 isLoaded={!loading} />
          <ServicesV2 />
          <HowItWorksV2 />
          <WhyChooseUsV2 />
          <PricingV2 />
          <TestimonialsV2 />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
