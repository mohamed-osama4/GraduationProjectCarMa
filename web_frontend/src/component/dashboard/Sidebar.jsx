import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  Bell, 
  BarChart2, 
  User, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const menuItems = [
    { name: 'الرئيسية', icon: Home, path: '/admin', end: true, color: 'text-blue-400' },
    { name: 'الطلبات', icon: FileText, path: '/admin/orders', color: 'text-emerald-400' },
    { name: 'الفنيون', icon: Users, path: '/admin/technicians', color: 'text-orange-400' },
    { name: 'الإشعارات', icon: Bell, path: '/admin/notifications', color: 'text-rose-400' },
    { name: 'التقارير', icon: BarChart2, path: '/admin/reports', color: 'text-purple-400' },
    { name: 'الملف الشخصي', icon: User, path: '/admin/profile', color: 'text-cyan-400' },
    { name: 'الإعدادات', icon: Settings, path: '/admin/settings', color: 'text-slate-400' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-primary-dark text-white transition-transform duration-300 transform font-tajawal 
      ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:static md:inset-auto h-screen flex flex-col`}>
      
      {/* Sidebar Header */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex flex-col">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-black tracking-tight">CarMa</h1>
          </Link>
          <p className="text-sm text-blue-300/80 font-medium mt-1">لوحة التحكم الإدارية</p>
        </div>
        <button onClick={onClose} className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors">
          <X size={28} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            onClick={() => window.innerWidth < 768 && onClose()}
            className={({ isActive }) => `
              flex items-center justify-between px-6 py-4 rounded-full transition-all duration-300
              ${isActive 
                ? 'bg-white text-[#172554] shadow-xl scale-[1.02]' 
                : 'text-white/60 hover:bg-white/10 hover:text-white'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-4">
                  <item.icon 
                    size={22} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={isActive ? 'text-[#172554]' : item.color}
                  />
                  <span className={`text-lg transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium opacity-90'}`}>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#ef4444] text-white text-[11px] font-black h-6 w-6 flex items-center justify-center rounded-full shadow-lg ring-2 ring-white/10">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer - Logout */}
      <div className="p-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-6 py-3 text-[#ff987d] hover:bg-white/5 rounded-full transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-lg font-bold">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
