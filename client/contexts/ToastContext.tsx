import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export interface ToastConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  position?: 'top' | 'bottom';
}

interface ToastState extends ToastConfig {
  visible: boolean;
}

interface ToastContextValue {
  showToast: (config: ToastConfig) => void;
  hideToast: () => void;
  toast: ToastState | null;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATIONS: Record<ToastConfig['type'], number> = {
  success: 2000,
  error: 4000,
  warning: 3000,
  info: 3000,
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((config: ToastConfig) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const duration = config.duration ?? DEFAULT_DURATIONS[config.type];
    
    setToast({
      ...config,
      visible: true,
      duration,
      position: config.position ?? 'top',
    });

    // Auto-dismiss after duration
    timerRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, [hideToast]);

  const value: ToastContextValue = {
    showToast,
    hideToast,
    toast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
