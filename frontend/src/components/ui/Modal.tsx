import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "960px",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
      <div
        className="relative w-full bg-white rounded-lg shadow-lg border border-gray-200 px-6 py-4 max-h-[90vh] overflow-y-auto"
        style={{ maxWidth }}
      >
        {/* Bouton de fermeture positionné en haut à droite */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Fermer"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Titre du modal */}
        {title && (
          <h2 className="text-xl font-semibold mb-4 pr-10">{title}</h2>
        )}

        {/* Contenu injecté */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
