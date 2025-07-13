import { z } from 'zod';

export const profilPaieZodSchema = z.object({
  roleName: z.string().min(3, 'Nom du rôle requis'),
  description: z.string().optional(),
  categorie: z.string().optional(),
  elements: z.array(z.object({
    id: z.string(),
    libelle: z.string(),
    code: z.string(),
    type_element: z.string(),
    nature: z.string(),
    imposable: z.boolean().optional(),
    ordre: z.number().optional()
  })).min(1, 'Au moins un élément de salaire requis')
});

export type RoleProfilPaieFormData = z.infer<typeof profilPaieZodSchema>;
