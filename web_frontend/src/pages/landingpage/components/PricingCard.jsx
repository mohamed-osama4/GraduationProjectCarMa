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

      <h3 className={`text-xl font-bold mb-2 ${popular ? "text-white" : "text-gray-900"}`}>
        {name}
      </h3>

      <div className="my-6">
        <span className="pricing-price">{price}</span>
        <span className={`pricing-currency ${popular ? "text-blue-200" : "text-gray-500"}`}>جنيه</span>
        <div className={`pricing-period mt-1 ${popular ? "text-blue-200" : "text-gray-400"}`}>/ شهرياً</div>
      </div>

      <div className="space-y-3 mb-8 text-right">
        {features.map((feature, i) => (
          <div key={i} className="pricing-feature">
            <HiCheck
              className={`flex-shrink-0 ${popular ? "text-green-300" : "text-green-500"}`}
              size={18}
            />
            <span className={`${popular ? "text-blue-100" : "text-gray-600"}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      <button
        className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
          popular
            ? "bg-white text-primary hover:bg-blue-50 shadow-lg"
            : "bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg"
        }`}
      >
        اشترك الآن
      </button>
    </div>
  );
}
