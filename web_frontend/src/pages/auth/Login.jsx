import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "../../component/ui/Button";
import Input from "../../component/ui/Input";
import { HiOutlineLockClosed, HiOutlineEnvelope, HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { saveAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated - Commented out as per user request to access login page directly
  // React.useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/admin', { replace: true });
  //   }
  // }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await login({ email, password });

      // Save token & user data from the API response
      const token = data.token || data.data?.token;
      const user = data.user || data.data?.user || data.data;

      if (token) {
        saveAuth(token, user);
        navigate('/admin');
      } else {
        // If the API returned success but no token, show the message
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
    <div className="relative flex flex-col items-center justify-center font-sans select-none" dir="rtl">

      <div className="text-center mb-8">
        <h1 className="text-6xl font-black text-white italic tracking-tighter drop-shadow-md flip-animation">CarMA</h1>
        <p className="text-sm text-white/80 font-bold tracking-[0.2em] mt-2 mr-1 text-center">خدمة صيانة السيارات</p>
      </div>

      <div className="glass3d w-full max-w-[500px] rounded-[40px] overflow-hidden px-8 py-16 lg:px-12 lg:py-24 border border-white/30 shadow-[0_0_80px_0_rgba(0,0,0,0.5)]">
      <h2 className="text-3xl font-black text-white text-center mb-4 drop-shadow-sm">مرحباً Super Admin</h2>
      <p className="text-white/70 text-sm text-center mb-8 font-medium">سجل دخولك للوصول إلى حسابك</p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center font-medium">
          {error}
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit}>
        <Input
          label="البريد الإلكتروني"
          labelClassName="text-white/90"
          icon={<HiOutlineEnvelope className="text-slate-700" size={20} />}
          placeholder="example@mail.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <Input
            label="كلمة المرور"
            labelClassName="text-white/90"
            type={showPassword ? "text" : "password"}
            icon={<HiOutlineLockClosed className="text-slate-700" size={20} />}
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password.length > 0 && (
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-[45px] text-slate-700 transition-colors"
            >
              {showPassword ? <HiOutlineEye size={18} /> : <HiOutlineEyeSlash size={18} />}
            </button>
          )}
        </div>

        <div className="flex justify-between items-center px-1 text-xs">
          <label className="flex items-center gap-2 text-white/70 cursor-pointer font-medium">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-[#1D4ED8]" />
            تذكرني
          </label>
          {/* <a href="#" className="text-[#1D4ED8] font-bold hover:underline transition-all">نسيت كلمة المرور؟</a> */}
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="custom"
          className="w-full bg-white text-[#3b82f6] hover:bg-blue-600 hover:text-white h-14 rounded-2xl shadow-xl shadow-blue-900/20 text-lg font-bold mt-4 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-1"
        >
          {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </Button> 
      </form>
    </div>
    </div>
  );

};
