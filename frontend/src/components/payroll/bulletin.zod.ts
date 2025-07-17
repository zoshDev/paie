import { z } from 'zod';

export const bulletinSchema = z.object({
  employeId: z.number().int().positive({ message: "Employé requis" }),
  mois: z.number().min(1).max(12, { message: "Mois entre 1 et 12" }),
  annee: z.number().min(2000).max(2100, { message: "Année invalide" }),
  elementSalaire: z.array(z.string()).min(1, { message: "Au moins un élément de salaire est requis" }),
});
export type BulletinFormData = z.infer<typeof bulletinSchema>;