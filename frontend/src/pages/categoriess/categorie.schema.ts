import { z } from 'zod';
import type { FormSection } from '@/components/form/types';

export const categorieSchema = z.object({
  libelle: z.string().min(1, 'Le libellé est requis'),
});

export const categorieFormSections: FormSection[] = [
  {
    title: 'Informations générales',
    fields: [
      {
        name: 'libelle',
        label: 'Libellé',
        type: 'text',
        required: true
      }
    ]
  }
];
