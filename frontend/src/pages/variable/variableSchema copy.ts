import { z } from "zod";

//
// 🔹 Étape 1 : Enums métier — types de logique des variables
//
export const TypeVariableEnum = z.enum([
  "Valeur",
  "Calcul",
  "Test",
  "Intervalle"
]);

//
// 🔹 Étape 2 : Tranches INTERVALLE
//
const TrancheSchema = z
  .object({
    min: z.number(),
    max: z.number(),
    valeur: z.number()
  })
  .superRefine((data, ctx) => {
    if (data.max <= data.min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max"],
        message: "max doit être strictement supérieur à min"
      });
    }
  });

//
// 🔹 Étape 3 : Schéma principal de la variable
//
export const VariableSchema = z.object({
  id: z.number().optional(),

  // 🧾 Métadonnées
  nom: z.string().min(2, "Le nom est requis"),
  description: z.string().optional(),
  code: z.number().int(),
  societeId: z.number().int(),

  // 🧠 Typage logique
  typeVariable: TypeVariableEnum,

  // 🔹 Valeur simple
  valeur: z.string().optional(),

  // 🔹 Formule pour type "Calcul"
  formule: z.string().optional(),

  // 🔹 TEST conditionnel
  condition: z
    .object({
      expression: z.string(),
      valeur: z.object({
        True: z.string(),
        False: z.string()
      })
    })
    .optional(),

  // 🔹 INTERVALLE métier
  intervalle: z
    .object({
      base: z.number(),
      tranches: z.array(TrancheSchema).min(1, "Au moins une tranche")
    })
    .optional()
});

//
// 🔹 Étape 4 : Validation métier selon le type
//
export const VariableSchemaWithRules = VariableSchema.superRefine((data, ctx) => {
  switch (data.typeVariable) {
    case "Valeur":
      if (!data.valeur || data.valeur.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["valeur"],
          message: "Valeur requise pour le type 'Valeur'"
        });
      }
      break;

    case "Calcul":
      if (!data.formule || data.formule.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["formule"],
          message: "Formule requise pour le type 'Calcul'"
        });
      }
      break;

    case "Test":
      const c = data.condition;
      if (!c?.expression || !c.valeur?.True || !c.valeur?.False) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["condition"],
          message: "Champ condition incomplet pour le type 'Test'"
        });
      }
      break;

    case "Intervalle":
      const i = data.intervalle;
      if (!i?.base || !i.tranches || i.tranches.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["intervalle"],
          message: "Structure INTERVALLE requise avec base + tranches"
        });
      }
      break;
  }
});
