// src/types/types.ts

import React from 'react'; // Importez React pour React.ReactNode

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
  | 'expressionEditor' // <-- Nouveau type pour l'éditeur d'expressions
  | 'intervalEditor'   // <-- Nouveau type pour l'éditeur d'intervalles
  | 'testResultConfig'; // <-- Nouveau type pour la configuration Vrai/Faux du test

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
  validation?: any; // Pour les règles de validation spécifiques (Zod, etc.)
  dependsOn?: string; // Pour les dépendances de champs
  icon?: React.ReactNode;
  showWhen?: (values: any) => boolean; // Logique conditionnelle d'affichage
  itemFields?: FormField[]; // Pour les champs répétables (comme les tranches d'intervalle)
  
  // Propriétés spécifiques pour expressionEditor
  availableVariables?: string[]; 
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
  columns?: 1 | 2 | 3;
}

// Interfaces spécifiques pour les éditeurs complexes
export interface Tranche {
  min: number;
  max: number;
  valeur: number;
}

export interface IntervalValue {
  base: number | string;
  tranches: Tranche[];
}

export interface TestResultValue {
  True: string; // Peut être une variable ou une valeur fixe
  False: string; // Peut être une variable ou une valeur fixe
}
