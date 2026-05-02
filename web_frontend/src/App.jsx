import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Login from "./pages/auth/Login.jsx";
import AdminHome from "./pages/dashboard/admin/AdminHome.jsx";
import AdminOrders from "./pages/dashboard/admin/AdminOrders.jsx";
import Technicians from "./pages/dashboard/admin/Technicians.jsx";
import Reports from "./pages/dashboard/admin/Reports.jsx";
import LandingPage from "./pages/landingpage/LandingPage.jsx";


export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Dashboard (protected) */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/technicians" element={<Technicians />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
