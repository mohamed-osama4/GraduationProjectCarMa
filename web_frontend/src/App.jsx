import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SignalRProvider } from "./context/SignalRContext.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Login from "./pages/auth/Login.jsx";
import LoginV2 from "./pages/auth/LoginV2.jsx";
import AdminHome from "./pages/dashboard/admin/AdminHome.jsx";
import AdminOrders from "./pages/dashboard/admin/AdminOrders.jsx";
import Technicians from "./pages/dashboard/admin/Technicians.jsx";
import Reports from "./pages/dashboard/admin/Reports.jsx";
import Notifications from "./pages/dashboard/admin/Notifications.jsx";
import Profile from "./pages/dashboard/admin/Profile.jsx";
import Settings from "./pages/dashboard/admin/Settings.jsx";
import LandingPage from "./pages/landingpage/LandingPage.jsx";
import LandingPageV2 from "./pages/landingpage/LandingPageV2.jsx";


import { AdminDataProvider } from "./context/AdminDataContext.jsx";

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPageV2 />} />
          <Route path="/landing-v1" element={<LandingPage />} />

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/login-v2" element={<LoginV2 />} />
          </Route>

          {/* Dashboard (protected) */}
          <Route
            element={
              <ProtectedRoute>
                <SignalRProvider>
                  <AdminDataProvider>
                    <DashboardLayout />
                  </AdminDataProvider>
                </SignalRProvider>
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/technicians" element={<Technicians />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            <Route path="/admin/profile" element={<Profile />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
