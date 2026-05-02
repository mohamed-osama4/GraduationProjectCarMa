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
      className="service-card flex flex-col h-full"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div className={`service-card-icon ${bgColor}`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed flex-grow">{description}</p>
      
      {price && (
        <div className="flex justify-between items-end mt-6 pt-4 border-t border-gray-100 w-full">
          <div>
            <p className="text-[10px] text-gray-400 font-bold mb-1">يبدأ من</p>
            <p className="font-bold text-lg text-primary">{price} <span className="text-xs">جنيه</span></p>
          </div>
          <a href="#booking" className="text-primary text-sm font-bold flex items-center hover:text-blue-700 transition-colors">
            احجز الآن <HiOutlineArrowLeft size={14} className="mr-1" />
          </a>
        </div>
      )}
    </div>
  );
}
