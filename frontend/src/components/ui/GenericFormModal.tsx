import { useEffect, useState } from 'react';
import GenericForm from './GenericForm';
import type { FormSection } from './GenericForm';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface GenericFormModalProps {
  isOpen: boolean;
  isEdit: boolean;
  title: string;
  entity: any | null;
  sections: FormSection[];
  onClose: () => void;
  onSubmit: (data: any) => void;
  submitLabel?: string;
  cancelLabel?: string;
  getFormSections?: (isEdit: boolean, entity: any | null) => FormSection[];
}

/**
 * A generic modal component for add/edit operations that uses the GenericForm component.
 */
export default function GenericFormModal({
  isOpen,
  isEdit,
  title,
  entity,
  sections: defaultSections,
  onClose,
  onSubmit,
  submitLabel = isEdit ? 'Enregistrer les modifications' : 'Ajouter',
  cancelLabel = 'Annuler',
  getFormSections,
}: GenericFormModalProps) {
  const [formSections, setFormSections] = useState<FormSection[]>(defaultSections);

  // Update form sections if they depend on isEdit or entity
  useEffect(() => {
    if (getFormSections) {
      setFormSections(getFormSections(isEdit, entity));
    }
  }, [isEdit, entity, getFormSections]);

  if (!isOpen) return null;

  const modalTitle = isEdit ? `Modifier ${title}` : `Ajouter ${title}`;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        
        {/* This element centers the modal contents. */}
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transform transition-all sm:my-8 sm:align-middle dark:bg-gray-800">
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
          
          {/* Modal content */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <GenericForm
              sections={formSections}
              onSubmit={onSubmit}
              onCancel={onClose}
              initialData={entity || {}}
              submitLabel={submitLabel}
              cancelLabel={cancelLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 