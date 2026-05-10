import React from "react";
import { HiCheck, HiOutlineSparkles } from "react-icons/hi2";

// Convert Western numerals to Eastern Arabic-Indic numerals
const toArabicNumerals = (num) =>
  String(num).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

/**
 * Reusable pricing card component - Premium Midnight-Gold Design
 */
export default function PricingCard({ name, price, period, features, popular = false, showBadge = false, delay = 0 }) {
  return (
    <div
      className={`relative flex flex-col p-10 transition-all duration-700 group
        ${popular
          ? "bg-[#D9B07C] border-[#D9B07C] text-black shadow-[0_30px_100px_-20px_rgba(217,176,124,0.3)] scale-105 z-10 rounded-[2.5rem]"
          : "bg-white/[0.02] backdrop-blur-xl border border-white/10 text-white hover:bg-white/[0.04] hover:border-[#D9B07C]/30 rounded-[2rem]"
        }
      `}
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {/* Glow Effect for popular card */}
      {popular && (
        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-[2.5rem] -z-10 opacity-50"></div>
      )}

      {/* Popular badge */}
      {showBadge && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-[#D9B07C] text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full flex items-center gap-2 shadow-2xl border border-[#D9B07C]/20">
          <HiOutlineSparkles className="animate-pulse" />
          الأكثر طلباً
        </div>
      )}

      {/* Plan Name */}
      <h3 className={`text-2xl font-black mb-8 tracking-tighter ${popular ? "text-black" : "text-white"}`}>
        {name}
      </h3>

      {/* Price */}
      <div className={`mb-10 pb-10 border-b ${popular ? "border-black/10" : "border-white/5"}`}>
        <div className="flex items-end gap-3 justify-start">
          <span className={`text-6xl font-black leading-none tracking-tighter ${popular ? "text-black" : "text-white"}`}>
            {toArabicNumerals(price)}
          </span>
          <div className={`mb-2 text-right ${popular ? "text-black/60" : "text-gray-500"}`}>
            <div className="text-sm font-black uppercase tracking-widest">جنيه</div>
            <div className="text-[10px] font-bold">/ {period}</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="flex-grow space-y-5 mb-12">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-4 group/item">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${popular ? "bg-black/10" : "bg-[#D9B07C]/10 group-hover/item:bg-[#D9B07C]/20"}`}>
              <HiCheck
                className={`${popular ? "text-black" : "text-[#D9B07C]"}`}
                size={14}
              />
            </div>
            <span className={`text-[14px] font-medium transition-colors ${popular ? "text-black/80" : "text-gray-400 group-hover/item:text-white"}`}>
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        className={`w-full py-5 px-8 font-black text-[13px] tracking-[0.2em] uppercase transition-all duration-500 rounded-2xl shadow-xl hover:-translate-y-1
          ${popular
            ? "bg-black text-[#D9B07C] hover:bg-black/90 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]"
            : "bg-white/5 border border-white/10 text-white hover:bg-[#D9B07C] hover:text-black hover:border-[#D9B07C] hover:shadow-[0_20px_40px_-10px_rgba(217,176,124,0.3)]"
          }
        `}
      >
        اشترك الآن
      </button>
    </div>
  );
}
