import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildZodSchema } from '@/schemas/genericZodForm.schema';


import type { FormField, FormSection } from './types';

// Helper pour générer le schéma de validation


interface GenericFormProps {
  sections?: FormSection[];
  fields?: FormField[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
  submitLabel?: string;
  cancelLabel?: string;
  isModal?: boolean;
  modalTitle?: string;
  onValueChange?: (values: any) => void;
  backgroundIllustration?: React.ReactNode;
}

export default function GenericForm({
  sections,
  fields,
  onSubmit,
  onCancel,
  initialData = {},
  submitLabel = 'Enregistrer',
  cancelLabel = 'Annuler',
  isModal = false,
  modalTitle = '',
  onValueChange,
  //backgroundIllustration,
}: GenericFormProps) {
  const activeSections: FormSection[] = sections ?? [
    { title: '', fields: fields ?? [], columns: 1 },
  ];

  const validationSchema = buildZodSchema(activeSections)
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: initialData,
  });

  const formValues = watch();

  useEffect(() => {
    if (onValueChange) {
      onValueChange(formValues);
    }
  }, [formValues, onValueChange]);

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const renderField = (field: FormField) => {
    if (field.hidden) {
      return (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          render={({ field: { onChange, value } }) => (
            <input type="hidden" onChange={onChange} value={value || ''} />
          )}
        />
      );
    }
    const commonClasses =
      "mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 " +
      "dark:bg-gray-900 dark:border-gray-700 dark:text-white " +
      (errors[field.name] ? "border-red-300" : "border-gray-300");

    
    const renderByType = () => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: f }) => (
                <input
                  type={field.type}
                  onChange={f.onChange}
                  value={f.value ?? ''}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  className={commonClasses}
                />
              )}
            />
          );
    
        case 'number':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: f }) => (
                <input
                  type="number"
                  onChange={f.onChange}
                  value={f.value ?? ''}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  step={field.step || 1}
                  disabled={field.disabled}
                  className={commonClasses}
                />
              )}
            />
          );
    
        case 'textarea':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: f }) => (
                <textarea
                  onChange={f.onChange}
                  value={f.value ?? ''}
                  placeholder={field.placeholder}
                  rows={field.rows || 3}
                  disabled={field.disabled}
                  className={commonClasses}
                />
              )}
            />
          );
    
        case 'select':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: f }) => (
                <select
                  value={f.value ?? ''}
                  onChange={f.onChange}
                  disabled={field.disabled}
                  className={commonClasses}
                >
                  <option value="">{field.placeholder || 'Sélectionner...'}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />
          );
    
        case 'multiselect':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: f }) => (
                <select
                  multiple
                  value={f.value ?? []}
                  onChange={(e) => {
                    const selectedValues = Array.from(e.target.selectedOptions).map((o) => o.value);
                    f.onChange(selectedValues);
                  }}
                  disabled={field.disabled}
                  className={commonClasses}
                  size={field.options?.length || 4}
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />
          );
    
        case 'checkbox':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: f }) => (
                <input
                  type="checkbox"
                  checked={f.value ?? false}
                  onChange={f.onChange}
                  disabled={field.disabled}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              )}
            />
          );
    
        case 'date':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: f }) => (
                <input
                  type="date"
                  onChange={f.onChange}
                  value={f.value ?? ''}
                  disabled={field.disabled}
                  className={commonClasses}
                />
              )}
            />
          );
    
        case 'hidden':
          return (
            <Controller
              name={field.name}
              control={control}
              render={({ field: f }) => (
                <input type="hidden" onChange={f.onChange} value={f.value ?? ''} />
              )}
            />
          );
    
        default:
          return null;
      }
    };
    

    return (
      <div key={field.name} className={`${field.fullWidth ? 'col-span-full' : ''}`}>
        <div className={field.type === 'checkbox' ? "flex items-center" : ""}>
          {field.type !== 'checkbox' ? (
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
          ) : null}

          {renderByType()}

          {field.type === 'checkbox' ? (
            <label htmlFor={field.name} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
          ) : null}
        </div>

        {errors[field.name] && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors[field.name]?.message as string}
          </p>
        )}

        {field.type === 'multiselect' && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs options.
          </p>
        )}
      </div>
    );
  };
  

  const renderSection = (section: FormSection, index: number) => {
    const gridClass =
      section.columns === 3
        ? 'grid grid-cols-1 md:grid-cols-3 gap-4'
        : section.columns === 2
        ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
        : 'grid grid-cols-1 gap-4';

    return (
      <div key={index} className="mb-6">
        {section.title && (
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">
            {section.title}
          </h3>
        )}
        {section.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {section.description}
          </p>
        )}
        <div className={gridClass}>
          {section.fields.map(renderField)}
        </div>
      </div>
    );
  };

  // 🚀 Formulaire principal
  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {activeSections.map((section, index) => renderSection(section, index))}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );

  // 🎯 Mode modal (si activé)
  if (isModal) {
    return (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 text-center">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onCancel}
          ></div>

          <div className="inline-block w-full max-w-4xl my-8 overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all dark:bg-gray-800">
            {/* 🧩 Header modal */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {modalTitle}
              </h3>
              {onCancel && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={onCancel}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* 🧠 Contenu modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {formContent}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🖼️ Sinon, rendu classique
  return formContent;
}
