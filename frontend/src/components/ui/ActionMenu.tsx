import React, { useState, useRef, useEffect } from 'react';

// Icône menu (burger)
const MenuIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
  </svg>
);

export interface ActionMenuProps {
  onAdd?: () => void;
  addLabel?: string;
  onImport?: () => void;
  onExport?: () => void;
  customActions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  onAdd,
  addLabel = "Ajouter",
  onImport,
  onExport,
  customActions = [],
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // S'il n'y a aucune action, ne pas afficher le menu
  if (!onAdd && !onImport && !onExport && customActions.length === 0) {
    return null;
  }

  return (
    <div className="relative ml-auto z-50" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 flex items-center gap-1"
        type="button"
      >
        <MenuIcon />
        Actions
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border rounded shadow-lg z-[9999]">
          {onAdd && (
            <button
              onClick={() => { setOpen(false); onAdd(); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              type="button"
            >
              {addLabel}
            </button>
          )}
          {onImport && (
            <button
              onClick={() => { setOpen(false); onImport(); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              type="button"
            >
              Importer depuis Excel
            </button>
          )}
          {onExport && (
            <button
              onClick={() => { setOpen(false); onExport(); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              type="button"
            >
              Exporter vers Excel
            </button>
          )}
          {customActions.map((action, index) => (
            <button
              key={index}
              onClick={() => { setOpen(false); action.onClick(); }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu; 