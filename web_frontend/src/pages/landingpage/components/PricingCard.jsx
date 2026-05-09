import React from "react";
import { HiCheck } from "react-icons/hi2";

// Convert Western numerals to Eastern Arabic-Indic numerals
const toArabicNumerals = (num) =>
  String(num).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

/**
 * Reusable pricing card component - Premium Midnight-Gold Design
 * @param {string} name - Plan name
 * @param {number} price - Price value
 * @param {string[]} features - List of included features
 * @param {boolean} popular - Whether this is the highlighted plan
 * @param {number} delay - AOS animation delay
 */
export default function PricingCard({ name, price, features, popular = false, showBadge = false, delay = 0 }) {
  return (
    <div
      className={`relative flex flex-col p-8 border text-right transition-all duration-500
        ${popular
          ? "bg-[#D9B07C] border-[#D9B07C] text-black"
          : "bg-gradient-to-br from-[#1a1208] via-[#121212] to-[#1a1510] border-[#D9B07C]/20 hover:border-[#D9B07C]/50"
        }
      `}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Popular badge */}
      {showBadge && (
        <span className="absolute top-0 right-8 -translate-y-1/2 bg-black text-[#D9B07C] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5">
          الأكثر طلباً
        </span>
      )}

      {/* Plan Name */}
      <h3 className={`text-xl font-black mb-6 tracking-tight ${popular ? "text-black" : "text-white"}`}>
        {name}
      </h3>

      {/* Price */}
      <div className="mb-8 pb-8 border-b border-current/10">
        <div className="flex items-end gap-2 justify-start">
          <span className={`text-[56px] font-black leading-none ${popular ? "text-black" : "text-white"}`}>
            {toArabicNumerals(price)}
          </span>
          <div className={`mb-2 text-right ${popular ? "text-black/60" : "text-[#D9B07C]/60"}`}>
            <div className="text-sm font-bold">جنيه</div>
            <div className="text-xs">/ شهرياً</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="flex-grow space-y-4 mb-10">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-3">
            <HiCheck
              className={`flex-shrink-0 ${popular ? "text-black" : "text-[#D9B07C]"}`}
              size={18}
            />
            <span className={`text-sm ${popular ? "text-black/80" : "text-gray-400"}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        className={`w-full py-4 px-6 font-black text-sm tracking-wider uppercase transition-all duration-300 mt-auto
          ${popular
            ? "bg-black text-[#D9B07C] hover:bg-black/80"
            : "border border-[#D9B07C]/30 text-[#D9B07C] hover:bg-[#D9B07C] hover:text-black hover:border-[#D9B07C]"
          }
        `}
      >
        اشترك الآن
      </button>
    </div>
  );
}
