import React from "react";
import { useMoodColors } from "@/hooks/useMoodColors";

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  className = "",
}) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-200 to-blue-400 dark:from-blue-700/40 dark:via-blue-800/30 to- dark:to-blue-900/30 after:absolute after:top-1/3 after:left-1/4 after:w-1/5 after:h-full after:animate-pulse after:duration-1000 after:ease-in-out after:rounded-full after:blur-2xl after:bg-blue-700/10 before:absolute before:right-1/4 before:top-1/3 before:w-1/5 before:h-full before:animate-pulse before:duration-1000 before:ease-in-out before:rounded-full before:blur-2xl before:bg-blue-600/10 before:-z-10 after:-z-10 ${className}`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
};
