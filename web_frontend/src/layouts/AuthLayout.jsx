import { Outlet } from "react-router-dom";

export default function AuthLayout() {

  return (
    <div className="min-h-screen w-full flex items-center justify-center noise-gradient-bg p-4 font-tajawal">
      <div data-aos="zoom-in" data-aos-duration="800" className="w-full max-w-[500px]">
        <Outlet />
      </div>
    </div>
  );
}