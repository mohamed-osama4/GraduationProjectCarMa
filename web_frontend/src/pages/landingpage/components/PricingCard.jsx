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
export default function PricingCard({ name, price, features, popular = false, showBadge = false, delay = 0 }) {
  return (
    <div
      className={`pricing-card group flex flex-col ${popular ? "popular" : ""}`}
      data-aos="zoom-in"
      data-aos-delay={delay}
    >
      {showBadge && <span className="pricing-badge">الأكثر طلباً</span>}

      <div className="flex-grow">
        <h3 className="text-2xl font-black mb-2 text-white group-hover:text-premium-gold transition-colors">
          {name}
        </h3>

        <div className="my-6">
          <span className="pricing-price text-white">{price}</span>
          <span className="pricing-currency text-premium-gold mr-1">جنيه</span>
          <div className="pricing-period mt-1 text-silver/40">/ شهرياً</div>
        </div>

        <div className="space-y-4 mb-10 text-right">
          {features.map((feature, i) => (
            <div key={i} className="pricing-feature flex items-center gap-3">
              <HiCheck
                className="flex-shrink-0 text-premium-gold"
                size={20}
              />
              <span className="text-silver/80 text-sm">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        className={`w-full py-4 px-6 rounded-xl font-black text-sm transition-all duration-500 cursor-pointer mt-auto ${
          popular
            ? "bg-premium-gold text-midnight hover:bg-gold-light shadow-[0_0_30px_rgba(255,195,0,0.3)] hover:shadow-[0_0_40px_rgba(255,195,0,0.5)] hover:-translate-y-1"
            : "bg-white/10 text-white hover:bg-premium-gold hover:text-midnight border border-white/10 hover:border-transparent"
        }`}
      >
        اشترك الآن
      </button>
    </div>
  );
}
