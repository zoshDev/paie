import type { FormSection } from "./GenericForm";
import { TagIcon, BookmarkIcon, ListBulletIcon, ScaleIcon, InformationCircleIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import React from "react";

// Liste fictive de rubriques disponibles pour la base de calcul
const rubriquesDisponibles = [
  { label: "Salaire de base", value: "salaire_base" },
  { label: "Prime d'ancienneté", value: "prime_anciennete" },
  { label: "Prime de rendement", value: "prime_rendement" },
  { label: "Indemnité de logement", value: "indemnite_logement" },
  { label: "Indemnité de transport", value: "indemnite_transport" },
  { label: "Heures supplémentaires", value: "heures_supplementaires" },
  { label: "Avance sur salaire", value: "avance_salaire" },
  { label: "Cotisation retraite", value: "cotisation_retraite" },
  { label: "Assurance maladie", value: "assurance_maladie" },
];

// Sections de formulaire pour les rubriques
export const rubricFormSections: FormSection[] = [
  {
    title: "Informations générales",
    fields: [
      {
        name: "code",
        label: "Code",
        type: "text",
        required: true,
        icon: React.createElement(TagIcon, { className: "w-5 h-5" })
      },
      {
        name: "nom",
        label: "Nom",
        type: "text",
        required: true,
        icon: React.createElement(BookmarkIcon, { className: "w-5 h-5" })
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Décrivez l'objectif et l'utilisation de cette rubrique"
      },
      {
        name: "type",
        label: "Type de rubrique",
        type: "select",
        required: true,
        tooltipText: "Salaire : Rémunération de base ; Gain : Ajout au salaire ; Déduction : Retrait du salaire.",
        options: [
          { label: "Salaire", value: "salaire" },
          { label: "Gain", value: "gain" },
          { label: "Déduction", value: "deduction" }
        ]
      },
      {
        name: "ordre_application",
        label: "Ordre d'application",
        type: "number",
        required: true,
        tooltipText: "Définit l'ordre de calcul. Ex: Salaires (1xx), Gains (2xx), Déductions (3xx).",
        icon: React.createElement(ListBulletIcon, { className: "w-5 h-5" })
      }
    ]
  },
  {
    title: "Configuration du paiement",
    fields: [
      {
        name: "qui_paie",
        label: "Qui paie la cotisation",
        type: "select",
        options: [
          { label: "Employé", value: "employe" },
          { label: "Employeur", value: "employeur" },
          { label: "Les deux", value: "les_deux" }
        ],
        showIf: (values) => values.type === "deduction",
        icon: React.createElement(ScaleIcon, { className: "w-5 h-5" }),
        tooltipText: "Ce choix détermine les taux qui s'appliqueront à cette rubrique."
      },
      {
        name: "taux_employe",
        label: "Taux employé (%)",
        type: "number",
        showIf: (values) => (values.qui_paie === "employe" || values.qui_paie === "les_deux") && values.type === "deduction",
        tooltipText: "Pourcentage du montant de la rubrique déduit de la part de l'employé."
      },
      {
        name: "taux_employeur",
        label: "Taux employeur (%)",
        type: "number",
        showIf: (values) => (values.qui_paie === "employeur" || values.qui_paie === "les_deux") && values.type === "deduction",
        tooltipText: "Pourcentage du montant de la rubrique à la charge de l'employeur."
      }
    ]
  },
  {
    title: "Méthode de calcul",
    fields: [
      {
        name: "methode_calcul_config",
        label: "Configuration du calcul",
        type: "rubric_method_calculator",
        required: true,
        rubriquesDisponibles: rubriquesDisponibles
      }
    ]
  },
  {
    title: "Autres paramètres",
    fields: [
      {
        name: "valeur_defaut",
        label: "Valeur par défaut",
        type: "number",
        showIf: (values) => values.methode_calcul === "montant_fixe",
        tooltipText: "Valeur par défaut de la rubrique. Si la méthode est 'Montant fixe', cette valeur est automatiquement renseignée avec le montant fixe défini. Utilisée comme valeur de repli si le calcul ne produit pas de résultat ou si la rubrique est facultative.",
        icon: React.createElement(AdjustmentsHorizontalIcon, { className: "w-5 h-5" })
      }
    ]
  }
];