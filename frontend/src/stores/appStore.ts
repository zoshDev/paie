import { create } from 'zustand';

// Exemple d'état global pour plusieurs composants réutilisables
interface AppStoreState {
  // Pour la modale de confirmation
  confirmModal: {
    open: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: string;
    onConfirm?: () => void;
  };
  showConfirmModal: (params: Omit<AppStoreState['confirmModal'], 'open'> & { onConfirm: () => void }) => void;
  closeConfirmModal: () => void;

  // Pour une notification/toast global
  toast: {
    open: boolean;
    message?: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
  };
  showToast: (params: Omit<AppStoreState['toast'], 'open'>) => void;
  closeToast: () => void;

  // Ajoute ici d'autres états globaux pour d'autres composants réutilisables...
}

export const useAppStore = create<AppStoreState>((set) => ({
  confirmModal: {
    open: false,
  },
  showConfirmModal: (params) => set({ confirmModal: { open: true, ...params } }),
  closeConfirmModal: () => set({ confirmModal: { open: false } }),

  toast: {
    open: false,
  },
  showToast: (params) => set({ toast: { open: true, ...params } }),
  closeToast: () => set({ toast: { open: false } }),

  // Ajoute ici d'autres états globaux pour d'autres composants réutilisables...
}));