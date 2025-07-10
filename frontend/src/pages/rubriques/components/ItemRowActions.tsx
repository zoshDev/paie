import { 
  PencilIcon, 
  TrashIcon, 
  PlusCircleIcon 
} from '@heroicons/react/24/outline';
import type { PayrollItem } from '../../../models/payrollItems';

interface ItemRowActionsProps {
  item: PayrollItem;
  onEdit: () => void;
  onDelete: () => void;
  onAssignToProfile: () => void;
}

export default function ItemRowActions({
  item,
  onEdit,
  onDelete,
  onAssignToProfile,
}: ItemRowActionsProps) {
  return (
    <div className="flex justify-end items-center space-x-2">
      <button
        onClick={onEdit}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        title="Modifier"
      >
        <PencilIcon className="w-5 h-5" />
      </button>
      
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
        disabled={item.isDefault}
        title={item.isDefault ? "Impossible de supprimer une rubrique standard" : "Supprimer"}
      >
        <TrashIcon className={`w-5 h-5 ${item.isDefault ? 'opacity-50 cursor-not-allowed' : ''}`} />
      </button>
      
      <button
        onClick={onAssignToProfile}
        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
        title="Ajouter à un profil"
      >
        <PlusCircleIcon className="w-5 h-5" />
      </button>
    </div>
  );
} 