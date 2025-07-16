// 🔖 Ce fichier définit les sections de champs utilisés par GenericForm
import type { FieldType } from "@/components/form/types";

export const elementSalaireFormSections = [
  {
    title: "Informations générales",
    columns: 2 as const, // ⬅️ Disposition en 2 colonnes
    fields: [
      { name: "societeId", label: "ID Société", type: "number" as FieldType },
      { name: "variableId", label: "ID Variable", type: "number" as FieldType },
      { name: "libelle", label: "Libellé", type: "text" as FieldType },
      {
        name: "type_element",
        label: "Type d’élément",
        type: "select" as FieldType,
        options: [
          { label: "Prime", value: "prime" },
          { label: "Retenue", value: "retenue" },
        ],
      },
      {
        name: "nature",
        label: "Nature",
        type: "select"  as FieldType,
        options: [
          { label: "Fixe", value: "fixe" },
          { label: "Variable", value: "variable" },
        ],
      },
      { name: "imposable", label: "Imposable", type: "checkbox" as FieldType },
      { name: "soumisCnps", label: "Soumis à la CNPS", type: "checkbox" as FieldType },
      { name: "partEmploye", label: "Part Employé", type: "checkbox" as FieldType },
      { name: "partEmployeur", label: "Part Employeur", type: "checkbox" as FieldType },
      { name: "prorataBase", label: "Prorata Base", type: "number" as FieldType },
      {
        name: "processCalculJson",
        label: "Formule de Calcul (JSON brut)",
        type: "textarea" as FieldType,
        placeholder: '{ "operation": "multiplication", "value": 0.1 }',
      },
    ],
  },
];
