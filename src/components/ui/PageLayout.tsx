import React from "react";
import { useMoodColors } from "@/hooks/useMoodColors";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  className = "",
}) => {
  const moodColors = useMoodColors();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient} ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
