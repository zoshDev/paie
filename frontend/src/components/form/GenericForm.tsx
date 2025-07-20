import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildZodSchema } from '@/schemas/genericZodForm.schema';
import ExpressionEditor from '@/pages/variable/form/ExpressionEditor';
import IntervalEditor from '@/pages/variable/form/IntervalEditor';

import type {
  FormField,
  FormSection,
  IntervalValue,
  TestResultValue
} from '@/types/forms';

interface GenericFormProps {
  sections?: FormSection[];
  fields?: FormField[];
  isSubmitting?: boolean;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
  submitLabel?: string;
  cancelLabel?: string;
  isModal?: boolean;
  modalTitle?: string;
  initialValues?: Record<string, any>;
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
  initialValues,
  isSubmitting,
}: GenericFormProps) {
  const activeSections: FormSection[] = sections ?? [
    { title: '', fields: fields ?? [], columns: 1 },
  ];

  const allFields = activeSections.flatMap((s) => s.fields);
  const validationSchema = buildZodSchema(allFields);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    defaultValues: initialValues || initialData,
  });

  const watchedValues = watch();

  useEffect(() => {
    if (onValueChange) onValueChange(watchedValues);
  }, [watchedValues, onValueChange]);

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const renderField = (field: FormField, values: any) => {
    if (field.showWhen && !field.showWhen(values)) return null;

    const isDisabled = field.disabled || (values.typeVariable && (
      (field.name === 'formule' && values.typeVariable !== 'Calcul') ||
      (field.name === 'condition' && values.typeVariable !== 'Test') ||
      (field.name === 'intervalle' && values.typeVariable !== 'Intervalle') ||
      (field.name === 'valeur' && values.typeVariable !== 'Valeur') ||
      (field.name === 'valeurTestConfig' && values.typeVariable !== 'Test')
    ));

    return (
      <Controller
        key={field.name}
        name={field.name}
        control={control}
        render={({ field: controllerField }) => (
          <div className={`mb-4 ${field.fullWidth ? 'col-span-full' : ''}`}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
              {field.icon && <span className="ml-1">{field.icon}</span>}
            </label>

            {(() => {
              switch (field.type) {
                case 'text':
                case 'number':
                case 'email':
                case 'password':
                case 'date':
                  return (
                    <input
                      type={field.type}
                      id={field.name}
                      {...controllerField}
                      value={field.type === 'date' && typeof controllerField.value === 'string'
                        ? controllerField.value.split('T')[0]
                        : controllerField.value ?? ''}
                      onChange={(e) => controllerField.onChange(e.target.value)}
                      placeholder={field.placeholder}
                      disabled={isDisabled}
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                        ${isDisabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
                        dark:border-gray-600 dark:text-white`}
                    />
                  );
                case 'textarea':
                  return (
                    <textarea
                      id={field.name}
                      {...controllerField}
                      rows={field.rows || 3}
                      placeholder={field.placeholder}
                      disabled={isDisabled}
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                        ${isDisabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
                        dark:border-gray-600 dark:text-white`}
                    />
                  );
                case 'select':
                  return (
                    <select
                      id={field.name}
                      {...controllerField}
                      disabled={isDisabled}
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                        ${isDisabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
                        dark:border-gray-600 dark:text-white`}
                    >
                      <option value="">{field.placeholder || 'Sélectionner...'}</option>
                      {field.options?.map((opt) => (
                        <option key={String(opt.value)} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  );
                                  case 'multiselect':
                  return (
                    <select
                      id={field.name}
                      {...controllerField}
                      multiple
                      value={Array.isArray(controllerField.value) ? controllerField.value.map(String) : []}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                        controllerField.onChange(selectedOptions);
                      }}
                      disabled={isDisabled}
                      className={`mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                        ${isDisabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
                        dark:border-gray-600 dark:text-white`}
                    >
                      {field.options?.map((opt) => (
                        <option key={String(opt.value)} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  );
                case 'checkbox':
                  return (
                    <Controller
                      name={field.name}
                      control={control}
                      render={({ field: f }) => (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={field.name}
                            checked={f.value ?? false}
                            onChange={f.onChange}
                            disabled={isDisabled}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500
                              dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          />
                          <label htmlFor={field.name} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                        </div>
                      )}
                    />
                  );

                case 'expressionEditor':
                  return (
                    <ExpressionEditor
                      value={controllerField.value || ''}
                      onChange={controllerField.onChange}
                      availableVariables={field.availableVariables}
                      placeholder={field.placeholder}
                      className={`${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                  );

                case 'intervalEditor':
                  return (
                    <IntervalEditor
                      value={controllerField.value || { base: 0, tranches: [] } as IntervalValue}
                      onChange={controllerField.onChange}
                      className={`${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                  );

                case 'testResultConfig':
                  return (
                    <div className={`space-y-2 ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valeur si Vrai :</label>
                      <input
                        type="text"
                        value={controllerField.value?.True || ''}
                        onChange={(e) =>
                          controllerField.onChange({ ...controllerField.value, True: e.target.value })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valeur si Faux :</label>
                      <input
                        type="text"
                        value={controllerField.value?.False || ''}
                        onChange={(e) =>
                          controllerField.onChange({ ...controllerField.value, False: e.target.value })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  );

                default:
                  return null;
              }
            })()}

            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {(errors[field.name] as any).message}
              </p>
            )}
          </div>
        )}
      />
    );
  };

  const renderFormSections = () => (
    <>
      {activeSections.map((section, index) => (
        <div
          key={section.title || `section-${index}`}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          {section.title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {section.title}
            </h3>
          )}
          {section.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {section.description}
            </p>
          )}
          <div
            className={`grid gap-x-6 gap-y-4 ${
              section.columns === 2 ? 'md:grid-cols-2' :
              section.columns === 3 ? 'md:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {section.fields.map((field) => renderField(field, watchedValues))}
          </div>
        </div>
      ))}
    </>
  );

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {renderFormSections()}
      <div className="flex justify-end space-x-4 mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 text-center">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onCancel}
          ></div>
          <div className="inline-block w-full max-w-4xl my-8 overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all dark:bg-gray-800">
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
            <div className="p-6">{formContent}</div>
          </div>
        </div>
      </div>
    );
  }

  return formContent;
}

