"use client";

import { useEffect } from "react";

interface UseProgressiveLoadingProps {
  mdxSource: unknown;
  onLoaded: () => void;
  delay?: number;
}

export const useProgressiveLoading = ({ 
  mdxSource, 
  onLoaded, 
  delay = 100 
}: UseProgressiveLoadingProps) => {
  useEffect(() => {
    if (mdxSource) {
      // Simulate progressive loading for better UX
      const timer = setTimeout(() => {
        onLoaded();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [mdxSource, onLoaded, delay]);
};