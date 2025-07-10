import { z } from 'zod';
import type { FormSection } from '@/components/form/types';

export const categorieEchelonSchema = z.object({
  categorieId: z.string().min(1, 'Catégorie requise'),
  echelonId: z.string().min(1, 'Échelon requis'),
});

export const categorieEchelonFormSections: FormSection[] = [
  {
    title: 'Association Catégorie / Échelon',
    fields: [
      {
        name: 'categorieId',
        label: 'Catégorie',
        type: 'text',
        required: true,
        options: [], // injectées dynamiquement au moment du rendu
      },
      {
        name: 'echelonId',
        label: 'Échelon',
        type: 'text',
        required: true,
        options: [],
      }
    ]
  }
];
