import React from "react";
import { HiCheck } from "react-icons/hi2";

/**
 * Reusable pricing card component
 * @param {string} name - Plan name
 * @param {number} price - Price value
 * @param {string[]} features - List of included features
 * @param {boolean} popular - Whether this is the highlighted plan
 * @param {number} delay - AOS animation delay
 */
export default function PricingCard({ name, price, features, popular = false, delay = 0 }) {
  return (
    <div
      className={`pricing-card ${popular ? "popular" : ""}`}
      data-aos="zoom-in"
      data-aos-delay={delay}
    >
      {popular && <span className="pricing-badge">الأكثر طلباً</span>}

      <h3 className={`text-xl font-bold mb-2 ${popular ? "text-white" : "text-white"}`}>
        {name}
      </h3>

      <div className="my-6">
        <span className="pricing-price">{price}</span>
        <span className={`pricing-currency ${popular ? "text-blue-200" : "text-silver/60"}`}>جنيه</span>
        <div className={`pricing-period mt-1 ${popular ? "text-blue-200" : "text-silver/40"}`}>/ شهرياً</div>
      </div>

      <div className="space-y-3 mb-8 text-right">
        {features.map((feature, i) => (
          <div key={i} className="pricing-feature">
            <HiCheck
              className={`flex-shrink-0 ${popular ? "text-green-300" : "text-premium-gold"}`}
              size={18}
            />
            <span className={`${popular ? "text-blue-100" : "text-silver/70"}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      <button
        className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
          popular
            ? "bg-white text-midnight hover:bg-silver shadow-lg"
            : "bg-premium-gold text-midnight hover:bg-gold-light shadow-md hover:shadow-lg"
        }`}
      >
        اشترك الآن
      </button>
    </div>
  );
}
