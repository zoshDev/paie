import { z } from "zod";

export const variableFormSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  valeur: z.string().min(1, "La valeur est requise"),
  typeVariable: z.enum(["Calcul", "Affichage", "Constante"]),
  code: z.coerce.number().min(0, "Code requis"),
  formule: z.string().optional(),
  societeId: z.coerce.number().min(1, "Société ID requis"),
  condition: z.record(z.unknown()).optional(),
  intervalle: z.record(z.unknown()).optional(),
  id: z.coerce.number().optional(), // peut être ignoré à la création
});

export type VariableFormValues = z.infer<typeof variableFormSchema>;


condition: z.string().refine((val) => {
  try {
    const parsed = JSON.parse(val);
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
}, { message: "Le JSON est invalide" })
