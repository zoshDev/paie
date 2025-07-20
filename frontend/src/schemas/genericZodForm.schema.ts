// src/schemas/genericZodForm.schema.ts
import { z } from 'zod';
import type { FormField, FormSection } from '@/types/forms';

export const buildZodSchema = (sectionsOrFields: FormSection[] | FormField[]) => {
  const schemaFields: { [key: string]: z.ZodTypeAny } = {};

  let fieldsToProcess: FormField[] = [];

  if (sectionsOrFields.length > 0 && 'fields' in sectionsOrFields[0]) {
    fieldsToProcess = (sectionsOrFields as FormSection[]).flatMap(section => section.fields);
  } else {
    fieldsToProcess = sectionsOrFields as FormField[];
  }

  fieldsToProcess.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'email':
      case 'password':
      case 'select':
      case 'expressionEditor':
        // Pour les types chaîne, appliquez .min() directement après z.string()
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = fieldSchema.min(1, `${field.label} est requis.`);
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;
      case 'number':
        // Gérer l'entrée numérique: d'abord une chaîne, puis transformer en nombre ou null
        fieldSchema = z.string()
          .nullable() // Permet à la chaîne d'être null
          .transform(s => {
            if (s === null || s.trim() === "") {
              return null; // Transforme chaîne vide ou null en null
            }
            const num = Number(s);
            return isNaN(num) ? null : num; // Transforme en nombre ou null si non numérique
          })
          .refine(val => val === null || typeof val === 'number', {
            message: `${field.label} doit être un nombre valide.`
          });
        
        // Appliquer les validations requises pour les types numériques
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null>)
            .refine(val => val !== null, { message: `${field.label} est requis.` });
        } else {
          fieldSchema = (fieldSchema as z.ZodEffects<z.ZodNullable<z.ZodNumber>, number | null>).optional();
        }
        break;
      case 'checkbox':
        fieldSchema = z.boolean();
        if (!field.required) {
          fieldSchema = fieldSchema.optional();
        }
        break;
      case 'date':
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = fieldSchema.min(1, `${field.label} est requis.`);
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;
      case 'multiselect':
        fieldSchema = z.array(z.string());
        if (field.required) {
          fieldSchema = fieldSchema.min(1, `Sélectionnez au moins un élément pour ${field.label}.`);
        } else {
          fieldSchema = fieldSchema.optional();
        }
        break;
      case 'hidden':
        fieldSchema = z.any().optional();
        break;
      case 'rubriqueSelector':
        fieldSchema = z.any();
        if (!field.required) {
            fieldSchema = fieldSchema.optional();
        }
        break;
      case 'intervalEditor':
        // Fonction utilitaire pour transformer les champs numériques dans les tranches
        const numericTransform = z.string()
          .nullable()
          .transform(s => {
            if (s === null || s.trim() === "") {
              return null;
            }
            const num = Number(s);
            return isNaN(num) ? null : num;
          })
          .refine(val => val === null || typeof val === 'number', {
            message: "Doit être un nombre valide."
          });

        fieldSchema = z.object({
          base: z.union([
            numericTransform, // Pour les bases numériques
            z.string().optional() // Pour les bases textuelles (noms de variables)
          ]).nullable(),
          tranches: z.array(z.object({
            min: numericTransform,
            max: numericTransform,
            valeur: numericTransform,
          })),
        });
        if (!field.required) {
            fieldSchema = fieldSchema.optional();
        }
        break;
      case 'testResultConfig':
        fieldSchema = z.object({
          True: z.string(),
          False: z.string(),
        });
        if (!field.required) {
            fieldSchema = fieldSchema.optional();
        }
        break;
      default:
        fieldSchema = z.any().optional();
        break;
    }

    if (field.validation && typeof field.validation === 'function') {
      try {
        fieldSchema = field.validation(fieldSchema);
      } catch (e) {
        console.error(`Erreur d'application de la validation personnalisée pour le champ ${field.name}:`, e);
      }
    }
    
    schemaFields[field.name] = fieldSchema;
  });

  return z.object(schemaFields);
};
