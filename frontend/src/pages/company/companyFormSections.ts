import type { FormSection } from '@/components/form/types';

export const companyFormSections: FormSection[] = [
  {
    title: 'Informations Société',
    columns: 2,
    fields: [
      {
        name: 'nom',
        label: 'Nom',
        type: 'text', // ✅ aligné avec FieldType
        required: true
      },
      {
        name: 'regime_fiscal',
        label: 'Régime Fiscal',
        type: 'select', // ✅ pas juste 'string'
        required: true,
        options: [
          { label: 'Réel', value: 'reel' },
          { label: 'Simplifié', value: 'simplifie' },
          { label: 'Exonéré', value: 'exonere' }
        ]
      },
      {
        name: 'localisation',
        label: 'Localisation',
        type: 'text', // ✅ et non 'string'
        required: false
      }
    ]
  }
];
