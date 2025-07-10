import React, { useEffect, useRef } from 'react';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose, children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={`absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 ${className}`}
    >
      <ul className="py-1">{children}</ul>
    </div>
  );
};

interface MenuItemProps {
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  onClick,
  icon,
  children,
  className = '',
}) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${className}`}
      >
        {icon && <span className="w-5 h-5 mr-2">{icon}</span>}
        {children}
      </button>
    </li>
  );
};

export default Menu;
// This Menu component provides a dropdown menu with items that can be clicked.
// The MenuItem component is used to create individual items within the menu.