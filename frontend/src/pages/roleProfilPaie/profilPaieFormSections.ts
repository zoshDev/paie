import type { FormSection } from "@/components/form/types";

export const profilPaieFormSections: FormSection[] = [
  {
    title: 'Informations Profil',
    fields: [
      {
        name: 'roleName',
        label: 'Nom du profil',
        type: 'text',
        required: true,
      },
      /*{
        name: 'elementSalaireIds',
        label: 'Éléments de salaire',
        type: 'multiselect',
        options: [
          { label: 'Salaire de base', value: 'sb' },
          { label: 'Prime de performance', value: 'prime' },
          { label: 'CNPS', value: 'cnps' },
          { label: 'IRPP', value: 'irpp' },
        ],
        required: false,
      },*/
    ],
  },
];
