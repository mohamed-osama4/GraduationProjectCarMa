import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, Menu, User, FileText, Loader2, X, AlertCircle, Clock } from 'lucide-react';
import { globalSearch, getAdminNotifications, getAccountInfo } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ title, subtitle, onMenuClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], orders: [] });
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Notifications & Profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notifRes, profileRes] = await Promise.all([
          getAdminNotifications(),
          getAccountInfo()
        ]);
        setNotifications(notifRes.data || []);
        setUnreadCount(notifRes.data?.filter(n => !n.isRead).length || 0);
        setProfile(profileRes.data);
      } catch (err) {
        console.error("Error fetching header data:", err);
      }
    };
    fetchData();
    // Poll notifications every 60 seconds
    const interval = setInterval(async () => {
      try {
        const response = await getAdminNotifications();
        setNotifications(response.data || []);
        setUnreadCount(response.data?.filter(n => !n.isRead).length || 0);
      } catch (err) {
        console.error("Notifications poll error:", err);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 3) {
        try {
          setLoading(true);
          const response = await globalSearch(query);
          setResults(response.data);
          setShowResults(true);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults({ users: [], orders: [] });
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = (type, id) => {
    setShowResults(false);
    setQuery('');
    if (type === 'order') {
      navigate(`/admin/orders?id=${id}`);
    } else {
      console.log("Clicked user:", id);
    }
  };

  const formatNotificationTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    if (!name || name === 'string') return 'مد';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="flex flex-col font-tajawal relative z-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between h-16">
        {/* Right Section: Mobile Toggle + Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-600"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex flex-col text-right">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">{title}</h1>
            {subtitle && <p className="hidden sm:block text-slate-500 text-[10px] font-medium">{subtitle}</p>}
          </div>
        </div>

        {/* Search Bar (Center) */}
        <div className="flex-1 max-w-2xl mx-12 relative" ref={searchRef}>
          <div className="relative">
            <input 
              type="text" 
              placeholder="بحث في الطلبات، العملاء، الفنيين..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 3 && setShowResults(true)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12 text-right"
            />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            {loading && <Loader2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary animate-spin" />}
            {query && !loading && (
              <X 
                size={18} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600" 
                onClick={() => setQuery('')}
              />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-h-[400px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-right">
              <div className="p-4">
                {/* Orders Section */}
                {results.orders?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 px-2">الطلبات</h3>
                    {results.orders.map((order) => (
                      <div 
                        key={order.id} 
                        onClick={() => handleResultClick('order', order.id)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group justify-end"
                      >
                        <div className="flex flex-col items-end">
                          <p className="text-sm font-bold text-slate-800">طلب #{order.id}</p>
                          <p className="text-xs text-slate-500">{order.serviceName || "خدمة غير محددة"}</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <FileText size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Users Section */}
                {results.users?.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 px-2">المستخدمين</h3>
                    {results.users.map((user) => (
                      <div 
                        key={user.id} 
                        onClick={() => handleResultClick('user', user.id)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group justify-end"
                      >
                        <span className="text-[10px] font-black px-2 py-1 bg-gray-100 text-slate-500 rounded-lg uppercase mr-auto">
                          {user.type === 'technician' ? 'فني' : 'عميل'}
                        </span>
                        <div className="flex flex-col items-end">
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                          <User size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.users?.length === 0 && results.orders?.length === 0 && (
                  <div className="py-8 text-center">
                    <Search size={32} className="mx-auto text-slate-200 mb-2" />
                    <p className="text-slate-400 font-bold">لا توجد نتائج تطابق بحثك</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Notifications */}
        <div className="flex items-center gap-6">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <div 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative cursor-pointer p-2 rounded-full transition-all ${showNotifications ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-slate-600'}`}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-4 w-4 bg-red-500 rounded-full border-2 border-white text-[9px] font-black text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>

            {showNotifications && (
              <div className="absolute top-full left-0 mt-3 w-[380px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-right">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <button className="text-xs font-bold text-primary hover:underline">تحديد الكل كمقروء</button>
                  <h3 className="text-lg font-black text-slate-800">التنبيهات</h3>
                </div>

                <div className="max-h-[450px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-4 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                              {formatNotificationTime(notif.createdAt)}
                              <Clock size={10} />
                            </span>
                            <h4 className="text-sm font-black text-slate-800">{notif.title}</h4>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                        </div>
                        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          notif.type === 'order' ? 'bg-blue-100 text-blue-600' : 
                          notif.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-slate-500'
                        }`}>
                          {notif.type === 'order' ? <FileText size={18} /> : <AlertCircle size={18} />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <Bell size={48} className="mx-auto text-slate-100 mb-4" />
                      <p className="text-slate-400 font-bold">لا توجد تنبيهات جديدة</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gray-50 text-center">
                  <button className="text-xs font-black text-slate-500 hover:text-primary transition-colors">عرض جميع التنبيهات</button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <ChevronDown size={18} className="text-slate-400" />
            <div className="flex flex-col items-end text-right">
              <span className="text-sm font-bold text-slate-900">
                {profile?.name && profile.name !== 'string' ? profile.name : 'مدير النظام'}
              </span>
              <span className="text-xs text-slate-500 capitalize">
                {profile?.role === 'admin' ? 'مدير العمليات' : profile?.role || 'مشرف'}
              </span>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200">
              {getInitials(profile?.name)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
