import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'success', 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const baseClasses = "fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg \
                      transform transition-all duration-300";
  const typeClasses = type === 'success' 
    ? "bg-green-500 text-white" 
    : "bg-red-500 text-white";

  return createPortal(
    <div className={`${baseClasses} ${typeClasses}`}>
      {message}
    </div>,
    document.body
  );
};

export default Toast; 