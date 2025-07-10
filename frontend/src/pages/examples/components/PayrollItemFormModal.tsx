import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import GenericForm from '../../../components/ui/GenericForm';
import ProgressiveRatesManager from './ProgressiveRatesManager';
import { getPayrollItemFormSections, formatPayrollItemForSubmit } from './PayrollItemForm';
import type { PayrollItem, ProgressiveRate } from '../../../models/payrollItems';

interface PayrollItemFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  item: PayrollItem | null;
  items: PayrollItem[];
  onClose: () => void;
  onSubmit: (data: Omit<PayrollItem, 'id'>) => void;
}

/**
 * Modal component for adding or editing a payroll item with support for
 * progressive rates management.
 */
export default function PayrollItemFormModal({
  isOpen,
  isEdit,
  item,
  items,
  onClose,
  onSubmit,
}: PayrollItemFormModalProps) {
  // State for progressive rates
  const [progressiveRates, setProgressiveRates] = useState<ProgressiveRate[]>([]);
  
  // State for calculation method
  const [calculationMethod, setCalculationMethod] = useState<string>(item?.calculationMethod || 'fixed');
  
  // Initialize progressive rates when item changes
  useEffect(() => {
    if (item && item.progressiveRates) {
      setProgressiveRates(item.progressiveRates);
    } else {
      setProgressiveRates([]);
    }
    
    if (item) {
      setCalculationMethod(item.calculationMethod);
    } else {
      setCalculationMethod('fixed');
    }
  }, [item]);
  
  if (!isOpen) return null;
  
  // Get form sections
  const formSections = getPayrollItemFormSections(isEdit, item, items);
  
  // Handle form submission
  const handleSubmit = (data: any) => {
    // Format the data
    const formattedData = formatPayrollItemForSubmit(data);
    
    // Add progressive rates if applicable
    if (calculationMethod === 'progressive') {
      formattedData.progressiveRates = progressiveRates;
    }
    
    onSubmit(formattedData);
  };
  
  // Handle calculation method change
  const handleFormValueChange = (data: any) => {
    if (data.calculationMethod !== calculationMethod) {
      setCalculationMethod(data.calculationMethod);
    }
  };
  
  const modalTitle = isEdit ? 'Modifier la rubrique de paie' : 'Ajouter une rubrique de paie';
  
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all dark:bg-gray-800">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {modalTitle}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Form content */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <GenericForm
              sections={formSections}
              initialData={item || {}}
              onSubmit={handleSubmit}
              onCancel={onClose}
              submitLabel={isEdit ? 'Enregistrer les modifications' : 'Ajouter la rubrique'}
              onValueChange={handleFormValueChange}
            />
            
            {/* Progressive rates manager - only show when calculation method is progressive */}
            {calculationMethod === 'progressive' && (
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                  Barème progressif
                </h3>
                <ProgressiveRatesManager
                  rates={progressiveRates}
                  onChange={setProgressiveRates}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 