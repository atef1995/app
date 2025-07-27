import { BUTTON_COLOR } from "@/types/button";
import React from "react";

interface ButtonProps {
  onClick: () => void;
  className?: string;
  color: BUTTON_COLOR;
  children: React.ReactNode;
  key: string;
}

const Button = ({ onClick, className, color, children, key }: ButtonProps) => {
  return (
    <button
      key={key}
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-semibold active:scale-95 cursor-pointer transition-all ${color} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
