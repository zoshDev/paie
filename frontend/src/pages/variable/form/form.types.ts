import type { JSX } from "react";
type BaseFieldType = 
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'textarea'
  | 'radio'
  | 'custom'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'date'
  | 'hidden'
  | 'rubriqueSelector'
  | 'fixed'
  | 'formula'
  | 'test'
  | 'interval'
  | 'expressionEditor'
  | "testResultConfig"
  | "intervalEditor"

export interface FormField {
  name: string;
  label: string;
  type: BaseFieldType;
  required?: boolean;
  placeholder?: string;

  dependsOn?: string; // Pour les dépendances de champs
  icon?: React.ReactNode;
  showWhen?: (values: any) => boolean; // Logique conditionnelle d'affichage

  options?: { value: string; label: string }[]; // for select, radio, multiselect
  component?: JSX.Element | (() => JSX.Element);

}

export interface FormSection {
  title: string;
  columns?: number;
  fields: FormField[];
}

