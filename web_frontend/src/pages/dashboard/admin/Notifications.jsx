import React, { useState, useEffect } from 'react';
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
  Wrench
} from 'lucide-react';
import DashboardHeader from '../../../component/dashboard/DashboardHeader';
import StatCard from '../../../component/dashboard/StatCard';
import { getNewNotifications, getUnreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } from '../../../services/adminService';

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

  useEffect(() => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('ar-EG', options));
  }, []);

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
        setTotalCount(res.data.totalCount || 0);
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
    try {
      if (selectedItems.length > 0) {
        // Mark only selected
        await Promise.all(selectedItems.map(id => markNotificationAsRead(id)));
      } else {
        // Mark all as read using the bulk endpoint
        await markAllNotificationsAsRead();
      }
      
      // Clear selection and refresh data
      setSelectedItems([]);
      fetchData();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      alert("حدث خطأ أثناء تحديث الإشعارات.");
    } finally {
      setActionLoading(false);
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
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'غير مقروءة',
      value: unreadCount.toString(),
      icon: AlertCircle,
      iconBg: 'bg-red-100 text-red-600',
    },
    {
      title: 'عاجلة',
      value: '-', // Needs API support to get specific count
      icon: Clock,
      iconBg: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'مقروءة',
      value: (totalCount > 0 && unreadCount >= 0) ? (totalCount - unreadCount).toString() : '-',
      icon: CheckCircle,
      iconBg: 'bg-green-100 text-green-600',
    }
  ];

  const getTypeStyles = (typeVal, severityStr) => {
    const t = (typeVal || '').toString().toLowerCase();
    const s = (severityStr || '').toString().toLowerCase();
    
    // Check by exact backend Enum ID or String
    if (t === '1' || t.includes('servicecompleted')) {
      return { badgeBg: 'bg-emerald-100 text-emerald-600', iconBg: 'bg-emerald-50 text-emerald-500', icon: CheckCircle, label: 'مكتملة' };
    }
    if (t === '2' || t.includes('technicianonway')) {
      return { badgeBg: 'bg-blue-100 text-blue-600', iconBg: 'bg-blue-50 text-blue-500', icon: Users, label: 'فني' };
    }
    if (t === '3' || t.includes('requestaccepted')) {
      return { badgeBg: 'bg-indigo-100 text-indigo-600', iconBg: 'bg-indigo-50 text-indigo-500', icon: Check, label: 'مقبول' };
    }
    if (t === '4' || t.includes('walletcredit')) {
      return { badgeBg: 'bg-teal-100 text-teal-600', iconBg: 'bg-teal-50 text-teal-500', icon: Wallet, label: 'رصيد' };
    }
    if (t === '5' || t.includes('appointment')) {
      return { badgeBg: 'bg-orange-100 text-orange-600', iconBg: 'bg-orange-50 text-orange-500', icon: Clock, label: 'موعد' };
    }
    if (t === '6' || t.includes('specialoffer')) {
      return { badgeBg: 'bg-fuchsia-100 text-fuchsia-600', iconBg: 'bg-fuchsia-50 text-fuchsia-500', icon: Tag, label: 'عرض' };
    }
    if (t === '7' || t.includes('system')) {
      return { badgeBg: 'bg-slate-100 text-slate-600', iconBg: 'bg-slate-50 text-slate-500', icon: AlertCircle, label: 'نظام' };
    }
    
    // Fallback using severity if type doesn't match
    if (s === '4' || s.includes('error')) {
      return { badgeBg: 'bg-red-100 text-red-600', iconBg: 'bg-red-50 text-red-500', icon: AlertCircle, label: 'عاجل' };
    }
    if (s === '1' || s.includes('success')) {
      return { badgeBg: 'bg-green-100 text-green-600', iconBg: 'bg-green-50 text-green-500', icon: Check, label: 'نجاح' };
    }
    if (s === '3' || s.includes('warning')) {
      return { badgeBg: 'bg-orange-100 text-orange-600', iconBg: 'bg-orange-50 text-orange-500', icon: AlertCircle, label: 'تحذير' };
    }

    return { badgeBg: 'bg-gray-100 text-gray-600', iconBg: 'bg-gray-50 text-gray-500', icon: Bell, label: 'إشعار' };
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
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative">
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-3xl backdrop-blur-[1px]">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="ابحث في الإشعارات (محلياً)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-right"
          />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-6 mb-6 text-sm">
          
          <div className="flex flex-col gap-2">
            <span className="text-slate-500 font-bold mb-1">النوع</span>
            <div className="flex flex-wrap items-center gap-2">
              {typeFiltersList.map(filter => (
                <button 
                  key={filter.id}
                  onClick={() => setTypeFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors ${typeFilter === filter.id ? 'bg-primary text-white shadow-md' : 'bg-gray-50 text-slate-600 hover:bg-gray-100'}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-slate-500 font-bold mb-1">الحالة</span>
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setStatusFilter('all')}
                className={`px-6 py-2 rounded-xl font-bold transition-colors ${statusFilter === 'all' ? 'bg-[#1e40af] text-white shadow-md' : 'bg-gray-50 text-slate-600 hover:bg-gray-100'}`}
              >
                الكل
              </button>
              <button 
                onClick={() => setStatusFilter('unread')}
                className={`px-6 py-2 rounded-xl font-bold transition-colors ${statusFilter === 'unread' ? 'bg-[#1e40af] text-white shadow-md' : 'bg-gray-50 text-slate-600 hover:bg-gray-100'}`}
              >
                غير مقروءة
              </button>
              <button 
                onClick={() => setStatusFilter('read')}
                className={`px-6 py-2 rounded-xl font-bold transition-colors ${statusFilter === 'read' ? 'bg-[#1e40af] text-white shadow-md' : 'bg-gray-50 text-slate-600 hover:bg-gray-100'}`}
              >
                مقروءة
              </button>
            </div>
          </div>

        </div>

        {/* List Header */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100 mb-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary focus:ring-offset-0 bg-gray-100 cursor-pointer"
              checked={selectedItems.length === filteredNotifications.length && filteredNotifications.length > 0}
              onChange={handleSelectAll}
            />
            <span className="font-bold text-slate-600 text-sm bg-gray-50 px-3 py-1.5 rounded-lg">تحديد الكل</span>
          </label>
          
          <button 
            onClick={handleMarkAsRead}
            disabled={actionLoading || (selectedItems.length === 0 && unreadCount === 0)}
            className={`text-sm font-bold transition-colors flex items-center gap-2 ${!actionLoading && (selectedItems.length > 0 || unreadCount > 0) ? 'text-primary hover:text-primary-dark' : 'text-slate-300 cursor-not-allowed'}`}
          >
            {actionLoading && <Loader2 size={14} className="animate-spin" />}
            {selectedItems.length > 0 ? "تحديد كمقروءة" : "تحديد الكل كمقروءة"}
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-1">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const styles = getTypeStyles(notif.type, notif.severity);
              const isSelected = selectedItems.includes(notif.id);
              
              return (
                <div 
                  key={notif.id} 
                  className={`flex flex-col md:flex-row gap-4 p-4 rounded-2xl transition-all border border-transparent hover:border-gray-100 hover:bg-gray-50 ${!notif.isRead ? 'bg-slate-50/50' : ''}`}
                >
                  {/* Right side: Checkbox, Icon, Content */}
                  <div className="flex items-start gap-4 flex-1">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary focus:ring-offset-0 mt-3 cursor-pointer"
                      checked={isSelected}
                      onChange={() => handleSelectItem(notif.id)}
                    />
                    
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${styles.iconBg}`}>
                      <styles.icon size={22} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium ml-2">{formatDate(notif.createdAt)}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${styles.badgeBg}`}>
                          {styles.label}
                        </span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        )}
                      </div>
                      <h4 className="text-base font-black text-slate-800">{notif.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">{notif.message}</p>
                    </div>
                  </div>

                  {/* Left side: Action Button */}
                  {notif.primaryAction && (
                    <div className="flex items-center justify-start md:justify-end mt-2 md:mt-0 pr-14 md:pr-0">
                      <a 
                        href={notif.primaryAction.url} 
                        className="text-sm font-bold text-primary hover:underline"
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
            <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-3xl mt-4">
              <Bell size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500 font-bold">لا توجد إشعارات تطابق بحثك</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Notifications;
