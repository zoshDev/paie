import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import GenericForm from '../../../components/ui/GenericForm';
import type { FormSection } from '../../../components/ui/GenericForm';
import type { PayrollProfile, PayrollItem, EmployeePayrollProfile } from '../../../models/payrollProfiles';
import type { Employee } from '../../../stores/exampleEmployeeStore';

interface CustomizeProfileFormModalProps {
  isOpen: boolean;
  employee: Employee;
  profile: PayrollProfile | null;
  employeeProfile?: EmployeePayrollProfile;
  onClose: () => void;
  onSubmit: (customizations: NonNullable<EmployeePayrollProfile['customizations']>) => void;
}

export default function CustomizeProfileFormModal({
  isOpen,
  employee,
  profile,
  employeeProfile,
  onClose,
  onSubmit,
}: CustomizeProfileFormModalProps) {
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

  // Generate form sections based on the profile items
  const generateFormSections = (): FormSection[] => {
    // Group items by type (earnings and deductions)
    const earnings = profile.items.filter(item => item.type === 'earning');
    const deductions = profile.items.filter(item => item.type === 'deduction');
    
    // Create form sections
    const sections: FormSection[] = [];
    
    if (earnings.length > 0) {
      sections.push({
        title: 'Gains',
        description: 'Personnalisez les rubriques de type gain',
        columns: 1,
        fields: earnings.map(item => {
          const customization = customizations.find(c => c.itemId === item.id);
          const isDisabled = customization?.disabled === true;
          
          return {
            name: `enabled_${item.id}`,
            label: `${item.code} - ${item.name}`,
            type: 'checkbox',
            defaultValue: !isDisabled,
          };
        })
      });
      
      sections.push({
        title: 'Montants personnalisés (Gains)',
        description: 'Définissez des montants personnalisés pour les rubriques actives',
        columns: 2,
        fields: earnings.map(item => {
          const customization = customizations.find(c => c.itemId === item.id);
          const customAmount = customization?.amount;
          const isDisabled = customization?.disabled === true;
          
          return {
            name: `amount_${item.id}`,
            label: `${item.code} - ${item.name}`,
            type: 'number',
            placeholder: item.amount?.toString(),
            defaultValue: customAmount || '',
            dependsOn: `enabled_${item.id}`,
            step: 0.01,
          };
        })
      });
    }
    
    if (deductions.length > 0) {
      sections.push({
        title: 'Déductions',
        description: 'Personnalisez les rubriques de type déduction',
        columns: 1,
        fields: deductions.map(item => {
          const customization = customizations.find(c => c.itemId === item.id);
          const isDisabled = customization?.disabled === true;
          
          return {
            name: `enabled_${item.id}`,
            label: `${item.code} - ${item.name}`,
            type: 'checkbox',
            defaultValue: !isDisabled,
          };
        })
      });
      
      sections.push({
        title: 'Montants personnalisés (Déductions)',
        description: 'Définissez des montants personnalisés pour les rubriques actives',
        columns: 2,
        fields: deductions.map(item => {
          const customization = customizations.find(c => c.itemId === item.id);
          const customAmount = customization?.amount;
          const isDisabled = customization?.disabled === true;
          
          return {
            name: `amount_${item.id}`,
            label: `${item.code} - ${item.name}`,
            type: 'number',
            placeholder: item.amount?.toString(),
            defaultValue: customAmount || '',
            dependsOn: `enabled_${item.id}`,
            step: 0.01,
          };
        })
      });
    }
    
    return sections;
  };
  
  // Handle form submission
  const handleSubmit = (data: Record<string, any>) => {
    const newCustomizations: NonNullable<EmployeePayrollProfile['customizations']> = [];
    
    // Process form data
    profile.items.forEach(item => {
      const isEnabled = data[`enabled_${item.id}`];
      const amount = data[`amount_${item.id}`] !== '' ? parseFloat(data[`amount_${item.id}`]) : undefined;
      
      // Only add customization if there's something to customize
      if (!isEnabled || amount !== undefined) {
        newCustomizations.push({
          itemId: item.id,
          disabled: !isEnabled,
          amount: amount
        });
      }
    });
    
    onSubmit(newCustomizations);
  };
  
  const formSections = generateFormSections();
  
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
          
          {/* Form content */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Profil de base: <span className="font-medium text-gray-900 dark:text-white">{profile.name}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Personnalisez les rubriques ci-dessous. Les valeurs modifiées seront appliquées uniquement à cet employé.
              </p>
            </div>
            
            <GenericForm
              sections={formSections}
              onSubmit={handleSubmit}
              onCancel={onClose}
              submitLabel="Enregistrer les modifications"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 