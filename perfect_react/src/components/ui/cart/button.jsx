import React from "react";

const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    ghost: "bg-transparent hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-800 text-white hover:bg-gray-900",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-6",
    icon: "h-10 w-10",
  };
  const classes = [base, variants[variant] || variants.default, sizes[size] || sizes.default, className]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export { Button };


