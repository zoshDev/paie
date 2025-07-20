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
    title: "Informations Générales",
    fields: [
      { name: "nom", label: "Nom", type: "text", required: true },
      
      { name: "description", label: "Description", type: "textarea" },
      { name: "valeur", label: "Valeur", type: "text",  },
      {
        name: "typeVariable",
        label: "Type de Variable",
        type: "select",
        options: [
          {value:"Test", label:"Test"},
          {value:"Calcul", label: "Calcul"}, 
          {value:"Intervalle", label: "Intervalle"},
          {value:"Valeur", label: "Valeur"}
        ],
        required: true,
      },
      { name: "code", label: "Code", type: "number", required: true },
      { name: "formule", label: "Formule", type: "text" },
      { 
        name: "societeId", 
        label: "Société", 
        type: "select",
        required: true,
        options: societeOptions,
      },
      { name: "condition", label: "Condition", type: "textarea" },
      { name: "intervalle", label: "Intervalle", type: "textarea" },

      {
        name: "formule",
        label: "Formule de Calcul",
        type: "expressionEditor",
        showWhen: (values) => values.typeVariable === "Calcul",
        placeholder: "Ex: SALAIRE_BASE + PRIME_ANCIENNETE",
        availableVariables: [
          "SALAIRE_BASE",
          "DATE_EMBAUCHE",
          "NB_JOURS_TRAVAILLES",
          "PRIME_ANCIENNETE",
          "COUT_ASSURANCE"
        ],
      },
      {
        name: "intervalle",
        label: "Tranches",
        type: "intervalEditor",
        showWhen: (values) => values.typeVariable === "Intervalle",
      },
      {
        name: "valeurTestConfig",
        label: "Valeurs du Test",
        type: "testResultConfig",
        showWhen: (values) => values.typeVariable === "Test",
      }

      
    ],
  },
];
