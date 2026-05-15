import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  Globe,
  Moon,
  Shield
} from 'lucide-react';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import { getMySettings, updateSettings } from '../../../services/adminService';

// Custom Toggle Component
const Toggle = ({ enabled, onChange }) => (
  <div 
    onClick={() => onChange(!enabled)}
    className={`w-12 h-6 rounded-full p-0.5 cursor-pointer flex items-center transition-colors ${enabled ? 'bg-blue-600 justify-end' : 'bg-slate-600 justify-start'}`}
  >
    <div className="bg-white w-5 h-5 rounded-full shadow-sm" />
  </div>
);

const Settings = () => {
  // State for toggles
  const [appNotif, setAppNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);
  
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getMySettings();
        if (response.data) {
          setEmailNotif(response.data.emailNotifications);
          setSmsNotif(response.data.smsNotifications);
          setPromoNotif(response.data.promotionalOffers);
          setTwoFactor(response.data.twoFactorEnabled);
          setBiometric(response.data.biometricsEnabled);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("لم يتم العثور على إعدادات لهذا المستخدم. سيتم استخدام الإعدادات الافتراضية.");
        } else {
          console.error("Error fetching settings:", error);
        }
      }
    };
    fetchSettings();
  }, []);

  const handleSettingChange = async (key, newValue) => {
    if (key === 'appNotif') setAppNotif(newValue);
    if (key === 'emailNotifications') setEmailNotif(newValue);
    if (key === 'smsNotifications') setSmsNotif(newValue);
    if (key === 'promotionalOffers') setPromoNotif(newValue);
    if (key === 'twoFactorEnabled') setTwoFactor(newValue);
    if (key === 'biometricsEnabled') setBiometric(newValue);

    if (key !== 'appNotif') {
      const payload = {
        emailNotifications: key === 'emailNotifications' ? newValue : emailNotif,
        smsNotifications: key === 'smsNotifications' ? newValue : smsNotif,
        promotionalOffers: key === 'promotionalOffers' ? newValue : promoNotif,
        twoFactorEnabled: key === 'twoFactorEnabled' ? newValue : twoFactor,
        biometricsEnabled: key === 'biometricsEnabled' ? newValue : biometric,
      };

      try {
        await updateSettings(payload);
      } catch (error) {
        console.error("Error updating settings:", error);
      }
    }
  };

  return (
    <div className="font-tajawal min-h-screen pb-10">
      <DashboardHeader
        title="الإعدادات"
        subtitle="إدارة إعدادات الحساب والنظام"
      />

      <div className="max-w-4xl mx-auto space-y-8 mt-4" dir="rtl">
        
        {/* Notifications Settings */}
        <div className="bg-[#121212] rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Bell size={20} />
            </div>
            <h2 className="text-2xl font-black text-white">إعدادات الإشعارات</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div>
                <h4 className="text-sm font-black text-white mb-1">إشعارات التطبيق</h4>
                <p className="text-xs text-slate-500 font-bold">تلقي إشعارات داخل التطبيق</p>
              </div>
              <Toggle enabled={appNotif} onChange={(v) => handleSettingChange('appNotif', v)} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div>
                <h4 className="text-sm font-black text-white mb-1">إشعارات البريد الإلكتروني</h4>
                <p className="text-xs text-slate-500 font-bold">تلقي تحديثات عبر البريد</p>
              </div>
              <Toggle enabled={emailNotif} onChange={(v) => handleSettingChange('emailNotifications', v)} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div>
                <h4 className="text-sm font-black text-white mb-1">رسائل SMS</h4>
                <p className="text-xs text-slate-500 font-bold">تلقي تحديثات عبر الرسائل النصية</p>
              </div>
              <Toggle enabled={smsNotif} onChange={(v) => handleSettingChange('smsNotifications', v)} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors opacity-80">
              <div>
                <h4 className="text-sm font-black text-white mb-1">العروض الترويجية</h4>
                <p className="text-xs text-slate-500 font-bold">تلقي إشعارات حول العروض الخاصة</p>
              </div>
              <Toggle enabled={promoNotif} onChange={(v) => handleSettingChange('promotionalOffers', v)} />
            </div>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="bg-[#121212] rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Shield size={20} />
            </div>
            <h2 className="text-2xl font-black text-white">الأمان والخصوصية</h2>
          </div>

          <div className="space-y-8">
            {/* Password Change */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white">تغيير كلمة المرور</h4>
              
              <div className="relative">
                <input 
                  type={showCurrentPass ? "text" : "password"} 
                  placeholder="كلمة المرور الحالية" 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input 
                  type={showNewPass ? "text" : "password"} 
                  placeholder="كلمة المرور الجديدة" 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button onClick={() => setShowNewPass(!showNewPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input 
                  type={showConfirmPass ? "text" : "password"} 
                  placeholder="تأكيد كلمة المرور" 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-lg shadow-blue-900/20">
                تحديث كلمة المرور
              </button>
            </div>

            <div className="h-px bg-white/5 w-full"></div>

            {/* Extra Security */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <div>
                  <h4 className="text-sm font-black text-white mb-1">المصادقة الثنائية</h4>
                  <p className="text-xs text-slate-500 font-bold">طبقة أمان إضافية لحسابك</p>
                </div>
                <Toggle enabled={twoFactor} onChange={(v) => handleSettingChange('twoFactorEnabled', v)} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors opacity-80">
                <div>
                  <h4 className="text-sm font-black text-white mb-1">بصمة الوجه / البصمة</h4>
                  <p className="text-xs text-slate-500 font-bold">تسجيل الدخول السريع</p>
                </div>
                <Toggle enabled={biometric} onChange={(v) => handleSettingChange('biometricsEnabled', v)} />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#121212] rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Globe size={20} />
            </div>
            <h2 className="text-2xl font-black text-white">التفضيلات</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-white">اللغة</label>
              <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer">
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <Moon size={18} className="text-slate-400" />
                <div>
                  <h4 className="text-sm font-black text-white mb-1">الوضع الليلي</h4>
                  <p className="text-xs text-slate-500 font-bold">تفعيل الوضع الداكن</p>
                </div>
              </div>
              <Toggle enabled={darkMode} onChange={setDarkMode} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-white">موقعي الافتراضي</label>
              <input 
                type="text" 
                defaultValue="القاهرة، مدينة نصر، شارع عباس العقاد"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-[#121212] rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#D9B07C]/10 text-[#D9B07C] flex items-center justify-center">
              <CreditCard size={20} />
            </div>
            <h2 className="text-2xl font-black text-white">طرق الدفع</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-sm font-black text-white">Visa **** 4532</h4>
                    <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">افتراضية</span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold">تنتهي في 12/2026</p>
                </div>
              </div>
              <button className="text-red-400 text-sm font-bold hover:text-red-300 transition-colors">حذف</button>
            </div>

            <button className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-slate-400 text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/20 hover:text-white transition-all">
              <span>+ إضافة بطاقة جديدة</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 rounded-[2.5rem] p-8 border border-red-500/20 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-2xl font-black text-red-500">منطقة الخطر</h2>
          </div>

          <div className="space-y-4">
            <button className="w-full py-3 rounded-xl border border-red-500/50 text-red-500 font-bold text-sm hover:bg-red-500/10 transition-colors">
              تعطيل الحساب مؤقتاً
            </button>
            <button className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20">
              حذف الحساب نهائياً
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
