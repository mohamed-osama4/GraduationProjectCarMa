import React from "react";
import { HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin } from "react-icons/hi2";
import { FaXTwitter, FaInstagram, FaSnapchat, FaTiktok } from "react-icons/fa6";

const FOOTER_LINKS = {
  خدماتنا: ["صيانة دورية", "فحص البطارية", "صيانة المكيف", "الإطارات والفرامل"],
  "عن CarMA": ["من نحن", "فريق العمل", "شركاؤنا", "وظائف"],
  الدعم: ["الأسئلة الشائعة", "سياسة الخصوصية", "الشروط والأحكام", "تواصل معنا"],
};

const SOCIALS = [
  { icon: <FaXTwitter />, label: "X" },
  { icon: <FaInstagram />, label: "Instagram" },
  { icon: <FaSnapchat />, label: "Snapchat" },
  { icon: <FaTiktok />, label: "TikTok" },
];

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-black text-white italic tracking-tighter mb-4">
              CarMA
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              منصة متكاملة لخدمات صيانة السيارات. نوفر لك أفضل الفنيين المعتمدين مع ضمان شامل على جميع خدماتنا.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <HiOutlinePhone className="text-blue-400" size={16} />
                <span className="direction-ltr">+966 50 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineEnvelope className="text-blue-400" size={16} />
                <span>info@carma.sa</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineMapPin className="text-blue-400" size={16} />
                <span>القاهرة، مصر</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="footer-link text-sm">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} CarMA. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href="#"
                className="footer-social-icon"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
