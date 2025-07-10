// components/ui/BulkActionsBar.tsx
import React from "react";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface BulkAction{
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
interface BulkActionsBarProps {
  count: number;
  actions: BulkAction[];
  onClearSelection?: () => void;
}


const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  count,
  actions,
  onClearSelection
}) => {
  return (
    <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded px-4 py-2 shadow-sm text-sm text-indigo-800">
      <span className="font-medium">{count} sélectionné{count > 1 ? "s" : ""}</span>

      {actions.map(action => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={`flex items-center gap-1 px-2 py-1 rounded transition ${action.className}`}
        >
          {action.icon}
          {action.label}
        </button>
      ))}
      <button
        onClick={onClearSelection}
        className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-white hover:bg-gray-400 rounded transition"
      >
        <XMarkIcon className="w-4 h-4" />
        Annuler
      </button>
    </div>
  );
};

export default BulkActionsBar;
