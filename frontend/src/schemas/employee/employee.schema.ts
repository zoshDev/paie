//import { FormSection } from '@/components/form/GenericForm';
import type { FormSection } from '@/components/form/types';


export const employeeFormSections: FormSection[] = [
  {
    title: 'Informations Personnelles',
    columns: 2,
    fields: [
      { name: 'matricule', label: 'Matricule', type: 'text', required: true },
      { name: 'statutFamilial', label: 'Statut familial', type: 'select', required: true, options: [
        { value: 'célibataire', label: 'Célibataire' },
        { value: 'marié', label: 'Marié(e)' },
      ]},
      { name: 'nbEnfants', label: 'Nombre d’enfants', type: 'number', min: 0 },
      { name: 'nationalite', label: 'Nationalité', type: 'text' },
      { name: 'estLoge', label: 'Logé ?', type: 'checkbox' },
    ]
  },
  {
    title: 'Informations RH',
    columns: 2,
    fields: [
      { name: 'societeId', label: 'Société', type: 'number', required: true },
      { name: 'categorieEchelonId', label: 'Catégorie Échelon', type: 'number', required: true },
    ]
  },
  {
    title: 'Compte Utilisateur',
    columns: 2,
    fields: [
      { name: 'pseudo', label: 'Pseudo', type: 'text', required: true },
      { name: 'password', label: 'Mot de passe', type: 'password', required: true },
      { name: 'roleId', label: 'Rôle(s)', type: 'multiselect', required: false, options: [
        { value: 1, label: 'Admin' },
        { value: 2, label: 'RH' },
        { value: 3, label: 'Employé' },
      ]},
    ]
  }
];
