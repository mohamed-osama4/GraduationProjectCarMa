import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Services from "./sections/Services";
import HowItWorks from "./sections/HowItWorks";
import WhyChooseUs from "./sections/WhyChooseUs";
import Pricing from "./sections/Pricing";
import Testimonials from "./sections/Testimonials";
import CTA from "./sections/CTA";
import Footer from "./sections/Footer";
import "./styles/landing.css";

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
      offset: 80,
    });
  }, []);

  return (
    <div className="font-sans" dir="rtl">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <WhyChooseUs />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
