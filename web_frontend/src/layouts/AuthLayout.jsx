import { Outlet } from "react-router-dom";
import bgImage from "../assets/login page.jpg";

export default function AuthLayout() {

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 font-tajawal bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `linear-gradient(rgba(5,5,5,0.7), rgba(5,5,5,0.7)), url(${bgImage})` }}
    >
      {/* Decorative gold glow accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D9B07C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#D9B07C]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div data-aos="zoom-in" data-aos-duration="800" className="w-full max-w-[480px] relative z-10">
        <Outlet />
      </div>
    </div>
  );
}