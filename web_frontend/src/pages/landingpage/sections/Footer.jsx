import React from "react";
import { HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin, HiOutlineArrowLeft } from "react-icons/hi2";
import { FaXTwitter, FaInstagram, FaSnapchat, FaTiktok, FaApple, FaGooglePlay } from "react-icons/fa6";

const FOOTER_LINKS = {
  خدماتنا: ["تغيير البطارية", "تغيير الزيت", "خدمة الإطارات", "غسيل السيارة", "خدمة الطوارئ", "خدمة الونش"],
  "عن CarMa": ["من نحن", "فريق العمل", "شركاؤنا", "وظائف"],
  الدعم: ["الأسئلة الشائعة", "سياسة الخصوصية", "الشروط والأحكام", "تواصل معنا"],
};

const SOCIALS = [
  { icon: <FaXTwitter />, label: "X", color: "hover:text-white" },
  { icon: <FaInstagram />, label: "Instagram", color: "hover:text-pink-500" },
  { icon: <FaSnapchat />, label: "Snapchat", color: "hover:text-yellow-400" },
  { icon: <FaTiktok />, label: "TikTok", color: "hover:text-cyan-400" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#050505] pt-24 pb-12 overflow-hidden selection:bg-[#D9B07C] selection:text-black">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#D9B07C]/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Newsletter / CTA Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20 p-6 md:p-10 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <div className="text-right">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4">اشترك في نشرتنا الإخبارية</h3>
            <p className="text-gray-500 text-sm max-w-md mr-0 ml-auto">
              كن أول من يعرف عن عروضنا الحصرية وخدماتنا الجديدة. انضم إلى أكثر من 10,000 عميل يثقون بنا.
            </p>
          </div>
          <div className="relative w-full">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white/[0.03] border border-white/10 p-2 rounded-xl focus-within:border-[#D9B07C]/50 transition-all">
              <button className="bg-[#D9B07C] text-black px-8 py-3 rounded-lg font-bold text-sm hover:brightness-110 transition-all whitespace-nowrap order-2 sm:order-1">
                اشترك الآن
              </button>
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="bg-transparent border-none text-white text-right px-4 py-3 sm:py-2 w-full focus:outline-none placeholder:text-gray-600 order-1 sm:order-2"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-16 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-2 text-right">
            <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter mb-6">
              Car<span className="text-[#D9B07C]">Ma</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm mr-0 ml-auto">
              CarMa هي وجهتك الأولى للعناية الفائقة بالسيارات. نحن نجمع بين الخبرة التقنية والراحة الرقمية لنقدم لك أفضل تجربة صيانة مباشرة عند باب منزلك.
            </p>
            
            <div className="space-y-6">
              <a href="tel:+201001234567" className="flex items-center justify-end gap-4 group">
                <div className="text-right">
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">اتصل بنا</p>
                  <p className="text-white font-bold group-hover:text-[#D9B07C] transition-colors" dir="ltr">+20 100 123 4567</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#D9B07C] group-hover:bg-[#D9B07C] group-hover:text-black transition-all">
                  <HiOutlinePhone size={18} />
                </div>
              </a>
              
              <a href="mailto:info@carma.eg" className="flex items-center justify-end gap-4 group">
                <div className="text-right">
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">راسلنا</p>
                  <p className="text-white font-bold group-hover:text-[#D9B07C] transition-colors">info@carma.eg</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#D9B07C] group-hover:bg-[#D9B07C] group-hover:text-black transition-all">
                  <HiOutlineEnvelope size={18} />
                </div>
              </a>
            </div>
          </div>

          {/* Dynamic Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="text-right">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8 relative inline-block">
                {title}
                <span className="absolute -bottom-2 right-0 w-8 h-px bg-[#D9B07C]"></span>
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="group flex items-center justify-end gap-2 text-gray-500 text-sm hover:text-white transition-all">
                      <span className="group-hover:translate-x-0 translate-x-2 opacity-0 group-hover:opacity-100 transition-all text-[#D9B07C]">
                        <HiOutlineArrowLeft size={14} />
                      </span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* App Download Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 order-2 lg:order-1">
            <a href="#" className="flex items-center gap-3 bg-white/[0.03] border border-white/5 px-5 py-2.5 rounded-xl hover:bg-white/[0.08] transition-all group">
              <div className="text-right">
                <p className="text-[9px] text-gray-600 leading-none">Available on the</p>
                <p className="text-sm font-bold text-white group-hover:text-[#D9B07C]">App Store</p>
              </div>
              <FaApple className="text-2xl text-white" />
            </a>
            <a href="#" className="flex items-center gap-3 bg-white/[0.03] border border-white/5 px-5 py-2.5 rounded-xl hover:bg-white/[0.08] transition-all group">
              <div className="text-right">
                <p className="text-[9px] text-gray-600 leading-none">Get it on</p>
                <p className="text-sm font-bold text-white group-hover:text-[#D9B07C]">Google Play</p>
              </div>
              <FaGooglePlay className="text-xl text-white" />
            </a>
          </div>

          <div className="flex flex-col items-center lg:items-end gap-6 order-1 lg:order-2">
            {/* Socials */}
            <div className="flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className={`w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-500 transition-all hover:bg-white/[0.08] hover:-translate-y-1 hover:border-[#D9B07C]/30 ${social.color}`}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
            
            <p className="text-gray-700 text-[10px] md:text-[11px] font-medium tracking-wide text-center lg:text-right leading-loose">
              © {new Date().getFullYear()} CARMA TECHNOLOGIES. ALL RIGHTS RESERVED. 
              <span className="hidden sm:inline mx-3 text-white/5">|</span>
              <br className="sm:hidden" />
              <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
              <span className="mx-3 text-white/5">|</span>
              <a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
