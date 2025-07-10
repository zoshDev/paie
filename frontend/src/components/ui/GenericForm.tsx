import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { XMarkIcon } from '@heroicons/react/24/outline';
//
import buildZodSchema from "../../src/schemas/genericZodForm"

// Define the field types supported by the form
export type FieldType = 
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'date'
  | 'hidden';

// Interface for options in select fields
export interface SelectOption {
  value: string | number;
  label: string;
}

// Interface for form field definition
export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  defaultValue?: any;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  cols?: number;
  disabled?: boolean;
  hidden?: boolean;
  fullWidth?: boolean;
  validation?: any; // Yup validation rules
  dependsOn?: string; // Field that this field depends on
  icon?: React.ReactNode; // Optional icon for the field
  showWhen?: (values: any) => boolean; // Function to determine if field should be shown
}

// Interface for section definition
export interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
  columns?: 1 | 2 | 3; // Number of columns in the grid
}

// Props for the GenericForm component
interface GenericFormProps {
  sections?: FormSection[];
  field?: FormField[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
  submitLabel?: string;
  cancelLabel?: string;
  isModal?: boolean;
  modalTitle?: string;
  onValueChange?: (values: any) => void;
}

/**
 * A generic form component that generates a form based on the provided fields.
 * Supports various field types, validation, and layout options.
 */
export default function GenericForm({
  sections,
  onSubmit,
  onCancel,
  initialData = {},
  submitLabel = 'Enregistrer',
  cancelLabel = 'Annuler',
  isModal = false,
  modalTitle = '',
  onValueChange,
}: GenericFormProps) {
  // Build the validation schema dynamically based on field definitions
  const validationSchema = buildValidationSchema(sections);
  const schema = buildZodSchema(sections)
  
  // Set up form with validation
  const { 
    control, 
    handleSubmit, 
    reset, 
    watch, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialData
  });

  // Watch all form values for dependencies
  const formValues = watch();
  
  // Call onValueChange when form values change
  useEffect(() => {
    if (onValueChange) {
      onValueChange(formValues);
    }
  }, [formValues, onValueChange]);

  // Reset form with initial data when it changes
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  // Determine if a field should be shown based on dependencies
  const shouldShowField = (field: FormField) => {
    if (!field.dependsOn && !field.showWhen) return true;
    
    if (field.dependsOn) {
      const dependentValue = formValues[field.dependsOn];
      return !!dependentValue;
    }
    
    if (field.showWhen) {
      return field.showWhen(formValues);
    }
    
    return true;
  };

  // Render a specific form field based on its type
  const renderField = (field: FormField) => {
    if (!shouldShowField(field)) return null;

    if (field.hidden) {
      return (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          defaultValue={field.defaultValue || ''}
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

    const fieldContent = () => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
          return (
            <Controller
              name={field.name}
              control={control}
              defaultValue={field.defaultValue || ''}
              render={({ field: { onChange, value } }) => (
                <input
                  type={field.type}
                  onChange={onChange}
                  value={value || ''}
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
              defaultValue={field.defaultValue || ''}
              render={({ field: { onChange, value } }) => (
                <input
                  type="number"
                  onChange={onChange}
                  value={value}
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
              defaultValue={field.defaultValue || ''}
              render={({ field: { onChange, value } }) => (
                <textarea
                  onChange={onChange}
                  value={value || ''}
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
              defaultValue={field.defaultValue || ''}
              render={({ field: { onChange, value } }) => (
                <select
                  onChange={onChange}
                  value={value}
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
              defaultValue={field.defaultValue || []}
              render={({ field: { onChange, value } }) => (
                <select
                  multiple
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                    onChange(selectedOptions);
                  }}
                  value={value || []}
                  disabled={field.disabled}
                  className={commonClasses}
                  size={4}
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
              defaultValue={field.defaultValue || false}
              render={({ field: { onChange, value } }) => (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={onChange}
                    checked={value || false}
                    disabled={field.disabled}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              )}
            />
          );
          
        case 'date':
          return (
            <Controller
              name={field.name}
              control={control}
              defaultValue={field.defaultValue || ''}
              render={({ field: { onChange, value } }) => (
                <input
                  type="date"
                  onChange={onChange}
                  value={value || ''}
                  disabled={field.disabled}
                  className={commonClasses}
                />
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
          
          {fieldContent()}
          
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

  // Render form sections with fields
  const renderSection = (section: FormSection, index: number) => {
    const gridClass = section.columns === 1 
      ? '' 
      : section.columns === 2 
        ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
        : 'grid grid-cols-1 md:grid-cols-3 gap-4';

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
          {section.fields.map(field => renderField(field))}
        </div>
      </div>
    );
  };

  // Main form component
  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {sections.map((section, index) => renderSection(section, index))}
      
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

  // If it's a modal, wrap the form in a modal container
  if (isModal) {
    return (
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 text-center">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onCancel}></div>
          
          <div className="inline-block w-full max-w-4xl my-8 overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all dark:bg-gray-800">
            {/* Header */}
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
            
            {/* Modal content */}
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {formContent}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise just return the form
  return formContent;
}

// Helper function to build a Yup validation schema from field definitions
function buildValidationSchema(sections: FormSection[]) {
  const schemaShape: Record<string, any> = {};
  
  // Collect all fields from all sections
  const fields = sections.flatMap(section => section.fields);
  
  // Build schema for each field
  fields.forEach(field => {
    // Start with the field's own validation if provided
    if (field.validation) {
      schemaShape[field.name] = field.validation;
      return;
    }
    
    // Otherwise, build based on field type and required status
    let schema;
    
    switch (field.type) {
      case 'number':
        schema = yup.number().typeError('Doit être un nombre');
        if (field.min !== undefined) schema = schema.min(field.min, `Minimum ${field.min}`);
        if (field.max !== undefined) schema = schema.max(field.max, `Maximum ${field.max}`);
        break;
        
      case 'email':
        schema = yup.string().email('Adresse email invalide');
        break;
        
      case 'date':
        schema = yup.date().typeError('Date invalide');
        break;
        
      case 'checkbox':
        schema = yup.boolean();
        break;
        
      case 'multiselect':
        schema = yup.array().of(yup.string());
        break;
        
      default:
        schema = yup.string();
    }
    
    // Add required validation if needed
    if (field.required) {
      schema = schema.required(`${field.label} est requis`);
    }
    
    schemaShape[field.name] = schema;
  });
  
  return yup.object().shape(schemaShape);
} 