import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineLockClosed, 
  HiOutlineEnvelope, 
  HiOutlineEye, 
  HiOutlineEyeSlash, 
  HiOutlineCog6Tooth, 
  HiOutlineShieldCheck, 
  HiOutlineBolt 
} from "react-icons/hi2";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function LoginV2() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { saveAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await login({ email, password });
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user || data.data;

      if (token) {
        saveAuth(token, user);
        navigate('/admin');
      } else {
        setError(data.message || 'حدث خطأ أثناء تسجيل الدخول');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center font-tajawal select-none w-full" dir="rtl">

      {/* Branding */}
      <div className="text-center mb-8">
        <h1 className="text-7xl font-black text-white italic tracking-tighter drop-shadow-lg">
          Car<span className="text-[#D9B07C]">Ma</span>
        </h1>
        <p className="text-[10px] text-[#D9B07C] font-black tracking-[0.4em] mt-3 uppercase opacity-80">
          PREMIUM AUTO CARE
        </p>
      </div>

      {/* Feature Badges */}
      <div className="flex gap-8 mb-12">
        {[
          { icon: <HiOutlineCog6Tooth />, label: "فنيين\nخبراء" },
          { icon: <HiOutlineShieldCheck />, label: "جودة\nعالية" },
          { icon: <HiOutlineBolt />, label: "سريع\nوموثوق" }
        ].map((feature, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full border border-[#D9B07C]/30 flex items-center justify-center bg-[#D9B07C]/5 transition-all hover:border-[#D9B07C]/60">
              {React.cloneElement(feature.icon, { className: "text-[#D9B07C]", size: 26 })}
            </div>
            <span className="text-[10px] text-gray-400 font-bold text-center leading-tight whitespace-pre-line">
              {feature.label}
            </span>
          </div>
        ))}
      </div>

      {/* Glass Form Card */}
      <div className="w-full rounded-2xl overflow-hidden px-8 py-10 border border-white/5 bg-[#121212]/80 backdrop-blur-xl shadow-2xl">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-black text-white mb-2">مرحباً بعودتك</h2>
          <div className="w-8 h-[2px] bg-[#D9B07C] mx-auto"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-right font-bold">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 text-right mr-1 uppercase tracking-widest">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@carma.eg"
                className="w-full bg-white/5 border border-white/10 h-14 px-12 rounded-xl text-white text-sm focus:border-[#D9B07C]/50 focus:bg-white/[0.08] outline-none transition-all text-right"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <HiOutlineEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-gray-400 text-right mr-1 uppercase tracking-widest">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 h-14 px-12 rounded-xl text-white text-sm focus:border-[#D9B07C]/50 focus:bg-white/[0.08] outline-none transition-all text-right"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <HiOutlineLockClosed className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#D9B07C] transition-colors"
              >
                {showPassword ? <HiOutlineEye size={18} /> : <HiOutlineEyeSlash size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center px-1 text-[11px] font-bold text-gray-500">
            <label className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors">
              <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#D9B07C] focus:ring-0" />
              تذكرني
            </label>
            <a href="#" className="hover:text-[#D9B07C] transition-colors">نسيت كلمة المرور؟</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D9B07C] text-black h-14 rounded-xl text-base font-black transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 mt-4 shadow-lg shadow-[#D9B07C]/10"
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button> 
        </form>
      </div>
    </div>
  );
}
