import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Filter field types
export type FilterFieldType = 
  | 'text'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'date'
  | 'daterange'
  | 'number'
  | 'numberrange';

// Interface for options in select fields
export interface FilterOption {
  value: string | number | boolean;
  label: string;
}

// Filter field definition
export interface FilterField {
  name: string;
  label: string;
  type: FilterFieldType;
  options?: FilterOption[];
  placeholder?: string;
  defaultValue?: any;
}

// Filter props
interface GenericFilterProps {
  fields: FilterField[];
  filter: Record<string, any>;
  onFilterChange: (filter: Record<string, any>) => void;
  onClose: () => void;
  title?: string;
}

/**
 * A generic filter component that can be used with the GenericListPage
 * to filter data based on various criteria.
 */
export default function GenericFilter({
  fields,
  filter,
  onFilterChange,
  onClose,
  title = 'Filtres',
}: GenericFilterProps) {
  // State for tracking temporary filter values before applying
  const [tempFilter, setTempFilter] = useState<Record<string, any>>({ ...filter });
  
  // Handle filter change
  const handleFilterChange = (name: string, value: any) => {
    setTempFilter({
      ...tempFilter,
      [name]: value,
    });
  };
  
  // Apply filters
  const handleApply = () => {
    onFilterChange(tempFilter);
  };
  
  // Reset filters
  const handleReset = () => {
    const resetFilter: Record<string, any> = {};
    
    // Reset to default values
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        resetFilter[field.name] = field.defaultValue;
      } else {
        resetFilter[field.name] = 
          field.type === 'multiselect' ? [] : 
          field.type === 'checkbox' ? false : 
          field.type === 'select' && field.options?.length ? field.options[0].value : 
          '';
      }
    });
    
    setTempFilter(resetFilter);
    onFilterChange(resetFilter);
  };
  
  // Count active filters
  const activeFilterCount = Object.entries(filter).filter(([key, value]) => {
    // Skip if not a valid filter field
    if (!fields.find(f => f.name === key)) return false;
    
    // Check if value is non-default
    const field = fields.find(f => f.name === key);
    if (!field) return false;
    
    if (field.defaultValue !== undefined) {
      return value !== field.defaultValue;
    }
    
    if (field.type === 'multiselect') {
      return Array.isArray(value) && value.length > 0;
    }
    
    if (field.type === 'checkbox') {
      return value === true;
    }
    
    if (field.type === 'select' && field.options?.length) {
      return value !== field.options[0].value;
    }
    
    return value !== '';
  }).length;
  
  // Render a filter field based on its type
  const renderFilterField = (field: FilterField) => {
    const value = tempFilter[field.name] !== undefined ? tempFilter[field.name] : field.defaultValue;
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleFilterChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
        );
        
      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFilterChange(field.name, e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          >
            {field.options?.map((option) => (
              <option key={option.value.toString()} value={option.value.toString()}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'multiselect':
        return (
          <select
            multiple
            value={value || []}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
              handleFilterChange(field.name, selectedOptions);
            }}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            size={4}
          >
            {field.options?.map((option) => (
              <option key={option.value.toString()} value={option.value.toString()}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center mt-1">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleFilterChange(field.name, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {field.placeholder || 'Activé'}
            </label>
          </div>
        );
        
      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleFilterChange(field.name, e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          />
        );
        
      case 'daterange':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={(value && value.from) || ''}
              onChange={(e) => handleFilterChange(field.name, { ...value, from: e.target.value })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              placeholder="De"
            />
            <span className="text-gray-500">à</span>
            <input
              type="date"
              value={(value && value.to) || ''}
              onChange={(e) => handleFilterChange(field.name, { ...value, to: e.target.value })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              placeholder="À"
            />
          </div>
        );
        
      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleFilterChange(field.name, e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            placeholder={field.placeholder}
          />
        );
        
      case 'numberrange':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={(value && value.from) || ''}
              onChange={(e) => handleFilterChange(field.name, { 
                ...value, 
                from: e.target.value === '' ? '' : parseFloat(e.target.value) 
              })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              placeholder="Min"
            />
            <span className="text-gray-500">à</span>
            <input
              type="number"
              value={(value && value.to) || ''}
              onChange={(e) => handleFilterChange(field.name, { 
                ...value, 
                to: e.target.value === '' ? '' : parseFloat(e.target.value) 
              })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              placeholder="Max"
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Main filter component
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          {title}
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
          aria-label="Fermer"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
            </label>
            {renderFilterField(field)}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={handleReset}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Réinitialiser
        </button>
        <button
          onClick={handleApply}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Appliquer
        </button>
      </div>
    </div>
  );
} 