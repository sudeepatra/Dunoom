import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { ToastMessage, ToastType } from '../types';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 3000);
  }, []);
  
  const getToastClasses = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 border-green-400';
      case 'error':
        return 'bg-red-500/90 border-red-400';
      case 'info':
      default:
        return 'bg-blue-500/90 border-blue-400';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-5 md:right-5 z-50 w-full md:w-auto px-4 md:px-0 flex flex-col items-center md:items-end space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`w-full max-w-sm p-4 text-white rounded-lg shadow-lg border-l-4 animate-fade-in-up ${getToastClasses(toast.type)}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
       <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
