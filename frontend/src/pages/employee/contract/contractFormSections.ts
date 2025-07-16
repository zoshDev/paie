
import { z } from "zod";
import type { FieldType, FormSection } from "@/components/form/types";

export const contractSchema = z.object({
  employeId: z.number(),
  dateDebut: z.string().min(1),
  dateFin: z.string().min(1),
  typeContrat: z.string().min(1),
  salaireBase: z.coerce.number().min(0),
  id: z.number().optional(),
});

export type ContractFormData = z.infer<typeof contractSchema>;

export const contractFormSections: FormSection[] = [
  {
    title: "Informations du Contrat",
    fields: [
      { name: "typeContrat", label: "Type de Contrat", type: "text" as FieldType, required: true },
      { name: "dateDebut", label: "Date de Début", type: "date" as FieldType, required: true },
      { name: "dateFin", label: "Date de Fin", type: "date" as FieldType, required: true },
      { name: "salaireBase", label: "Salaire de base", type: "number" as FieldType, required: true },
    ],
  },
];
