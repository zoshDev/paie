import { 
  PencilIcon, 
  TrashIcon, 
  DocumentDuplicateIcon 
} from '@heroicons/react/24/outline';
import type { PayrollProfile } from '../../../models/payrollProfiles';

interface PayrollProfileRowActionsProps {
  profile: PayrollProfile;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export default function PayrollProfileRowActions({
  profile,
  onEdit,
  onDelete,
  onDuplicate,
}: PayrollProfileRowActionsProps) {
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
        onClick={onDuplicate}
        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
        title="Dupliquer"
      >
        <DocumentDuplicateIcon className="w-5 h-5" />
      </button>
      
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
        disabled={profile.isDefault}
        title={profile.isDefault ? "Impossible de supprimer un profil standard" : "Supprimer"}
      >
        <TrashIcon className={`w-5 h-5 ${profile.isDefault ? 'opacity-50 cursor-not-allowed' : ''}`} />
      </button>
    </div>
  );
} 