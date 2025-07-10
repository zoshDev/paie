// components/ui/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg w-full max-w-md p-4 relative">
        {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
