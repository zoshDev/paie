import { z } from 'zod';

// 🔧 Schéma Zod aligné strictement au backend
export const elementSalaireSchema = z.object({
  societeId: z.coerce.number().min(1, 'ID Société requis'),
  variableId: z.coerce.number().min(1, 'ID Variable requis'),
  libelle: z.string().min(1, 'Le libellé est obligatoire'),
  type_element: z.enum(['prime', 'retenue']),
  nature: z.enum(['fixe', 'variable']),
  imposable: z.boolean(),
  soumisCnps: z.boolean(),
  partEmploye: z.boolean(),
  partEmployeur: z.boolean(),
  prorataBase: z.coerce.number().min(0, 'Valeur minimale : 0'),
  processCalculJson: z.record(z.any()).optional().default({}),
});
