import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Bell, ChevronDown, Menu, User, FileText, Loader2, X, AlertCircle, Clock, Zap, Check, Wallet, Tag, Users, CheckCircle, Settings } from 'lucide-react';
import { globalSearch, getNewNotifications, getAccountInfo, markAllNotificationsAsRead, getMenu } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';
import { useSignalREvent } from '../../context/SignalRContext';

// Notification type icon/color mapping (matches Notifications.jsx)
const getNotifTypeStyle = (typeVal) => {
  const t = (typeVal || '').toString().toLowerCase();
  if (t === '1' || t.includes('servicecompleted')) return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: CheckCircle };
  if (t === '2' || t.includes('technicianonway')) return { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: Users };
  if (t === '3' || t.includes('requestaccepted')) return { bg: 'bg-indigo-500/10', text: 'text-indigo-400', icon: Check };
  if (t === '4' || t.includes('walletcredit')) return { bg: 'bg-teal-500/10', text: 'text-teal-400', icon: Wallet };
  if (t === '5' || t.includes('appointment')) return { bg: 'bg-orange-500/10', text: 'text-orange-400', icon: Clock };
  if (t === '6' || t.includes('specialoffer')) return { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', icon: Tag };
  if (t === '7' || t.includes('system')) return { bg: 'bg-white/5', text: 'text-slate-400', icon: AlertCircle };
  return { bg: 'bg-white/5', text: 'text-slate-500', icon: Bell };
};

