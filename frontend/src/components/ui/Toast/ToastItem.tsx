import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  InformationCircleIcon, 
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { Toast, ToastType } from './ToastProvider';

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  
  // Déclencher l'animation de sortie avant de fermer complètement le toast
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // Durée de l'animation
  };
  
  useEffect(() => {
    // Réinitialiser l'état d'animation lors de la création d'un nouveau toast
    setIsExiting(false);
  }, [toast.id]);

  // Classes et icônes en fonction du type de toast
  const getToastClasses = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
          progress: 'bg-green-500'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
          progress: 'bg-red-500'
        };
      case 'warning':
        return {
          container: 'bg-amber-50 border-amber-200 text-amber-800',
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />,
          progress: 'bg-amber-500'
        };
      case 'info':
      default:
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
          progress: 'bg-blue-500'
        };
    }
  };

  const classes = getToastClasses(toast.type);
  const duration = toast.duration || 5000;

  // Style pour l'animation de la barre de progression
  const keyframesStyle = `
    @keyframes shrink {
      0% { width: 100%; }
      100% { width: 0%; }
    }
  `;

  return (
    <div 
      className={`
        border rounded-lg shadow-md overflow-hidden 
        transform transition-all duration-300 ease-in-out
        ${classes.container}
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
      role="alert"
    >
      <div className="flex p-4">
        <div className="flex-shrink-0">
          {classes.icon}
        </div>
        <div className="ml-3 flex-1">
          {toast.title && (
            <h3 className="text-sm font-medium">{toast.title}</h3>
          )}
          <div className="text-sm mt-1">{toast.message}</div>
        </div>
        <button 
          onClick={handleClose}
          className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <span className="sr-only">Fermer</span>
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
      
      {/* Barre de progression */}
      <div className="relative h-1 w-full">
        <div 
          className={`absolute left-0 bottom-0 h-full ${classes.progress} transition-all duration-100 ease-linear`}
          style={{ 
            animation: `shrink ${duration}ms linear forwards`,
            transformOrigin: 'left'
          }}
        />
      </div>
      
      {/* Keyframes pour l'animation de la barre de progression */}
      <style dangerouslySetInnerHTML={{ __html: keyframesStyle }} />
    </div>
  );
};

export default ToastItem; 