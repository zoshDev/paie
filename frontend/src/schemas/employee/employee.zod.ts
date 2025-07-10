import { z } from 'zod';

/** 🛡️ Sous-schéma pour un rôle */
const roleSchema = z.object({
  id: z.coerce.number().min(1, 'Rôle requis'),
  name: z.string().min(5, 'Nom du rôle requis'),
});

/** 📄 Schéma principal pour le formulaire employé */
export const employeeZodSchema = z.object({
  // Identité
  matricule: z.string().min(4, 'Matricule requis'),
  pseudo: z.string().min(4, 'Pseudo requis'),
  password: z.string().min(6, 'Mot de passe trop court'),

  // Informations sociales
  statutFamilial: z.string().min(5, 'Statut familial requis'),
  nbEnfants: z.coerce.number().min(0, 'Nombre d\'enfants requis'),
  nationalite: z.string().min(1, 'Nationalité requise'),
  estLoge: z.coerce.boolean(),

  // Liens métier
  societeId: z.coerce.number().min(1, 'Société requise'),
  categorieEchelonId: z.coerce.number().min(1, 'Catégorie Échelon requis'),

  // Rôles
  roleId: z.array(roleSchema).min(1, 'Au moins un rôle requis'),
});

export type EmployeeFormData = z.infer<typeof employeeZodSchema>;
