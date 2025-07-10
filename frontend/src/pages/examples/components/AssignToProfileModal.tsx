import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useExamplePayrollItemStore } from '../../../stores/examplePayrollItemStore';
import type { PayrollItem } from '../../../models/payrollItems';
import type { PayrollProfile } from '../../../models/payrollProfiles';

interface AssignToProfileModalProps {
  isOpen: boolean;
  selectedItems: PayrollItem[];
  profiles: PayrollProfile[];
  onClose: () => void;
}

export default function AssignToProfileModal({
  isOpen,
  selectedItems,
  profiles,
  onClose,
}: AssignToProfileModalProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const { assignItemsToProfile } = useExamplePayrollItemStore();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProfileId) {
      assignItemsToProfile(
        selectedProfileId, 
        selectedItems.map(item => item.id)
      );
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-md rounded-lg bg-white text-left align-middle shadow-xl transition-all dark:bg-gray-800">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="px-6 pt-5 pb-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Assigner à un profil de paie
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="px-6 py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Les {selectedItems.length} rubriques sélectionnées seront ajoutées au profil choisi.
              </p>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profil de paie
                </label>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  required
                >
                  <option value="">Sélectionner un profil</option>
                  {profiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Selected items list */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rubriques à assigner
                </label>
                <div className="mt-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md p-2 max-h-40 overflow-y-auto">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedItems.map(item => (
                      <li key={item.id} className="py-2 px-1 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                          item.type === 'earning' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {item.type === 'earning' ? 'Gain' : 'Déduction'}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {item.code} - {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={!selectedProfileId}
              >
                Assigner
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 