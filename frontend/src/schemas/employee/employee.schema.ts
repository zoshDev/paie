//import { FormSection } from '@/components/form/GenericForm';
import type { FormSection } from '@/components/form/types';
import { companyService } from '@/services/companyService';
/*import { categorieEchelonService } from '@/services/categorieEchelonService';
import { profilPaieService } from '@/pages/roleProfilPaie/profilPaieService';
import type { RoleProfilPaie } from '@/pages/profilPaie/types';*/

// Préparer les tableaux d'options
export let categorieEchelonOptions: { label: string; value: number }[] = [];
export let companyOptions: { label: string; value: number }[] = [];
export let roleOptions: { label: string; value: number }[] = [];

export async function chargerOptionsEmploye() {
  try {
    /*const categoriesEchelon = await categorieEchelonService.list();
    categorieEchelonOptions = categoriesEchelon.map((c) => ({
      label: c.libelle,
      value: c.id,
    }));*/

    const companies = await companyService.list();
    companyOptions = companies.map((c) => ({
      label: c.nom,
      value: c.id,
    }));
    console.log("[FormOptions] Options société chargées", companyOptions);

    /*const roles = await profilPaieService.list();
    roleOptions = roles.map((r) => ({
      label: r.roleName,
      value: Number(r.id),
    }));*/
  } catch (error) {
    console.log("[FormOptions] Échec chargement des options employé", roleOptions);
    console.error("[FormOptions] Échec chargement des données employé", error);
  }
}

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
      { 
        name: 'societeId', 
        label: 'Société', 
        type: 'select', 
        required: true,
        options: companyOptions
      },
      { 
        name: 'categorieEchelonId', 
        label: 'Catégorie Échelon', 
        type: 'select', 
        required: false, 
        options: categorieEchelonOptions
      },
    ]
  },
  {
    title: 'Compte Utilisateur',
    columns: 2,
    fields: [
      { name: 'pseudo', label: 'Pseudo', type: 'text', required: true },
      { name: 'password', label: 'Mot de passe', type: 'password', required: true },
      { 
        name: 'roleId', 
        label: 'Profil(s) de paie', 
        type: 'multiselect', 
        required: false, 
        options: [
          { value: 1, label: 'Admin' },
          { value: 2, label: 'RH' },
          { value: 3, label: 'Employé' },
      ]} 
    ]
  }
];


export function getEmployeeFormSections({
  companyOptions,
  categorieEchelonOptions,
  roleOptions
}: {
  companyOptions: { label: string; value: number }[];
  categorieEchelonOptions: { label: string; value: number }[];
  roleOptions: { label: string; value: number }[];
}): FormSection[] {
  return [
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
        { 
          name: 'societeId', 
          label: 'Société', 
          type: 'select', 
          required: true,
          options: companyOptions
        },
        { 
          name: 'categorieEchelonId', 
          label: 'Catégorie Échelon', 
          type: 'select', 
          required: false, 
          options: categorieEchelonOptions
        },
      ]
    },
    {
      title: 'Compte Utilisateur',
      columns: 2,
      fields: [
        { name: 'pseudo', label: 'Pseudo', type: 'text', required: true },
        { name: 'password', label: 'Mot de passe', type: 'password', required: true },
        { 
          name: 'roleId', 
          label: 'Profil(s) de paie', 
          type: 'multiselect', 
          required: false, 
          options: roleOptions
        } 
      ]
    }
  ];
}
