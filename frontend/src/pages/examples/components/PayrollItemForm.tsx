import { useEffect, useMemo } from 'react';
import * as yup from 'yup';
import type { FormSection } from '../../../components/ui/GenericForm';
import type { PayrollItem } from '../../../models/payrollItems';

export const getPayrollItemFormSections = (
  isEdit: boolean, 
  item: PayrollItem | null,
  allItems: PayrollItem[],
): FormSection[] => {
  // Filter out current item from available base items list
  const availableBaseItems = allItems
    .filter(i => !item || i.id !== item.id)
    .map(i => ({
      value: i.id,
      label: `${i.code} - ${i.name}`
    }));

  // Generate form sections with fields
  const sections: FormSection[] = [
    {
      title: "Informations générales",
      columns: 2,
      fields: [
        {
          name: "name",
          label: "Nom",
          type: "text",
          required: true,
          placeholder: "Nom de la rubrique",
          validation: yup.string().required("Le nom est requis"),
          fullWidth: true
        },
        {
          name: "code",
          label: "Code",
          type: "text",
          required: true,
          placeholder: "Code unique (ex: BASSAL)",
          validation: yup.string().required("Le code est requis").max(10, "10 caractères maximum"),
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Description détaillée de la rubrique",
          fullWidth: true
        },
        {
          name: "type",
          label: "Type",
          type: "select",
          required: true,
          options: [
            { value: "earning", label: "Gain" },
            { value: "deduction", label: "Déduction" }
          ]
        },
        {
          name: "payer",
          label: "Payeur",
          type: "select",
          required: true,
          options: [
            { value: "employee", label: "Employé" },
            { value: "employer", label: "Employeur" },
            { value: "both", label: "Les deux" }
          ]
        },
        {
          name: "order",
          label: "Ordre d'affichage",
          type: "number",
          min: 1,
          defaultValue: allItems.length + 1
        },
        {
          name: "isActive",
          label: "Actif",
          type: "checkbox",
          defaultValue: true
        },
        {
          name: "isDefault",
          label: "Par défaut",
          type: "checkbox",
          defaultValue: false
        }
      ]
    },
    {
      title: "Méthode de calcul",
      columns: 2,
      fields: [
        {
          name: "calculationMethod",
          label: "Méthode de calcul",
          type: "select",
          required: true,
          options: [
            { value: "fixed", label: "Montant fixe" },
            { value: "percentage", label: "Pourcentage" },
            { value: "progressive", label: "Barème progressif" },
            { value: "formula", label: "Formule personnalisée" }
          ],
          fullWidth: true
        },
        // Fields for fixed amount calculation
        {
          name: "amount",
          label: "Montant",
          type: "number",
          step: 0.01,
          placeholder: "Montant fixe",
          dependsOn: "calculationMethod",
          showWhen: (values) => values.calculationMethod === "fixed",
          fullWidth: true
        },
        // Fields for percentage calculation
        {
          name: "percentage",
          label: "Pourcentage (%)",
          type: "number",
          step: 0.01,
          min: 0,
          max: 100,
          placeholder: "Ex: 10.5",
          dependsOn: "calculationMethod",
          showWhen: (values) => values.calculationMethod === "percentage",
        },
        {
          name: "baseItemIds",
          label: "Rubriques de base",
          type: "multiselect",
          options: availableBaseItems,
          dependsOn: "calculationMethod",
          showWhen: (values) => values.calculationMethod === "percentage",
          fullWidth: true
        },
        // Fields for formula calculation
        {
          name: "formula",
          label: "Formule personnalisée",
          type: "textarea",
          placeholder: "Ex: BASSAL * 0.1 + TRANS",
          rows: 3,
          dependsOn: "calculationMethod",
          showWhen: (values) => values.calculationMethod === "formula",
          fullWidth: true
        }
      ]
    }
  ];

  // Additional fields for "both" payer type
  const bothPayerFields = [
    {
      name: "employeeRate",
      label: "Taux employé (%)",
      type: "number" as const,
      step: 0.01,
      min: 0,
      placeholder: "Ex: 2.8",
      dependsOn: "payer",
      showWhen: (values: any) => values.payer === "both"
    },
    {
      name: "employerRate",
      label: "Taux employeur (%)",
      type: "number" as const,
      step: 0.01,
      min: 0,
      placeholder: "Ex: 4.2",
      dependsOn: "payer",
      showWhen: (values: any) => values.payer === "both"
    }
  ];

  // Add both payer fields to the first section
  sections[0].fields.push(...bothPayerFields);

  return sections;
};

export const formatPayrollItemForSubmit = (data: any): Omit<PayrollItem, 'id'> => {
  const formattedData: Partial<PayrollItem> = {
    ...data,
    // Convert string values to appropriate types
    amount: data.amount ? parseFloat(data.amount) : undefined,
    percentage: data.percentage ? parseFloat(data.percentage) : undefined,
    employeeRate: data.employeeRate ? parseFloat(data.employeeRate) : undefined,
    employerRate: data.employerRate ? parseFloat(data.employerRate) : undefined,
    order: data.order ? parseInt(data.order) : 1,
  };

  // Clean up fields based on calculation method
  if (data.calculationMethod !== 'fixed') {
    delete formattedData.amount;
  }
  
  if (data.calculationMethod !== 'percentage') {
    delete formattedData.percentage;
    delete formattedData.baseItemIds;
  }
  
  if (data.calculationMethod !== 'formula') {
    delete formattedData.formula;
  }
  
  if (data.calculationMethod !== 'progressive') {
    delete formattedData.progressiveRates;
  }

  // Clean up fields based on payer type
  if (data.payer !== 'both') {
    delete formattedData.employeeRate;
    delete formattedData.employerRate;
  }

  return formattedData as Omit<PayrollItem, 'id'>;
}; 