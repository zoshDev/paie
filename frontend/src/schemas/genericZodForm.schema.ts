import { z } from 'zod';
//import { FormSection } from './types';
import type { FormSection } from '@/components/form/types';


export  function buildZodSchema(sections: FormSection[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  const fields = sections.flatMap((s) => s.fields);

  fields.forEach((field) => {
    if (field.validation) {
      shape[field.name] = field.validation;
      return;
    }

    let schema: z.ZodTypeAny;

    switch (field.type) {
      case 'number':
        schema = z.coerce.number();
        if (field.min !== undefined) schema = schema.min(field.min);
        if (field.max !== undefined) schema = schema.max(field.max);
        break;

      case 'email':
        schema = z.string().email();
        break;

      case 'date':
        schema = z.string(); // ou `z.coerce.date()` si tu veux transformer auto
        break;

      case 'checkbox':
        schema = z.boolean();
        break;

      case 'multiselect':
        schema = z.array(z.string());
        break;

      default:
        schema = z.string();
    }

    if (field.required) schema = schema.min(1, `${field.label} est requis`);
    shape[field.name] = schema;
  });

  return z.object(shape);
}
