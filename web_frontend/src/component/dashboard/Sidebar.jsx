import React, { useState, useCallback } from 'react';
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
  X,
  Warehouse
} from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useSignalREvent } from "../../context/SignalRContext";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Real-time notification badge count
  const [liveNotifCount, setLiveNotifCount] = useState(0);

  // Listen for new notifications to increment badge
  const handleNewNotification = useCallback(() => {
    setLiveNotifCount(prev => prev + 1);
  }, []);

  // Reset badge when notifications are read
  const handleAllRead = useCallback(() => {
    setLiveNotifCount(0);
  }, []);

  useSignalREvent('notification.created', handleNewNotification, []);
  useSignalREvent('notifications.read_all', handleAllRead, []);

  const menuItems = [
    { name: 'الرئيسية', icon: Home, path: '/admin', end: true, color: 'text-[#D9B07C]' },
    { name: 'الطلبات', icon: FileText, path: '/admin/orders', color: 'text-emerald-400' },
    // { name: 'الفنيين', icon: Users, path: '/admin/technicians', color: 'text-amber-400' },
    { name: 'الورش', icon: Warehouse, path: '/admin/workshops', color: 'text-amber-400' },
    { name: 'الإشعارات', icon: Bell, path: '/admin/notifications', color: 'text-rose-400', badge: liveNotifCount > 0 ? liveNotifCount : undefined },
    { name: 'التقارير', icon: BarChart2, path: '/admin/reports', color: 'text-indigo-400' },
    { name: 'الملف الشخصي', icon: User, path: '/admin/profile', color: 'text-cyan-400' },
    { name: 'الإعدادات', icon: Settings, path: '/admin/settings', color: 'text-slate-400' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Reset badge when clicking on notifications link
  const handleNavClick = (item) => {
    if (item.path === '/admin/notifications') {
      setLiveNotifCount(0);
    }
    if (window.innerWidth < 768) onClose();
  };

  return (
    <aside className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#121212] text-white transition-transform duration-300 transform font-tajawal border-l border-white/5
      ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:static md:inset-auto h-screen flex flex-col`}>
      
      {/* Sidebar Header */}
      <div className="p-8 flex items-center justify-between">
        <div className="flex flex-col">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-black tracking-tighter italic text-white">
              Car<span className="text-[#D9B07C]">Ma</span>
            </h1>
          </Link>
          <p className="text-xs text-slate-500 font-medium mt-1">لوحة التحكم الإدارية</p>
        </div>
        <button onClick={onClose} className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors">
          <X size={28} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            onClick={() => handleNavClick(item)}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive 
                ? 'bg-[#D9B07C]/10 text-[#D9B07C] shadow-lg shadow-black/20 border border-[#D9B07C]/20' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-4">
                  <item.icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={isActive ? 'text-[#D9B07C]' : `${item.color} opacity-80 group-hover:opacity-100 group-hover:text-white transition-all`}
                  />
                  <span className={`text-base transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="bg-[#D9B07C] text-black text-[10px] font-black h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full shadow-lg">
                    {item.badge > 99 ? '99+' : item.badge}
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
          className="flex items-center gap-4 w-full px-6 py-3 text-red-400/80 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-300 group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-base font-bold">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
