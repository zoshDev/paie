import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { PayrollProfile } from '../../../models/payrollProfiles';
import type { PayrollItem } from '../../../models/payrollItems';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  profile?: PayrollProfile;
  item?: PayrollItem;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  profile,
  item,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  // Determine what we're deleting
  const isProfile = !!profile;
  const isItem = !!item;
  
  // Set title and message based on what's being deleted
  let title = 'Confirmer la suppression';
  let message = 'Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.';
  
  if (isProfile) {
    title = 'Supprimer le profil';
    message = `Êtes-vous sûr de vouloir supprimer le profil "${profile.name}" ? Cette action est irréversible.`;
  } else if (isItem) {
    title = 'Supprimer la rubrique';
    message = `Êtes-vous sûr de vouloir supprimer la rubrique "${item.code} - ${item.name}" ? Cette action est irréversible.`;
  }

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-md rounded-lg bg-white text-left align-middle shadow-xl transition-all dark:bg-gray-800">
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-800">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-200" aria-hidden="true" />
              </div>
              <div className="ml-4 mt-0 text-center sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message}
                  </p>
                </div>
              </div>
              <button
                className="ml-auto bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none dark:bg-gray-800"
                onClick={onClose}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="button"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={onConfirm}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 