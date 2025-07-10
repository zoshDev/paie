import React from "react";

/** Type de colonne générique pour tous les tableaux */
export interface Column<T> {
  header: string;
  key: keyof T;
  isSelection?: boolean;
  isActions?: boolean;
  renderCell?: (item: T) => React.ReactNode;
}

/** Type d'un champ de formulaire générique */
export interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "select" | "textarea";
  options?: { label: string; value: string }[];
  required?: boolean;
  icon?: React.ReactNode;
  condition?: (values: Record<string, any>) => boolean;
}

/** Groupe de champs (section) pour GenericForm */
export interface FormSection {
  title?: string;
  fields: FormField[];
}

/** Type d'entité générique pour les modales et tableaux */
export interface Entity {
  id: string;
  [key: string]: any;
}
