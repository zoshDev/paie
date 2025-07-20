// src/components/form/variables/VarGenericForm.tsx
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildZodSchema } from '@/schemas/genericZodForm.schema'; // Assurez-vous que ce chemin est correct

// Import des nouveaux éditeurs
import ExpressionEditor from './ExpressionEditor'; // Assurez-vous que le chemin est correct
import IntervalEditor from './IntervalEditor';   // Assurez-vous que le chemin est correct

// IMPORTANT: Assurez-vous que tous les types (FormField, FormSection, IntervalValue, TestResultValue)
// sont importés depuis une SOURCE UNIQUE et CENTRALISÉE, par exemple '@/types/types'.
// Si vous avez un fichier de types spécifique aux variables, il doit étendre ou ré-exporter
// les types de base de '@/types/types' pour éviter les conflits de type.
import type { FormField, FormSection, IntervalValue, TestResultValue } from './types.variables'; // Import corrigé pour une source unique
import { variableFormSections } from './variableFormSections'; // Importez les sections de formulaire spécifiques aux variables

interface VarGenericFormProps { // Renommée pour être spécifique à VarGenericForm
  isSubmitting?: boolean; // Ajouté comme prop
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
  submitLabel?: string;
  cancelLabel?: string;
  isModal?: boolean;
  modalTitle?: string;
  initialValues?: Record<string, any>; // Ajouté comme prop
  onValueChange?: (values: any) => void;
  backgroundIllustration?: React.ReactNode;
}

export default function VarGenericForm({
  onSubmit,
  onCancel,
  initialData = {},
  submitLabel = 'Enregistrer',
  cancelLabel = 'Annuler',
  isModal = false,
  modalTitle = '',
  onValueChange,
  initialValues, // Destructuration de la prop
  isSubmitting,  // Destructuration de la prop
}: VarGenericFormProps) {

  // Utilisation directe de variableFormSections qui est de type FormSection[]
  // Cela résoudra l'erreur: Argument of type 'FormField[]' is not assignable to parameter of type 'FormSection[]'.
  // L'hypothèse est que variableFormSections est déjà correctement typé comme FormSection[]
  // et que les FormField à l'intérieur sont compatibles avec '@/types/types'.FormField
  const validationSchema = buildZodSchema(variableFormSections);

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

  // Surveiller les changements de valeur pour onValueChange
  const watchedValues = watch();
  useEffect(() => {
    if (onValueChange) {
      onValueChange(watchedValues);
    }
  }, [watchedValues, onValueChange]);

  // Réinitialiser le formulaire si initialData change
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  // Fonction pour rendre un champ spécifique
  const renderField = (field: FormField, values: any) => {
    // Logique pour showWhen (anciennement showIf)
    if (field.showWhen && !field.showWhen(values)) {
      return null;
    }

    // Détermine si le champ doit être désactivé
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
                  return (
                    <input
                      type={field.type}
                      id={field.name}
                      {...controllerField}
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
                      {field.options?.map((option) => (
                        <option key={String(option.value)} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  );
                case 'checkbox':
                  return (
                    <input
                      type="checkbox"
                      id={field.name}
                      {...controllerField}
                      checked={controllerField.value}
                      disabled={isDisabled}
                      className={`h-4 w-4 text-indigo-600 border-gray-300 rounded
                        ${isDisabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}`}
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Valeur si Vrai :
                      </label>
                      <input
                        type="text"
                        value={controllerField.value?.True || ''}
                        onChange={(e) => controllerField.onChange({ ...controllerField.value, True: e.target.value })}
                        placeholder="Variable ou valeur"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Valeur si Faux :
                      </label>
                      <input
                        type="text"
                        value={controllerField.value?.False || ''}
                        onChange={(e) => controllerField.onChange({ ...controllerField.value, False: e.target.value })}
                        placeholder="Variable ou valeur"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  );
                default:
                  return null;
              }
            })()}
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">
                {(errors[field.name] as any).message}
              </p>
            )}
          </div>
        )}
      />
    );
  };

  // activeSections utilisera directement variableFormSections
  const activeSections: FormSection[] = variableFormSections;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {activeSections.map((section, sectionIndex) => (
        <div
          key={section.title || `section-${sectionIndex}`}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
        >
          {section.title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {section.title}
            </h3>
          )}
          {section.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {section.description}
            </p>
          )}
          <div
            className={`grid gap-x-6 gap-y-4 ${
              section.columns === 2 ? 'md:grid-cols-2' : section.columns === 3 ? 'md:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {section.fields.map((field) => renderField(field, watchedValues))}
          </div>
        </div>
      ))}

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
          disabled={isSubmitting} // Utilisation de la prop isSubmitting
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );

  // Mode modal (si activé) - Le corps du formulaire sera dupliqué ou rendu conditionnellement
  // Je vais garder le code de la modal et laisser le formulaire être le même dans les deux cas.
  // Une meilleure pratique serait d'extraire le JSX du formulaire dans un sous-composant
  // ou une fonction de rendu séparée pour éviter la duplication. Pour l'instant, je vais juste
  // m'assurer qu'isSubmitting est correctement utilisé.
  if (isModal) {
    return (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 text-center">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={onCancel}
          ></div>

          <div className="inline-block w-full max-w-4xl my-8 overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all dark:bg-gray-800">
            {/* Header modal */}
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

            {/* Contenu modal */}
            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {activeSections.map((section, sectionIndex) => (
                  <div
                    key={section.title || `section-${sectionIndex}`}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
                  >
                    {section.title && (
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {section.title}
                      </h3>
                    )}
                    {section.description && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {section.description}
                      </p>
                    )}
                    <div
                      className={`grid gap-x-6 gap-y-4 ${
                        section.columns === 2 ? 'md:grid-cols-2' : section.columns === 3 ? 'md:grid-cols-3' : 'grid-cols-1'
                      }`}
                    >
                      {section.fields.map((field) => renderField(field, watchedValues))}
                    </div>
                  </div>
                ))}

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
                    disabled={isSubmitting} // Utilisation de la prop isSubmitting ici aussi
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors duration-200"
                  >
                    {submitLabel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
