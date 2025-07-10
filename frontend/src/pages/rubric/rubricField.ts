import type { FormField, FormSection } from "../../components/form/GenericForm";

// Sections du formulaire pour une organisation plus claire
export const rubricSections: FormSection[] = [
  {
    title: "Informations générales",
    fields: [
      {
        name: "code",
        label: "Code",
        type: "text",
        required: true,
        readOnly: true,
      },
      {
        name: "nom",
        label: "Nom",
        type: "text",
        required: true,
      },
      {
        name: "type",
        label: "Type",
        type: "select",
        required: true,
        options: [
          { label: "Salaire de base", value: "salaire" },
          { label: "Gain", value: "gain" },
          { label: "Déduction", value: "deduction" },
        ],
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Décrivez l'objectif et l'utilisation de cette rubrique",
      },
      {
        name: "ordre_application",
        label: "Ordre d'application",
        type: "number",
        required: true,
        tooltipText: "Détermine l'ordre de calcul des rubriques. Format: rubriques de salaire (1xx), gains (2xx), déductions (3xx)."
      }
    ]
  },
  {
    title: "Configuration du Paiement",
    fields: [
      {
        name: "qui_paie",
        label: "Qui paie ?",
        type: "select",
        options: [
          { label: "Employé", value: "employe" },
          { label: "Employeur", value: "employeur" },
          { label: "Les deux", value: "les_deux" },
        ],
        tooltipText: "Le choix fait ici détermine quels taux sont applicables et qui supporte la charge."
      },
      {
        name: "taux_employe",
        label: "Taux employé (%)",
        type: "number",
        tooltipText: "Pourcentage du montant de la rubrique déduit de la part de l'employé.",
        showIf: (data: any) => (data.qui_paie === "employe" || data.qui_paie === "les_deux") && data.type === "deduction",
      },
      {
        name: "taux_employeur",
        label: "Taux employeur (%)",
        type: "number",
        tooltipText: "Pourcentage du montant de la rubrique à la charge de l'employeur.",
        showIf: (data: any) => (data.qui_paie === "employeur" || data.qui_paie === "les_deux") && data.type === "deduction",
      }
    ]
  },
  {
    title: "Méthode de Calcul",
    fields: [
      {
        name: "methode_calcul",
        label: "Méthode de calcul",
        type: "rubric_method_calculator" as "rubric_method_calculator",
        required: true,
        rubriquesDisponibles: [], // Sera rempli dynamiquement
      }
    ]
  },
  {
    title: "Autres Paramètres",
    fields: [
      {
        name: "valeur_defaut",
        label: "Valeur par défaut",
        type: "number",
        tooltipText: "Valeur par défaut de la rubrique. Si la méthode est 'Montant fixe', cette valeur est automatiquement renseignée avec le montant fixe défini. Utilisée comme valeur de repli si le calcul ne produit pas de résultat ou si la rubrique est facultative.",
        showIf: (data: any) => data.methode_calcul === "montant_fixe",
      }
    ]
  }
];

// Champs à plat pour compatibilité avec le code existant
export const rubricFields: FormField[] = rubricSections.flatMap(section => section.fields);
