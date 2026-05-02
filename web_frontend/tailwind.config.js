/** @type {import('tailwindcss').Config} */
export default {
content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
],
theme: {
    extend: {
    fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
    },
    colors: {
        primary: {
          light: "#3b82f6",
          DEFAULT: "#1e40af",
          dark: "#1e3a8a",
        },
        sidebar: {
          DEFAULT: "#1B2559",
          hover: "#253170",
          active: "#2D3A80",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          300: "#d1d5db",
          500: "#6b7280",
          700: "#374151",
          900: "#111827",
        },
        "in-progress": "#06b6d4",
        info: "#3b82f6",
        warning: "#f59e0b",
        error: "#ef4444",
        success: "#10b981",
        background: "#f0f4f8",
        surface: "#ffffff",
    },
    boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.1)",
    },
    },
},
plugins: [],
}