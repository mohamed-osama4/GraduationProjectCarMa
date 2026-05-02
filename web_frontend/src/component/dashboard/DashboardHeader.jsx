import { Search, Bell, ChevronDown, Menu } from 'lucide-react';

const DashboardHeader = ({ title, subtitle, onMenuClick }) => {
  return (
    <div className="flex flex-col font-tajawal">
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
          
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">{title}</h1>
            {subtitle && <p className="hidden sm:block text-slate-500 text-xs font-medium">{subtitle}</p>}
          </div>
        </div>

        {/* Search Bar (Center) */}
        <div className="flex-1 max-w-2xl mx-12">
          <div className="relative">
            <input 
              type="text" 
              placeholder="بحث في الطلبات، العملاء، الفنيين..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-12"
            />
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* User Profile & Notifications (RTL End - Left) */}
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors order-2 md:order-1">
            <Bell size={22} className="text-slate-600" />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </div>

          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity order-1 md:order-2">
            <ChevronDown size={18} className="text-slate-400" />
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-bold text-slate-900">أحمد محمود</span>
              <span className="text-xs text-slate-500">مدير العمليات</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200">
              أم
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
