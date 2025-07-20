import { z } from "zod";

// Validation : mois au format "01" à "12", année = année en cours uniquement
export const generateBulletinSchema = z.object({
  mois: z.string().regex(/^(0[1-9]|1[0-2])$/, {
    message: "Le mois doit être entre 01 et 12",
  }),
  annee: z.string().refine((val) => {
    const current = new Date().getFullYear();
    return parseInt(val, 10) === current;
  }, {
    message: `L'année doit être exactement ${new Date().getFullYear()}`,
  }),
});
