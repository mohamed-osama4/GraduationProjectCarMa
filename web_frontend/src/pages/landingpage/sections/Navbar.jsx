import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineBars3, HiXMark, HiOutlineArrowDownTray } from "react-icons/hi2";

const NAV_LINKS = [
  { label: "الرئيسية", href: "#hero" },
  { label: "خدماتنا", href: "#services" },
  { label: "كيف يعمل", href: "#how-it-works" },
  { label: "لماذا نحن", href: "#why-us" },
  { label: "الأسعار", href: "#pricing" },
  { label: "آراء العملاء", href: "#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLinkClick = () => setMobileOpen(false);

  return (
    <nav
      className={`landing-nav fixed z-50 transition-all duration-500 ${scrolled ? "scrolled" : ""} ${mobileOpen ? "mobile-open" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#hero" className="flex items-center gap-2">
              <span className={`text-2xl font-black italic tracking-tighter transition-colors duration-500 ${
                scrolled || mobileOpen ? "text-white" : "text-primary"
              }`}>
                CarMA
              </span>
            </a>
          </div>

          {/* Desktop Nav - Centered */}
          <div className="hidden md:flex items-center justify-center flex-grow px-8">
            <div className="flex items-center gap-6 lg:gap-10">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="nav-link whitespace-nowrap">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">

            
            <a
              href="#cta"
              className={`px-6 py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500 flex items-center gap-2 ${
                scrolled 
                  ? "bg-white text-primary hover:bg-blue-50" 
                  : "bg-primary text-white hover:bg-primary-dark shadow-primary/20"
              }`}
            >
              <HiOutlineArrowDownTray size={18} />
              تحميل التطبيق
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden p-2 rounded-lg transition-all duration-500 ${
              scrolled || mobileOpen ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiXMark size={24} /> : <HiOutlineBars3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          mobileOpen ? "max-h-[600px] border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="px-6 py-6 space-y-4 bg-white/95 backdrop-blur-md rounded-b-[2rem]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block nav-link text-lg py-1"
              onClick={handleLinkClick}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">

            
            <a
              href="#cta"
              className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 rounded-xl font-bold transition-transform active:scale-95"
              onClick={handleLinkClick}
            >
              <HiOutlineArrowDownTray size={20} />
              تحميل التطبيق
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
