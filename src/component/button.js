import React from "react";

const Button = ({ label, onClick, type = "button", className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-all ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
