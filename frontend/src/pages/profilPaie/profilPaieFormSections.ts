import type { FormSection} from "@/components/form/types";

export const profilPaieFormSections: FormSection[] = [
  {
    title: 'Informations du Profil',
    columns: 2,
    fields: [
      { name: 'roleName', label: 'Nom du profil', type: 'text', required: true },
      { name: 'categorie', label: 'Catégorie', type: 'select', options: [
          { label: 'Catégorie 1', value: 'cat1' },
          { label: 'Catégorie 2', value: 'cat2' },
          { label: 'Catégorie 3', value: 'cat3' }
        ]},
      { name: 'description', label: 'Description', type: 'textarea' },
    ]
  },
  {
    title: 'Éléments de Salaire',
    columns: 1,
    fields: [
      {
        name: 'elements',
        label: 'Rubriques associées',
        type: 'rubriqueSelector',//'dynamic-list',// m
        itemFields: [
          { name: 'code', label: 'Code', type: 'text' },
          { name: 'libelle', label: 'Libellé', type: 'text' },
          { name: 'type_element', label: 'Type', type: 'select', options: [
            { label: 'Salaire', value: 'salaire' },
            { label: 'Gain', value: 'gain' },
            { label: 'Retenue', value: 'deduction' }
          ]},
          { name: 'nature', label: 'Nature', type: 'text' },
          { name: 'imposable', label: 'Imposable', type: 'checkbox' },
          { name: 'ordre', label: 'Ordre', type: 'number' }
        ]
      }
    ]
  }
];
