import type { FormField, FormSection } from "../../components/form/GenericForm";
import { TagIcon, DocumentIcon } from "@heroicons/react/24/outline";

// Champs de base pour un profil de paie
export const profilPaieFields: FormField[] = [
  {
    name: "code",
    label: "Code Profil",
    type: "text",
    required: true,
    placeholder: "Entrez le code du profil de paie",
  },
  {
    name: "nom",
    label: "Nom",
    type: "text",
    required: true,
    placeholder: "Entrez le nom du profil de paie",
  },
  {
    name: "categorie",
    label: "Catégorie",
    type: "select",
    required: true,
    options: [
      { label: "Cadre", value: "cadre" },
      { label: "Non-cadre", value: "non-cadre" },
      { label: "Stagiaire", value: "stagiaire" },
      { label: "Consultant", value: "consultant" },
    ],
    placeholder: "Sélectionnez la catégorie du profil",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: false,
    placeholder: "Entrez une description du profil de paie",
  },
];

// Sections de formulaire incluant les rubriques
export const profilPaieSections: FormSection[] = [
  {
    title: "Informations générales",
    fields: profilPaieFields,
  },
  {
    title: "Rubriques associées",
    fields: [
      // Cette section sera gérée via un composant personnalisé dans le formulaire
      // pour permettre l'ajout/suppression de rubriques
    ],
  },
];

// Champs complets incluant description
export const profilPaieFieldsWithDescription: FormField[] = [
  ...profilPaieFields,
]; 