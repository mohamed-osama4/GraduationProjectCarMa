import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/dashboard/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F0F4F8] font-tajawal">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 bg-primary-dark text-white shadow-md">
          <h1 className="text-xl font-black">كار سيرفس</h1>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