const DashboardHeader = ({ title, subtitle, onMenuClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], orders: [] });
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  
  // Toast state for new real-time notifications
  const [toast, setToast] = useState(null);
  
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const menuRef = useRef(null);
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
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch latest 5 notifications for popup + profile
  const fetchHeaderNotifications = useCallback(async () => {
    try {
      const res = await getNewNotifications({ page: 1, pageSize: 5 });
      if (res.data) {
        setNotifications(res.data.items || []);
        setUnreadCount(res.data.unreadCount ?? res.data.totalUnreadCounts ?? 0);
      }
    } catch (err) {
      console.error("Error fetching header notifications:", err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [, profileRes, menuRes] = await Promise.all([
          fetchHeaderNotifications(),
          getAccountInfo(),
          getMenu()
        ]);
        setProfile(profileRes.data);
        setMenuItems(menuRes.data || []);
      } catch (err) {
        console.error("Error fetching header data:", err);
      }
    };
    fetchData();
    // Poll notifications every 60 seconds as fallback
    const interval = setInterval(fetchHeaderNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchHeaderNotifications]);

  // ─── SignalR Real-time Updates ────────────────────────────────────────────

  // Show toast notification
  const showToastNotif = useCallback((notif) => {
    setToast(notif);
    setTimeout(() => setToast(null), 5000);
  }, []);

  // Handle new notification created
  const handleNotifCreated = useCallback((newNotif) => {
    console.log('[DashboardHeader] notification.created:', newNotif);
    setUnreadCount(prev => prev + 1);
    // Prepend to popup list, keep max 5
    setNotifications(prev => {
      if (prev.some(n => n.id === newNotif.id)) return prev;
      return [newNotif, ...prev].slice(0, 5);
    });
    showToastNotif(newNotif);
  }, [showToastNotif]);

  // Handle single notification read
  const handleNotifRead = useCallback((data) => {
    const notifId = data?.id;
    if (!notifId) return;
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Handle all notifications read
  const handleAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  // Handle order events (refresh data)
  const handleOrderEvent = useCallback(() => {
    fetchHeaderNotifications();
  }, [fetchHeaderNotifications]);

  useSignalREvent('notification.created', handleNotifCreated, []);
  useSignalREvent('notification.read', handleNotifRead, []);
  useSignalREvent('notifications.read_all', handleAllRead, []);
  useSignalREvent('OrderCreated', handleOrderEvent, []);
  useSignalREvent('OrderUpdated', handleOrderEvent, []);

  // ─── End SignalR ──────────────────────────────────────────────────────────

  // Mark all as read from popup
  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

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
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} د`;
      if (diffHours < 24) return `منذ ${diffHours} س`;
      return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const getInitials = (name) => {
    if (!name || name === 'string') return 'مد';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="flex flex-col font-tajawal relative z-50 mb-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-4 z-[100] animate-slide-in-left">
          <div className="bg-[#121212] rounded-2xl shadow-2xl border border-white/5 p-4 max-w-sm flex gap-3 items-start backdrop-blur-xl">
            <div className="h-10 w-10 rounded-xl bg-[#D9B07C]/10 text-[#D9B07C] flex items-center justify-center shrink-0">
              <Zap size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">{toast.title}</p>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast(null)} 
              className="text-slate-500 hover:text-white transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between h-16">
        {/* Right Section: Mobile Toggle + Title */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex flex-col text-right">
            <h1 className="text-xl sm:text-2xl font-black text-white">{title}</h1>
            {subtitle && <p className="hidden sm:block text-[#D9B07C] text-[10px] font-bold uppercase tracking-wider opacity-80">{subtitle}</p>}
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
              className="w-full bg-[#121212] border border-white/5 rounded-2xl py-3 px-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D9B07C]/20 focus:border-[#D9B07C]/30 transition-all pr-12 text-right shadow-xl"
            />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
            {loading && <Loader2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D9B07C] animate-spin" />}
            {query && !loading && (
              <X 
                size={18} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 cursor-pointer hover:text-white" 
                onClick={() => setQuery('')}
              />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#121212] rounded-[2rem] shadow-2xl border border-white/5 max-h-[400px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-right backdrop-blur-xl">
              <div className="p-4">
                {/* Orders Section */}
                {results.orders?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-[10px] font-black text-[#D9B07C] uppercase tracking-wider mb-2 px-2">الطلبات</h3>
                    {results.orders.map((order) => (
                      <div 
                        key={order.id} 
                        onClick={() => handleResultClick('order', order.id)}
                        className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-2xl cursor-pointer transition-colors group justify-end"
                      >
                        <div className="flex flex-col items-end">
                          <p className="text-sm font-bold text-white">طلب #{order.id}</p>
                          <p className="text-xs text-slate-500">{order.serviceName || "خدمة غير محددة"}</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-[#D9B07C] group-hover:bg-[#D9B07C] group-hover:text-black transition-colors">
                          <FileText size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Users Section */}
                {results.users?.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black text-[#D9B07C] uppercase tracking-wider mb-2 px-2">المستخدمين</h3>
                    {results.users.map((user) => (
                      <div 
                        key={user.id} 
                        onClick={() => handleResultClick('user', user.id)}
                        className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-2xl cursor-pointer transition-colors group justify-end"
                      >
                        <span className="text-[10px] font-black px-2 py-1 bg-white/5 text-slate-400 rounded-lg uppercase mr-auto">
                          {user.type === 'technician' ? 'فني' : 'عميل'}
                        </span>
                        <div className="flex flex-col items-end">
                          <p className="text-sm font-bold text-white">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-[#D9B07C] group-hover:bg-[#D9B07C] group-hover:text-black transition-colors">
                          <User size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.users?.length === 0 && results.orders?.length === 0 && (
                  <div className="py-8 text-center">
                    <Search size={32} className="mx-auto text-white/10 mb-2" />
                    <p className="text-slate-500 font-bold">لا توجد نتائج تطابق بحثك</p>
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
              className={`relative cursor-pointer p-2 rounded-full transition-all ${showNotifications ? 'bg-[#D9B07C]/10 text-[#D9B07C]' : 'hover:bg-white/5 text-slate-400'}`}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-[#D9B07C] rounded-full border-2 border-[#0A0A0A] text-[9px] font-black text-black flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>

            {showNotifications && (
              <div className="absolute top-full left-0 mt-3 w-[380px] bg-[#121212] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-right backdrop-blur-xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <button 
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                    className={`text-xs font-bold transition-colors ${unreadCount > 0 ? 'text-[#D9B07C] hover:underline' : 'text-slate-600 cursor-not-allowed'}`}
                  >
                    تحديد الكل كمقروء
                  </button>
                  <h3 className="text-lg font-black text-white">التنبيهات</h3>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => {
                      const typeStyle = getNotifTypeStyle(notif.type);
                      const TypeIcon = typeStyle.icon;
                      return (
                        <div 
                          key={notif.id}
                          className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-[#D9B07C]/5' : ''}`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1 gap-2">
                              <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1 shrink-0">
                                {formatNotificationTime(notif.createdAt)}
                                <Clock size={10} />
                              </span>
                              <h4 className="text-sm font-black text-white truncate">{notif.title}</h4>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{notif.message}</p>
                          </div>
                          <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${typeStyle.bg} ${typeStyle.text}`}>
                            <TypeIcon size={18} />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center">
                      <Bell size={48} className="mx-auto text-white/5 mb-4" />
                      <p className="text-slate-500 font-bold">لا توجد تنبيهات جديدة</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white/5 text-center border-t border-white/5">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/admin/notifications');
                    }}
                    className="text-xs font-black text-[#D9B07C] hover:underline transition-colors"
                  >
                    عرض جميع الإشعارات
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={menuRef}>
            <div 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <ChevronDown size={18} className={`text-slate-500 transition-transform duration-300 ${showMenu ? 'rotate-180 text-[#D9B07C]' : ''}`} />
              <div className="flex flex-col items-end text-right">
                <span className="text-sm font-bold text-white">
                  {profile?.name && profile.name !== 'string' ? profile.name : 'مدير النظام'}
                </span>
                <span className="text-[10px] text-[#D9B07C] font-black uppercase tracking-wider">
                  {profile?.role === 'admin' ? 'مدير العمليات' : profile?.role || 'مشرف'}
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#D9B07C] flex items-center justify-center text-black font-black text-sm shadow-xl shadow-[#D9B07C]/10 overflow-hidden border border-white/5 shrink-0">
                {profile?.profileImageUrl ? (
                  <img 
                    src={profile.profileImageUrl} 
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(profile?.name)
                )}
              </div>
            </div>

            {showMenu && (
              <div className="absolute top-full left-0 mt-3 w-56 bg-[#121212] rounded-2xl shadow-2xl border border-white/5 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-right backdrop-blur-xl py-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setShowMenu(false);
                      navigate(item.route);
                    }}
                    className="w-full px-4 py-3 text-sm font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-300 flex items-center justify-between gap-3 text-right group"
                    dir="rtl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-1.5 rounded-lg bg-white/5 text-slate-400 group-hover:bg-[#D9B07C]/10 group-hover:text-[#D9B07C] transition-all">
                        {item.route.includes('profile') ? <User size={16} /> : <Settings size={16} />}
                      </span>
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown size={14} className="text-slate-600 group-hover:text-slate-300 -rotate-90" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
