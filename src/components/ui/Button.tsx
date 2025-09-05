import { BUTTON_COLOR } from "@/types/button";
import React from "react";

interface ButtonProps {
  onClick: () => void;
  className?: string;
  color: BUTTON_COLOR;
  children: React.ReactNode;
  uniqueKey: string | number;
  loading: boolean;
  id: string;
}

const Button = ({
  onClick,
  className,
  color,
  children,
  uniqueKey,
  loading,
  id,
}: ButtonProps) => {
  return (
    <button
      id={id}
      disabled={loading}
      key={uniqueKey}
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-semibold active:scale-95 cursor-pointer transition-all disabled:opacity-80 disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:cursor-wait touch-manipulation min-h-[48px] relative ${color} ${className}`}
      style={{ 
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'manipulation'
      }}
    >
      {children}
    </button>
  );
};

export default Button;
