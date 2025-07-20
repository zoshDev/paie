// 🔖 Ce fichier définit les sections de champs utilisés par GenericForm
import type { FieldType,FormSection} from "@/components/form/types";
import { companyService } from "@/services/companyService";
import { variableService } from "../variable/variableService";



export const elementSalaireFormSections : FormSection[] = [
  {
    title: "🔹 Liaison métier",
    columns: 2,
    fields: [
      { name: "variableId", label: "ID Variable", type: "select" as FieldType },
      { name: "societeId", label: "ID Société", type: "select" as FieldType },
    ],
  },
  {
    title: "🔹 Caractéristiques de l’élément",
    columns: 2,
    fields: [
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
        type: "select" as FieldType,
        options: [
          { label: "Fixe", value: "fixe" },
          { label: "Variable", value: "variable" },
        ],
      },
      { name: "prorataBase", label: "Prorata Base", type: "number" as FieldType },
    ],
  },
  {
    title: "🔹 Statuts fiscaux et sociaux",
    columns: 2,
    fields: [
      { name: "imposable", label: "Imposable", type: "checkbox" as FieldType },
      { name: "soumisCnps", label: "Soumis à la CNPS", type: "checkbox" as FieldType },
      { name: "partEmploye", label: "Part Employé", type: "checkbox" as FieldType },
      { name: "partEmployeur", label: "Part Employeur", type: "checkbox" as FieldType },
    ],
  },
  {
    title: "🔹 Processus de calcul",
    columns: 1,
    fields: [
      {
        name: "processCalculJson",
        label: "Formule de Calcul (JSON brut)",
        type: "textarea" as FieldType,
        placeholder: '{ "operation": "multiplication", "value": 0.1 }',
      },
    ],
  },
];