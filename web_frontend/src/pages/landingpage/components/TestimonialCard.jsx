import React from "react";
import { HiStar } from "react-icons/hi2";

/**
 * Reusable testimonial card component - Premium Midnight-Gold Design
 * @param {string} name - Customer name
 * @param {string} role - Customer role/title
 * @param {string} text - Testimonial text
 * @param {number} rating - Star rating (1-5)
 * @param {number} delay - AOS animation delay
 */
export default function TestimonialCard({ name, role, text, rating = 5, delay = 0 }) {
  return (
    <div
      className="relative bg-[#121212] border border-[#D9B07C]/20 p-8 text-right"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Stars - top right */}
      <div className="flex items-center justify-start gap-1 mb-6">
        {Array.from({ length: 5 }, (_, i) => (
          <HiStar
            key={i}
            size={16}
            className={i < rating ? "text-[#D9B07C]" : "text-white/10"}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-400 leading-relaxed mb-8 text-sm">
        «{text}»
      </p>

      {/* Divider */}
      <div className="w-full h-[1px] bg-white/5 mb-6"></div>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#D9B07C]/10 border border-[#D9B07C]/30 flex items-center justify-center text-[#D9B07C] font-black text-sm flex-shrink-0">
          {name.charAt(0)}
        </div>
        <div className="text-right">
          <h4 className="font-bold text-white text-sm">{name}</h4>
          <p className="text-gray-600 text-xs mt-0.5">{role}</p>
        </div>
      </div>
    </div>
  );
}
