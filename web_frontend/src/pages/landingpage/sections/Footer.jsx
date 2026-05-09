import React from "react";
import { HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin } from "react-icons/hi2";
import { FaXTwitter, FaInstagram, FaSnapchat, FaTiktok } from "react-icons/fa6";

const FOOTER_LINKS = {
  خدماتنا: ["صيانة دورية", "فحص البطارية", "صيانة المكيف", "الإطارات والفرامل"],
  "عن CarMa": ["من نحن", "فريق العمل", "شركاؤنا", "وظائف"],
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
    <footer className="bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-8">

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2 text-right">
            <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2">
              Car<span className="text-[#D9B07C]">Ma</span>
            </h3>
            <div className="w-8 h-[2px] bg-[#D9B07C] mb-6 mr-auto ml-0"></div>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-sm">
              منصة متكاملة لخدمات صيانة السيارات. نوفر لك أفضل الفنيين المعتمدين مع ضمان شامل على جميع خدماتنا.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <HiOutlinePhone className="text-[#D9B07C]" size={16} />
                <span dir="ltr">+20 100 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineEnvelope className="text-[#D9B07C]" size={16} />
                <span>info@CarMa.eg</span>
              </div>
              <div className="flex items-center gap-3">
                <HiOutlineMapPin className="text-[#D9B07C]" size={16} />
                <span>القاهرة، مصر</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="text-right">
              <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 text-sm hover:text-[#D9B07C] transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-700 text-xs">
            © {new Date().getFullYear()} CarMa. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-600 hover:border-[#D9B07C] hover:text-[#D9B07C] transition-all duration-300 text-sm"
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
