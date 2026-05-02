import React from "react";
import { HiStar } from "react-icons/hi2";

/**
 * Reusable testimonial card component
 * @param {string} name - Customer name
 * @param {string} role - Customer role/title
 * @param {string} text - Testimonial text
 * @param {number} rating - Star rating (1-5)
 * @param {number} delay - AOS animation delay
 */
export default function TestimonialCard({ name, role, text, rating = 5, delay = 0 }) {
  return (
    <div
      className="testimonial-card"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Stars */}
      <div className="testimonial-stars mb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <HiStar
            key={i}
            className={i < rating ? "text-amber-400" : "text-gray-200"}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-600 leading-relaxed mb-6 text-sm relative z-10">
        {text}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="testimonial-avatar">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-sm">{name}</h4>
          <p className="text-gray-400 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}
