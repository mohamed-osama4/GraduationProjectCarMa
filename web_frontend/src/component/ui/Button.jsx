const Button = ({ children, variant = "primary", className, ...props }) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/20",
    secondary: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    outline: "border-2 border-primary text-primary hover:bg-primary/5",
    custom: "",
  };

  return (
    <button
      className={`px-8 py-2.5 rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;