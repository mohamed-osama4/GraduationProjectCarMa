import React from "react";
import { HiOutlineArrowLeft } from "react-icons/hi2";

/**
 * Reusable service card component
 * @param {string} icon - Emoji or icon character
 * @param {string} title - Service name
 * @param {string} description - Brief description
 * @param {string} bgColor - Tailwind background class for icon container
 * @param {number} delay - AOS animation delay in ms
 * @param {number} price - Starting price of the service
 */
export default function ServiceCard({ icon, title, description, bgColor = "bg-blue-50", price, delay = 0 }) {
  return (
    <div
      className="service-card group flex flex-col h-full bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 transition-all duration-500 hover:bg-white/10 hover:border-premium-gold/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div className="w-20 h-20 mb-8 rounded-2xl bg-midnight/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-premium-gold group-hover:bg-premium-gold group-hover:text-midnight group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,195,0,0.4)] transition-all duration-500 relative z-10">
        {icon}
      </div>
      
      <h3 className="text-2xl font-black text-white mb-3 group-hover:text-premium-gold transition-colors duration-300">{title}</h3>
      <p className="text-silver/60 text-base leading-relaxed flex-grow">{description}</p>
      
      {price && (
        <div className="flex justify-between items-end mt-8 pt-6 border-t border-white/10 w-full group-hover:border-premium-gold/20 transition-colors">
          <div>
            <p className="text-xs text-silver/40 font-black mb-1">يبدأ من</p>
            <p className="font-black text-2xl text-premium-gold">{price} <span className="text-sm font-bold opacity-60">جنيه</span></p>
          </div>
          <a href="#booking" className="bg-white/5 hover:bg-premium-gold hover:text-midnight p-3 rounded-xl transition-all duration-300 text-premium-gold group-hover:shadow-[0_0_15px_rgba(255,195,0,0.2)]">
            <HiOutlineArrowLeft size={20} />
          </a>
        </div>
      )}
    </div>
  );
}
