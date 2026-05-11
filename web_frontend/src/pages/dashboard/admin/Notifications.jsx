import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Bell, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  Search,
  Briefcase,
  Users,
  Check,
  Loader2,
  Wallet,
  Tag,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import StatCard from '../../../component/dashboard/StatCard';
import { getNewNotifications, getUnreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } from '../../../services/adminService';
import { useSignalREvent } from '../../../context/SignalRContext';

// Updated mappings to match NewNotificationType enum from backend
const TYPE_MAP = {
  all: undefined,
  serviceCompleted: 1,
  technicianOnWay: 2,
  requestAccepted: 3,
  walletCreditAdded: 4,
  appointmentReminder: 5,
  specialOffer: 6,
  system: 7,
};

const typeFiltersList = [
  { id: 'all', label: 'الكل' },
  { id: 'serviceCompleted', label: 'اكتمال الخدمة' },
  { id: 'technicianOnWay', label: 'فني في الطريق' },
  { id: 'requestAccepted', label: 'مقبولة' },
  { id: 'walletCreditAdded', label: 'رصيد محفظة' },
  { id: 'appointmentReminder', label: 'تذكير موعد' },
  { id: 'specialOffer', label: 'عروض' },
  { id: 'system', label: 'نظام' },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Counts
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const pageSize = 10;

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, urgent, order, warning, success
  const [statusFilter, setStatusFilter] = useState('all'); // all, unread, read
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  
  // To handle marking as read loading state
  const [actionLoading, setActionLoading] = useState(false);

  // Real-time flash animation state
  const [flashingIds, setFlashingIds] = useState(new Set());

  useEffect(() => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('ar-EG', options));
  }, []);

  const handleTypeChange = (id) => {
    setTypeFilter(id);
    setPage(1);
  };

  const handleStatusChange = (id) => {
    setStatusFilter(id);
    setPage(1);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Notifications List
      const params = {
        page,
        pageSize,
      };
      
      // Apply type filter
      if (typeFilter !== 'all') {
        params.type = TYPE_MAP[typeFilter];
      }
      
      // Apply status filter
      if (statusFilter === 'read') params.isRead = true;
      if (statusFilter === 'unread') params.isRead = false;

      const res = await getNewNotifications(params);
      
      if (res.data) {
        setNotifications(res.data.items || []);
        setTotalCount(res.data.totalAllCounts || 0);
        setTotalPages(res.data.totalPages || 1);
        // Sometimes backend includes unreadCount in the list response
        if (res.data.unreadCount !== undefined) {
          setUnreadCount(res.data.unreadCount);
        }
      }

      // If backend didn't return unreadCount, fetch it explicitly
      if (res.data && res.data.unreadCount === undefined) {
        const countRes = await getUnreadNotificationsCount();
        if (countRes.data) {
          // If the API returns just a number or { count: number }
          setUnreadCount(typeof countRes.data === 'number' ? countRes.data : countRes.data.count || 0);
        }
      }

    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, typeFilter, statusFilter]); // Re-fetch when these change

  // ─── SignalR Real-time Event Handlers ───────────────────────────────────────

  // Handle "notification.created" - new notification arrived
  const handleNotificationCreated = useCallback((newNotif) => {
    console.log('[SignalR] notification.created:', newNotif);

    // Update global counts
    setTotalCount(prev => prev + 1);
    setUnreadCount(prev => prev + 1);

    // If user is on page 1, and the notification matches the active filter, prepend it
    if (page === 1) {
      const matchesTypeFilter = typeFilter === 'all' || 
        (TYPE_MAP[typeFilter] !== undefined && 
          newNotif.type?.toString().toLowerCase() === typeFilter.toLowerCase());
      
      const matchesStatusFilter = statusFilter === 'all' || statusFilter === 'unread';

      if (matchesTypeFilter && matchesStatusFilter) {
        setNotifications(prev => {
          // Avoid duplicates
          if (prev.some(n => n.id === newNotif.id)) return prev;
          // Prepend and trim to pageSize
          const updated = [newNotif, ...prev];
          return updated.slice(0, pageSize);
        });

        // Add flash animation
        setFlashingIds(prev => new Set(prev).add(newNotif.id));
        setTimeout(() => {
          setFlashingIds(prev => {
            const next = new Set(prev);
            next.delete(newNotif.id);
            return next;
          });
        }, 2000);
      }
    }
  }, [page, typeFilter, statusFilter, pageSize]);

  // Handle "notification.read" - single notification marked as read
  const handleNotificationRead = useCallback((data) => {
    console.log('[SignalR] notification.read:', data);
    const notifId = data?.id;
    if (!notifId) return;

    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Handle "notifications.read_all" - all notifications marked as read
  const handleAllRead = useCallback(() => {
    console.log('[SignalR] notifications.read_all');
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
    setUnreadCount(0);
  }, []);

  // Handle "notification.deleted" - notification was deleted
  const handleNotificationDeleted = useCallback((data) => {
    console.log('[SignalR] notification.deleted:', data);
    const notifId = data?.id;
    if (!notifId) return;

    setNotifications(prev => prev.filter(n => n.id !== notifId));
    setTotalCount(prev => Math.max(0, prev - 1));
  }, []);

  // Subscribe to SignalR events
  useSignalREvent('notification.created', handleNotificationCreated, [page, typeFilter, statusFilter]);
  useSignalREvent('notification.read', handleNotificationRead, []);
  useSignalREvent('notifications.read_all', handleAllRead, []);
  useSignalREvent('notification.deleted', handleNotificationDeleted, []);

  // ─── End SignalR Handlers ──────────────────────────────────────────────────

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(filteredNotifications.map(n => n.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleMarkAsRead = async () => {
    setActionLoading(true);
    
    // Optimistic update: update UI immediately
    if (selectedItems.length > 0) {
      setNotifications(prev => prev.map(n => 
        selectedItems.includes(n.id) ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - selectedItems.length));
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }

    try {
      if (selectedItems.length > 0) {
        await Promise.all(selectedItems.map(id => markNotificationAsRead(id)));
      } else {
        await markAllNotificationsAsRead();
      }
    } catch (error) {
      // PATCH requests may fail due to backend CORS preflight issues
      // The optimistic update already applied, so we just log the error
      console.warn("Mark as read API call failed (possible CORS issue):", error.message);
    } finally {
      setSelectedItems([]);
      setActionLoading(false);
      // Refresh data from server to sync state
      fetchData();
    }
  };

  // Client-side search (since API doesn't seem to have a keyword search param in Swagger)
  // If API supports it later, we can move this to `params.keyword` in `fetchData`
  const filteredNotifications = notifications.filter(n => {
    if (!searchQuery) return true;
    const titleMatch = (n.title || '').includes(searchQuery);
    const descMatch = (n.message || '').includes(searchQuery);
    return titleMatch || descMatch;
  });

  // Calculate Stats using real counts
  const stats = [
    {
      title: 'إجمالي الإشعارات',
      value: totalCount.toString(),
      icon: Bell,
      iconBg: 'bg-indigo-500/10',
      iconColor: 'text-indigo-400',
    },
    {
      title: 'غير مقروءة',
      value: unreadCount.toString(),
      icon: AlertCircle,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-400',
    },
    {
      title: 'عاجلة',
      value: '-', // Needs API support to get specific count
      icon: Clock,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
    },
    {
      title: 'مقروءة',
      value: (totalCount > 0 && unreadCount >= 0) ? (totalCount - unreadCount).toString() : '-',
      icon: CheckCircle,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-400',
    }
  ];

  const getTypeStyles = (typeVal, severityStr) => {
    const t = (typeVal || '').toString().toLowerCase();
    const s = (severityStr || '').toString().toLowerCase();
    
    // Check by exact backend Enum ID or String
    if (t === '1' || t.includes('servicecompleted')) {
      return { badgeBg: 'bg-emerald-500/10 text-emerald-400', iconBg: 'bg-emerald-500/10 text-emerald-400', icon: CheckCircle, label: 'مكتملة' };
    }
    if (t === '2' || t.includes('technicianonway')) {
      return { badgeBg: 'bg-blue-500/10 text-blue-400', iconBg: 'bg-blue-500/10 text-blue-400', icon: Users, label: 'فني' };
    }
    if (t === '3' || t.includes('requestaccepted')) {
      return { badgeBg: 'bg-indigo-500/10 text-indigo-400', iconBg: 'bg-indigo-500/10 text-indigo-400', icon: Check, label: 'مقبول' };
    }
    if (t === '4' || t.includes('walletcredit')) {
      return { badgeBg: 'bg-teal-500/10 text-teal-400', iconBg: 'bg-teal-500/10 text-teal-400', icon: Wallet, label: 'رصيد' };
    }
    if (t === '5' || t.includes('appointment')) {
      return { badgeBg: 'bg-orange-500/10 text-orange-400', iconBg: 'bg-orange-500/10 text-orange-400', icon: Clock, label: 'موعد' };
    }
    if (t === '6' || t.includes('specialoffer')) {
      return { badgeBg: 'bg-fuchsia-500/10 text-fuchsia-400', iconBg: 'bg-fuchsia-500/10 text-fuchsia-400', icon: Tag, label: 'عرض' };
    }
    if (t === '7' || t.includes('system')) {
      return { badgeBg: 'bg-white/5 text-slate-400', iconBg: 'bg-white/5 text-slate-400', icon: AlertCircle, label: 'نظام' };
    }
    
    // Fallback using severity if type doesn't match
    if (s === '4' || s.includes('error')) {
      return { badgeBg: 'bg-red-500/10 text-red-400', iconBg: 'bg-red-500/10 text-red-400', icon: AlertCircle, label: 'عاجل' };
    }
    if (s === '1' || s.includes('success')) {
      return { badgeBg: 'bg-emerald-500/10 text-emerald-400', iconBg: 'bg-emerald-500/10 text-emerald-400', icon: Check, label: 'نجاح' };
    }
    if (s === '3' || s.includes('warning')) {
      return { badgeBg: 'bg-amber-500/10 text-amber-400', iconBg: 'bg-amber-500/10 text-amber-400', icon: AlertCircle, label: 'تحذير' };
    }

    return { badgeBg: 'bg-white/5 text-slate-400', iconBg: 'bg-white/5 text-slate-400', icon: Bell, label: 'إشعار' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      if (diffDays === 1) return `منذ يوم واحد`;
      if (diffDays === 2) return `منذ يومين`;
      return `منذ ${diffDays} أيام`;
    } catch {
      return dateString;
    }
  };



  return (
    <div className="font-tajawal space-y-6 max-w-7xl mx-auto pb-10">
      <DashboardHeader
        title="الإشعارات"
        subtitle={currentDate}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-[#121212] rounded-[2.5rem] shadow-2xl border border-white/5 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9B07C]/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-[#121212]/60 z-10 flex items-center justify-center rounded-3xl backdrop-blur-[2px]">
            <Loader2 className="animate-spin text-[#D9B07C]" size={48} />
          </div>
        )}

        {/* Search */}
        <div className="relative mb-8 group z-10">
          <input 
            type="text" 
            placeholder="ابحث في الإشعارات (محلياً)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-white/10 rounded-2xl py-4 pr-14 pl-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#D9B07C]/10 focus:border-[#D9B07C]/30 transition-all text-white placeholder-slate-500 focus:bg-[#1a1a1a]"
          />
          <Search size={22} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#D9B07C] transition-colors" />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-8 mb-8 text-sm relative z-10">
          
          <div className="flex flex-col gap-3">
            <span className="text-[#D9B07C] font-black uppercase tracking-widest text-[10px]">نوع الإشعار</span>
            <div className="flex flex-wrap items-center gap-2">
              {typeFiltersList.map(filter => (
                <button 
                  key={filter.id}
                  onClick={() => handleTypeChange(filter.id)}
                  className={`px-5 py-2.5 rounded-full font-black text-xs transition-all duration-300 ${typeFilter === filter.id ? 'bg-[#D9B07C] text-black shadow-lg shadow-[#D9B07C]/20 scale-105' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[#D9B07C] font-black uppercase tracking-widest text-[10px]">الحالة</span>
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => handleStatusChange('all')}
                className={`px-6 py-2.5 rounded-full font-black text-xs transition-all duration-300 ${statusFilter === 'all' ? 'bg-white/10 text-white border border-white/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'}`}
              >
                الكل
              </button>
              <button 
                onClick={() => handleStatusChange('unread')}
                className={`px-6 py-2.5 rounded-full font-black text-xs transition-all duration-300 ${statusFilter === 'unread' ? 'bg-[#D9B07C] text-black shadow-lg shadow-[#D9B07C]/20 scale-105' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'}`}
              >
                غير مقروءة
              </button>
              <button 
                onClick={() => handleStatusChange('read')}
                className={`px-6 py-2.5 rounded-full font-black text-xs transition-all duration-300 ${statusFilter === 'read' ? 'bg-white/10 text-white border border-white/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'}`}
              >
                مقروءة
              </button>
            </div>
          </div>
        </div>

        {/* List Header */}
        <div className="flex items-center justify-between py-5 border-b border-white/5 mb-4 relative z-10">
          <label className="flex items-center gap-3 cursor-pointer group/label">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded-lg text-[#D9B07C] border-white/10 focus:ring-[#D9B07C] focus:ring-offset-0 bg-white/5 cursor-pointer transition-all group-hover/label:border-[#D9B07C]/50"
              checked={selectedItems.length === filteredNotifications.length && filteredNotifications.length > 0}
              onChange={handleSelectAll}
            />
            <span className="font-black text-slate-400 text-xs uppercase tracking-widest group-hover/label:text-white transition-colors">تحديد الكل</span>
          </label>
          
          <button 
            onClick={handleMarkAsRead}
            disabled={actionLoading || (selectedItems.length === 0 && unreadCount === 0)}
            className={`text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${!actionLoading && (selectedItems.length > 0 || unreadCount > 0) ? 'text-[#D9B07C] hover:scale-105 active:scale-95' : 'text-slate-600 cursor-not-allowed'}`}
          >
            {actionLoading && <Loader2 size={14} className="animate-spin" />}
            {selectedItems.length > 0 ? "تحديد كمقروءة" : "تحديد الكل كمقروءة"}
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 relative z-10">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const styles = getTypeStyles(notif.type, notif.severity);
              const isSelected = selectedItems.includes(notif.id);
              const isFlashing = flashingIds.has(notif.id);
              
              return (
                <div 
                  key={notif.id} 
                  className={`flex flex-col md:flex-row gap-6 p-6 rounded-[2rem] transition-all border border-white/5 hover:border-white/10 hover:bg-white/[0.04] ${!notif.isRead ? 'bg-white/[0.02]' : ''} ${isFlashing ? 'animate-notification-flash ring-2 ring-[#D9B07C]/30 bg-[#D9B07C]/5' : ''}`}
                >
                  {/* Right side: Checkbox, Icon, Content */}
                  <div className="flex items-start gap-5 flex-1">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded-lg text-[#D9B07C] border-white/10 focus:ring-[#D9B07C] focus:ring-offset-0 mt-3 cursor-pointer bg-white/5"
                      checked={isSelected}
                      onChange={() => handleSelectItem(notif.id)}
                    />
                    
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${styles.iconBg}`}>
                      <styles.icon size={24} />
                    </div>
 
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-3">{formatDate(notif.createdAt)}</span>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${styles.badgeBg}`}>
                          {styles.label}
                        </span>
                        {!notif.isRead && (
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                        )}
                        {isFlashing && (
                          <span className="flex items-center gap-1 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest bg-[#D9B07C]/10 text-[#D9B07C]">
                            <Zap size={12} />
                            جديد
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-black text-white">{notif.title}</h4>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-4xl">{notif.message}</p>
                    </div>
                  </div>
 
                  {/* Left side: Action Button */}
                  {notif.primaryAction && (
                    <div className="flex items-center justify-start md:justify-end mt-4 md:mt-0 pr-16 md:pr-0">
                      <a 
                        href={notif.primaryAction.url} 
                        className="text-sm font-black text-[#D9B07C] hover:underline uppercase tracking-widest"
                        onClick={(e) => {
                          if(notif.primaryAction.url === 'string' || !notif.primaryAction.url) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {notif.primaryAction.label}
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] mt-4">
              <Bell size={64} className="mx-auto text-white/5 mb-4" />
              <p className="text-slate-500 font-black">لا توجد إشعارات تطابق بحثك</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 border-t border-white/5 gap-4 relative z-10">
            {/* Next */}
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-black text-slate-400 hover:bg-white/5 hover:text-white rounded-2xl transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
            >
              <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
              <span className="uppercase tracking-widest">التالي</span>
            </button>
 
            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-11 w-11 rounded-2xl text-sm font-black transition-all duration-300
                    ${page === p
                      ? 'bg-[#D9B07C] text-black shadow-lg shadow-[#D9B07C]/20 scale-110'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
 
            {/* Previous */}
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-black text-slate-400 hover:bg-white/5 hover:text-white rounded-2xl transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
            >
              <span className="uppercase tracking-widest">السابق</span>
              <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
 
        {/* Results Count */}
        <div className="px-8 py-4 bg-white/[0.02] text-center border-t border-white/5 rounded-b-[2.5rem] -mx-8 -mb-8 mt-2 relative z-10">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
            عرض {totalCount > 0 ? ((page - 1) * pageSize) + 1 : 0} - {Math.min(page * pageSize, totalCount)} من أصل {totalCount} إشعار
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
