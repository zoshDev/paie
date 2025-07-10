import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';
import type { ProgressiveRate } from '../../../models/payrollItems';

interface ProgressiveRatesManagerProps {
  rates: ProgressiveRate[];
  onChange: (rates: ProgressiveRate[]) => void;
}

/**
 * Component for managing progressive tax rates.
 * Allows adding, editing, and removing rate brackets.
 */
export default function ProgressiveRatesManager({ rates, onChange }: ProgressiveRatesManagerProps) {
  const [sortedRates, setSortedRates] = useState<ProgressiveRate[]>(() => 
    [...rates].sort((a, b) => a.minAmount - b.minAmount)
  );

  // Update parent when local state changes
  const updateRates = (newRates: ProgressiveRate[]) => {
    const sorted = [...newRates].sort((a, b) => a.minAmount - b.minAmount);
    setSortedRates(sorted);
    onChange(sorted);
  };

  // Add a new rate bracket
  const handleAddRate = () => {
    const lastRate = sortedRates[sortedRates.length - 1];
    const newRate: ProgressiveRate = {
      id: uuidv4(),
      minAmount: lastRate ? lastRate.maxAmount || lastRate.minAmount + 1 : 0,
      maxAmount: lastRate ? (lastRate.maxAmount ? lastRate.maxAmount + 1 : lastRate.minAmount + 10000) : 10000,
      rate: lastRate ? lastRate.rate + 5 : 10,
      additionalAmount: lastRate ? (lastRate.additionalAmount || 0) + 1000 : 0,
    };
    updateRates([...sortedRates, newRate]);
  };

  // Remove a rate bracket
  const handleRemoveRate = (id: string) => {
    updateRates(sortedRates.filter(rate => rate.id !== id));
  };

  // Update a specific rate bracket
  const handleUpdateRate = (id: string, field: keyof ProgressiveRate, value: any) => {
    const newRates = sortedRates.map(rate => 
      rate.id === id ? { ...rate, [field]: value } : rate
    );
    updateRates(newRates);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tranches d'imposition
        </h4>
        <button
          type="button"
          onClick={handleAddRate}
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Ajouter une tranche
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Min
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Max
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Taux (%)
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Montant additionnel
              </th>
              <th scope="col" className="relative px-3 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {sortedRates.map((rate, index) => (
              <tr key={rate.id}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={rate.minAmount}
                    onChange={(e) => handleUpdateRate(rate.id, 'minAmount', parseFloat(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={rate.maxAmount || ''}
                    onChange={(e) => handleUpdateRate(
                      rate.id, 
                      'maxAmount', 
                      e.target.value === '' ? undefined : parseFloat(e.target.value)
                    )}
                    placeholder="Pas de limite"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={rate.rate}
                    onChange={(e) => handleUpdateRate(rate.id, 'rate', parseFloat(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={rate.additionalAmount || 0}
                    onChange={(e) => handleUpdateRate(rate.id, 'additionalAmount', parseFloat(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => handleRemoveRate(rate.id)}
                    disabled={sortedRates.length <= 1}
                    className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ${
                      sortedRates.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {sortedRates.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Aucune tranche définie. Cliquez sur "Ajouter une tranche" pour commencer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Note: Les tranches sont automatiquement triées par montant minimum croissant.
      </p>
    </div>
  );
} 