export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'date'
  | 'hidden'
  | 'multiselect'
  | 'rubriqueSelector'; // ← extension métier personnalisée

export interface FormOption {
  label: string;
  value: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  options?: FormOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  hidden?: boolean;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  fullWidth?: boolean;
}

export interface FormSection {
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3;
  fields: FormField[];
}
