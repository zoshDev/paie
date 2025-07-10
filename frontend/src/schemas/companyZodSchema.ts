import { z } from 'zod';


export const companyZodSchema = z.object({
    nom: z.string().min(2, 'Nom requis'),
    regime_fiscal: z.enum(['reel', 'simplifie', 'exonere'], {
      errorMap: () => ({ message: 'Régime fiscal invalide' })
    }),
    localisation: z.string().optional(),
  });

  export type CompanyFormData = z.infer<typeof companyZodSchema>;
