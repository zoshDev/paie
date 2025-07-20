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
  | 'hidden'
  | 'rubriqueSelector'
  | 'expressionEditor'
  | "intervalEditor"
  | 'testResultConfig'

export interface SelectOption {
  value: string | number;
  label: string;
}

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
  validation?: any;
  dependsOn?: string;
  icon?: React.ReactNode;
  availableVariables?: string[];
  showWhen?: (values: any) => boolean;
  itemFields?: FormField[]
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
  columns?: 1 | 2 | 3;
}


export interface IntervalValue {
  base: number | string;
  tranches: {
    min: number;
    max: number;
    valeur: number;
  }[];
}

export interface TestResultValue {
  True: string;
  False: string;
}
