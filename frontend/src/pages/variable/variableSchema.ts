import { z } from "zod";

//
// 🔹 Étape 1 — Enum métier : typeVariable
//
export const TypeVariableEnum = z.enum([
  "Valeur",
  "Calcul",
  "Test",
  "Intervalle",
]);

//
// 🔹 Étape 2 — Structures typées : Tranche, Condition, Intervalle
//

export const TrancheSchema = z
  .object({
    min: z.number(),
    max: z.number(),
    valeur: z.number(),
  })
  .superRefine((data, ctx) => {
    if (data.max <= data.min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max"],
        message: "max doit être strictement supérieur à min",
      });
    }
  });

export const IntervalleSchema = z.object({
  base: z.union([z.string(), z.number()]), // Valeur ou nom de variable
  tranches: z.array(TrancheSchema).min(1, "Au moins une tranche"),
});

export const TestResultSchema = z.object({
  True: z.string().min(1, "Valeur requise si vrai"),
  False: z.string().min(1, "Valeur requise si faux"),
});

export const ConditionSchema = z.object({
  expression: z.string().min(3, "Expression de test requise"),
  valeur: TestResultSchema,
});

//
// 🔹 Étape 3 — Schéma principal
//
export const VariableSchema = z.object({
  id: z.number().optional(),

  // 🧾 Métadonnées
  nom: z.string().min(2, "Nom requis"),
  description: z.string().optional(),
  code: z.number().int(),
  societeId: z.number().int(),

  // 🧠 Typage logique
  typeVariable: TypeVariableEnum,

  // 🔹 Champs métier (optionnels mais validés plus bas)
  valeur: z.string().optional(),
  formule: z.string().optional(),
  condition: ConditionSchema.optional(),
  intervalle: IntervalleSchema.optional(),
});

//
// 🔹 Étape 4 — Validation métier selon typeVariable
//
export const VariableSchemaWithRules = VariableSchema.superRefine((data, ctx) => {
  switch (data.typeVariable) {
    case "Valeur":
      if (!data.valeur || data.valeur.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["valeur"],
          message: "Valeur requise pour le type 'Valeur'",
        });
      }
      break;

    case "Calcul":
      if (!data.formule || data.formule.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["formule"],
          message: "Formule requise pour le type 'Calcul'",
        });
      }
      break;

    case "Test":
      if (
        !data.condition?.expression ||
        !data.condition.valeur?.True ||
        !data.condition.valeur?.False
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["condition"],
          message: "Champ condition incomplet pour le type 'Test'",
        });
      }
      break;

    case "Intervalle":
      if (
        !data.intervalle?.base ||
        !data.intervalle.tranches ||
        data.intervalle.tranches.length === 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["intervalle"],
          message: "Base + tranches requises pour le type 'Intervalle'",
        });
      }
      break;
  }
});
