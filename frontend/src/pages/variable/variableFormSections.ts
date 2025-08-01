import type { FormSection } from "@/components/form/types";
import { companyService } from "@/services/companyService";


let societeOptions: { label: string; value: number }[] = [];

async function chargerSocietes() {
  const societes = await companyService.list();
  societeOptions = societes.map((s) => ({
    label: s.nom,
    value: s.id,
  }));
}
await chargerSocietes();

export const variableFormSections: FormSection[] = [
  {
    title: "🔹 Informations générales",
    columns: 2, // ou 3, ou rien → défaut 1
    description: "Renseignements de base pour la variable",
    fields: [
      { name: "nom", label: "Nom", type: "text", required: true },
      { name: "code", label: "Code", type: "number", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "societeId", label: "Société", type: "select", options: societeOptions },
      { 
        name: "typeVariable", 
        label: "Type", 
        type: "select", 
        options: [
          {value:"Test", label:"Test"},
          {value:"Calcul", label: "Calcul"}, 
          {value:"Intervalle", label: "Intervalle"},
          {value:"Valeur", label: "Valeur"}
        ], 
        required: true },
    ],
  },

  {
    title: "🔹 Paramétrage métier",
    columns: 1,
    fields: [
      {
        name: "formule",
        label: "Formule",
        type: "expressionEditor",
        showWhen: (values) => values.typeVariable === "Calcul",
        availableVariables: [
          "SALAIRE_BASE",
          "DATE_EMBAUCHE",
          "NB_JOURS_TRAVAILLES",
          "PRIME_ANCIENNETE",
          "COUT_ASSURANCE"
        ],
      },
      {
        name: "valeur",
        label: "Valeur fixe",
        type: "text",
        showWhen: (values) => values.typeVariable === "Valeur",
      },
      {
        name: "condition",
        label: "Condition",
        type: "expressionEditor",
        showWhen: (values) => values.typeVariable === "Test",
        availableVariables: [
          "SALAIRE_BRUT",
          "ANCIENNETE",
          "NB_ENFANTS",
          "EST_LOGE"
        ]
      },
      {
        name: "valeurTestConfig",
        label: "Valeurs si vrai/faux",
        type: "testResultConfig",
        showWhen: (values) => values.typeVariable === "Test",
      },
      {
        name: "intervalle",
        label: "Tranches",
        type: "intervalEditor",
        showWhen: (values) => values.typeVariable === "Intervalle",
      },
    ],
  },
  
];
