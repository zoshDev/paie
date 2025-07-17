import type { FormField } from "../form/types";

const generationFields: FormField[] = [
  {
    name: 'mois',
    label: 'Mois',
    type: 'number',
    placeholder: 'Ex: 7',
    min: 1,
    max: 12,
    required: true,
  },
  {
    name: 'annee',
    label: 'Année',
    type: 'number',
    placeholder: 'Ex: 2025',
    required: true,
  },
  {
    name: 'rubriques',
    label: 'Éléments de salaire',
    type: 'rubriqueSelector', // ← Champ personnalisé
    required: true,
  },
];

export default generationFields;