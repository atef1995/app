import React from "react";

interface ContentGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: "1" | "2" | "3" | "4";
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  children,
  className = "",
  columns = "3",
}) => {
  const getGridClasses = () => {
    switch (columns) {
      case "1":
        return "grid-cols-1";
      case "2":
        return "grid-cols-1 md:grid-cols-2";
      case "3":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case "4":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <div className={`grid ${getGridClasses()} gap-6 auto-rows-fr ${className}`}>
      {children}
    </div>
  );
};
