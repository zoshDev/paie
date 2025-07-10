import { XMarkIcon } from '@heroicons/react/24/outline';
import type { PayrollItemFilter as FilterType } from '../../../models/payrollItems';

interface PayrollItemFilterProps {
  filter: FilterType;
  onFilterChange: (filter: Partial<FilterType>) => void;
  onClose: () => void;
}

export default function PayrollItemFilter({
  filter,
  onFilterChange,
  onClose,
}: PayrollItemFilterProps) {
  const handleReset = () => {
    onFilterChange({
      type: 'all',
      payer: 'all',
      isActive: 'all',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filtres</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type de rubrique
          </label>
          <select
            value={filter.type || 'all'}
            onChange={(e) => onFilterChange({ type: e.target.value as FilterType['type'] })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          >
            <option value="all">Tous les types</option>
            <option value="earning">Gains</option>
            <option value="deduction">Déductions</option>
          </select>
        </div>

        {/* Payer Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payeur
          </label>
          <select
            value={filter.payer || 'all'}
            onChange={(e) => onFilterChange({ payer: e.target.value as FilterType['payer'] })}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          >
            <option value="all">Tous les payeurs</option>
            <option value="employee">Employé</option>
            <option value="employer">Employeur</option>
            <option value="both">Les deux</option>
          </select>
        </div>

        {/* Active Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Statut
          </label>
          <select
            value={filter.isActive === 'all' ? 'all' : filter.isActive ? 'true' : 'false'}
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange({ 
                isActive: value === 'all' 
                  ? 'all' 
                  : value === 'true' 
                    ? true 
                    : false 
              });
            }}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleReset}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
} 