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
        type: 'select', // ✅ Affiche une liste déroulante
        required: true,
        options: [],    // ✅ Injectées dynamiquement dans le composant (useCategories)
      },
      {
        name: 'echelonId',
        label: 'Échelon',
        type: 'select', // ✅ Liste déroulante aussi
        required: true,
        options: [],    // ✅ Injectées dynamiquement via useEchelons
      }
    ]
  }
];
