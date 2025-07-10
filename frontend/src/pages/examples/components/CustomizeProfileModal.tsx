import { useState, useEffect } from 'react';
import { useExamplePayrollProfileStore } from '../../../stores/examplePayrollProfileStore';
import type { PayrollProfile, PayrollItem, EmployeePayrollProfile } from '../../../models/payrollProfiles';
import type { Employee } from '../../../stores/exampleEmployeeStore';
import {
  XMarkIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

interface CustomizeProfileModalProps {
  isOpen: boolean;
  employee: Employee;
  onClose: () => void;
}

export default function CustomizeProfileModal({
  isOpen,
  employee,
  onClose,
}: CustomizeProfileModalProps) {
  const { 
    profiles, 
    employeeProfiles, 
    customizeEmployeeProfile 
  } = useExamplePayrollProfileStore();

  // Find the employee's profile
  const employeeProfile = employeeProfiles.find(ep => ep.employeeId === employee.id);
  const profile = employeeProfile 
    ? profiles.find(p => p.id === employeeProfile.profileId) 
    : null;

  // State for customizations with initial empty array
  const [customizations, setCustomizations] = useState<NonNullable<EmployeePayrollProfile['customizations']>>([]);

  // Initialize customizations when the modal opens
  useEffect(() => {
    if (employeeProfile && employeeProfile.customizations) {
      setCustomizations([...employeeProfile.customizations]);
    } else {
      setCustomizations([]);
    }
  }, [employeeProfile, isOpen]);

  if (!isOpen || !profile) return null;

  // Handle saving customizations
  const handleSave = () => {
    if (employeeProfile) {
      customizeEmployeeProfile(employee.id, employeeProfile.profileId, customizations);
      onClose();
    }
  };

  // Handle updating a customization
  const handleCustomizationChange = (itemId: string, field: 'amount' | 'disabled', value: any) => {
    const existingIndex = customizations.findIndex(c => c.itemId === itemId);
    
    if (existingIndex >= 0) {
      // Update existing customization
      const updatedCustomizations = [...customizations];
      updatedCustomizations[existingIndex] = {
        ...updatedCustomizations[existingIndex],
        [field]: value
      };
      setCustomizations(updatedCustomizations);
    } else {
      // Create new customization
      setCustomizations([
        ...customizations,
        { itemId, [field]: value }
      ]);
    }
  };

  // Get customization value for an item
  const getCustomization = (itemId: string, field: 'amount' | 'disabled') => {
    const customization = customizations.find(c => c.itemId === itemId);
    return customization ? customization[field] : undefined;
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all dark:bg-gray-800">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Personnaliser le profil de paie - {employee.firstName} {employee.lastName}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Profil de base: <span className="font-medium text-gray-900 dark:text-white">{profile.name}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Personnalisez les rubriques ci-dessous. Les valeurs modifiées seront appliquées uniquement à cet employé.
              </p>
            </div>
            
            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Code
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Rubrique
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Montant par défaut
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Montant personnalisé
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      Actif
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {profile.items.map((item) => {
                    const customAmount = getCustomization(item.id, 'amount');
                    const isDisabled = getCustomization(item.id, 'disabled');
                    const isCustomized = customAmount !== undefined || isDisabled !== undefined;
                    
                    return (
                      <tr 
                        key={item.id} 
                        className={isCustomized ? 'bg-blue-50 dark:bg-blue-900/20' : undefined}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">
                          {item.code}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {item.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {item.type === 'earning' ? 'Gain' : 'Déduction'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {item.amount}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="flex items-center">
                            <input
                              type="number"
                              value={customAmount !== undefined ? String(customAmount) : ''}
                              onChange={(e) => handleCustomizationChange(
                                item.id, 
                                'amount', 
                                e.target.value === '' ? undefined : parseFloat(e.target.value)
                              )}
                              placeholder={item.amount.toString()}
                              className="block w-24 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleCustomizationChange(item.id, 'amount', undefined)}
                              className={`ml-2 text-gray-400 hover:text-gray-500 ${customAmount === undefined ? 'invisible' : ''}`}
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                          <input
                            type="checkbox"
                            checked={isDisabled !== true}
                            onChange={(e) => handleCustomizationChange(item.id, 'disabled', !e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Footer */}
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
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSave}
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 