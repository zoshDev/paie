import { useContext } from 'react';
import { ToastContext } from './ToastProvider';
import type { ToastType } from './ToastProvider';

/**
 * Hook personnalisé pour utiliser le système de notification Toast
 * Permet d'afficher facilement des notifications success, error, info et warning
 */
const useToast = () => {
  const { addToast, removeToast } = useContext(ToastContext);

  /**
   * Affiche un toast en spécifiant le type
   */
  const showToast = (type: ToastType, message: string, title?: string, duration = 5000) => {
    addToast({
      type,
      message,
      title,
      duration,
    });
  };

  return {
    /**
     * Notification de succès (vert)
     */
    success: (message: string, title?: string, duration?: number) => 
      showToast('success', message, title, duration),
    
    /**
     * Notification d'erreur (rouge)
     */
    error: (message: string, title?: string, duration?: number) => 
      showToast('error', message, title, duration),
    
    /**
     * Notification d'information (bleu)
     */
    info: (message: string, title?: string, duration?: number) => 
      showToast('info', message, title, duration),
    
    /**
     * Notification d'avertissement (jaune)
     */
    warning: (message: string, title?: string, duration?: number) => 
      showToast('warning', message, title, duration),
    
    /**
     * Suppression directe d'un toast spécifique par son ID
     */
    removeToast,
  };
};

export default useToast;
