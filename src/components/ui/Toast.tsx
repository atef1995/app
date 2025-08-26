"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastComponent = ({ toast, onRemove }: ToastProps) => {
  const [progress, setProgress] = useState(100);
  const [bounceAnimation, setBounceAnimation] = useState(false);

  // Add a small celebration bounce after initial animation
  useEffect(() => {
    if (toast.type === 'success') {
      const timer = setTimeout(() => setBounceAnimation(true), 600);
      return () => clearTimeout(timer);
    }
  }, [toast.type]);

  useEffect(() => {
    const duration = toast.duration || 4000;
    const interval = 50; // Update every 50ms for smooth progress
    const decrement = (interval / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - decrement;
        if (newProgress <= 0) {
          clearInterval(progressTimer);
          setTimeout(() => onRemove(toast.id), 0);
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    onRemove(toast.id);
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-700 text-green-900 dark:text-green-100 shadow-green-200/50 dark:shadow-green-900/50",
    error: "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100 shadow-red-200/50 dark:shadow-red-900/50",
    info: "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100 shadow-blue-200/50 dark:shadow-blue-900/50",
    warning: "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-300 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 shadow-yellow-200/50 dark:shadow-yellow-900/50",
  };

  const Icon = icons[toast.type];

  return (
    <motion.div 
      layout
      initial={{ 
        opacity: 0, 
        scale: 0, 
        x: 300,
        y: -100
      }}
      animate={{ 
        opacity: 1, 
        scale: bounceAnimation ? 1.02 : 1,
        x: 0,
        y: bounceAnimation ? -2 : 0
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.5, 
        x: 400,
        y: -50,
        transition: { 
          duration: 0.3,
          ease: "easeInOut"
        }
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.6,
        opacity: { duration: 0.4 },
        scale: { duration: 0.5 },
        x: { type: "spring", stiffness: 300, damping: 25 },
        y: { type: "spring", stiffness: 300, damping: 25 }
      }}
      whileHover={{ 
        scale: 1.03,
        y: -2,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
      className={`
        rounded-xl border-2 p-5 shadow-xl backdrop-blur-sm relative overflow-hidden cursor-pointer
        transition-shadow duration-200
        ${colors[toast.type]}
      `}
    >
      {/* Enhanced animated progress bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-current to-transparent opacity-40 rounded-full"
        initial={{ width: "100%", scaleX: 1 }}
        animate={{ 
          width: `${Math.max(0, Math.min(100, progress))}%`,
          scaleX: progress > 20 ? 1 : 0.8
        }}
        transition={{ 
          duration: 0.05, 
          ease: "linear",
          scaleX: { duration: 0.1 }
        }}
      />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            ...(toast.type === 'success' && {
              rotate: [0, -10, 10, 0]
            })
          }}
          transition={{ 
            delay: 0.2, 
            type: "spring", 
            stiffness: 500, 
            damping: 15,
            rotate: { duration: 0.6, delay: 0.3 }
          }}
          className="relative"
        >
          {/* Icon background glow */}
          <div className="absolute inset-0 rounded-full bg-current opacity-10 blur-sm scale-150" />
          <Icon className="w-6 h-6 mt-0.5 flex-shrink-0 relative z-10 drop-shadow-sm" />
        </motion.div>
        
        <motion.div 
          className="flex-1 min-w-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <motion.h4 
            className="font-semibold text-sm tracking-wide"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            {toast.title}
          </motion.h4>
          {toast.message && (
            <motion.p 
              className="text-sm opacity-85 mt-1.5 leading-relaxed"
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 0.85, height: "auto", y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              {toast.message}
            </motion.p>
          )}
        </motion.div>
        
        <motion.button
          onClick={handleClose}
          className="flex-shrink-0 opacity-50 hover:opacity-100 transition-all duration-200 rounded-full p-1.5 hover:bg-current hover:bg-opacity-15 group"
          aria-label="Close notification"
          whileHover={{ 
            scale: 1.15, 
            rotate: 90,
            backgroundColor: "rgba(255, 255, 255, 0.1)"
          }}
          whileTap={{ scale: 0.9, rotate: 180 }}
          initial={{ opacity: 0, scale: 0, rotate: 180 }}
          animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.4, 
            type: "spring", 
            stiffness: 400, 
            damping: 20,
            rotate: { duration: 0.3 }
          }}
        >
          <X className="w-4 h-4 drop-shadow-sm group-hover:drop-shadow transition-all duration-200" />
        </motion.button>
      </div>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastComponent 
              toast={toast} 
              onRemove={onRemove} 
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
