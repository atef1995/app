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

  useEffect(() => {
    const duration = toast.duration || 4000;
    const interval = 50; // Update every 50ms for smooth progress
    const decrement = (interval / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - decrement;
        if (newProgress <= 0) {
          clearInterval(progressTimer);
          // Use setTimeout to defer the state update to avoid updating during render
          setTimeout(() => {
            onRemove(toast.id);
          }, 0);
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    // Use setTimeout to defer the state update to avoid updating during render
    setTimeout(() => {
      onRemove(toast.id);
    }, 0);
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
  };

  const Icon = icons[toast.type];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.3, x: 100 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        x: 0,
        ...(toast.type === 'error' && { 
          rotateZ: [0, -2, 2, -1, 1, 0]
        })
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.95, 
        x: 100
      }}
      transition={{
        type: toast.type === 'success' ? "spring" : "tween",
        stiffness: toast.type === 'success' ? 500 : 300,
        damping: 25,
        duration: toast.type === 'error' ? 0.6 : 0.4
      }}
      whileHover={{ scale: 1.02 }}
      className={`
        rounded-lg border p-4 shadow-lg relative overflow-hidden cursor-pointer
        ${colors[toast.type]}
      `}
    >
      {/* Animated progress bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-current opacity-30"
        initial={{ width: "100%" }}
        animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        transition={{ duration: 0.05, ease: "linear" }}
      />
      
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 15 }}
        >
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        </motion.div>
        
        <motion.div 
          className="flex-1 min-w-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h4 className="font-medium">{toast.title}</h4>
          {toast.message && (
            <motion.p 
              className="text-sm opacity-90 mt-1"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 0.9, height: "auto" }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {toast.message}
            </motion.p>
          )}
        </motion.div>
        
        <motion.button
          onClick={handleClose}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-all rounded-full p-1 hover:bg-current hover:bg-opacity-10"
          aria-label="Close notification"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 20 }}
        >
          <X className="w-4 h-4" />
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
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastComponent 
            key={toast.id} 
            toast={toast} 
            onRemove={onRemove} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
