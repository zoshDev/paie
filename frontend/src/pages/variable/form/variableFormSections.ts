// src/components/form/variables/variableFormSections.ts
// IMPORTANT: Assurez-vous que FormSection est importé depuis la source centrale des types.
import type { FormSection } from "@/types/forms"; // <-- CHEMIN CORRIGÉ ICI
import { companyService } from "@/services/companyService";

let societeOptions: { label: string; value: number }[] = [];

// Fonction asynchrone pour charger les sociétés
async function chargerSocietes() {
  try {
    const societes = await companyService.list();
    societeOptions = societes.map((s) => ({
      label: s.nom,
      value: s.id,
    }));
  } catch (error) {
    console.error("Erreur lors du chargement des sociétés:", error);
    societeOptions = [{ label: "Erreur de chargement", value: -1 }];
  }
}

// Appel de la fonction de chargement (pour l'exemple de développement)
if (societeOptions.length === 0) {
  chargerSocietes();
  societeOptions = [
    { value: 1, label: "Société A" },
    { value: 2, label: "Société B" },
  ];
}


export const variableFormSections: FormSection[] = [
  {
    title: "Informations Générales",
    fields: [
      { name: "nom", label: "Nom", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "typeVariable",
        label: "Type de Variable",
        type: "select",
        options: [
          { value: "Calcul", label: "Calcul (Formule)" },
          { value: "Test", label: "Test (Condition)" },
          { value: "Intervalle", label: "Intervalle (Tranches)" },
          { value: "Valeur", label: "Valeur Fixe" },
        ],
        required: true,
      },
      { name: "code", label: "Code", type: "number", required: true },
      {
        name: "societeId",
        label: "Société",
        type: "select",
        required: true,
        options: societeOptions,
      },
    ],
  },
  {
    title: "Configuration Spécifique de la Variable",
    fields: [
      {
        name: "formule",
        label: "Formule de Calcul",
        type: "expressionEditor",
        showWhen: (values) => values.typeVariable === "Calcul",
        placeholder: "Ex: SALAIRE_BASE + PRIME_ANCIENNETE",
        availableVariables: ["SALAIRE_BASE", "DATE_EMBAUCHE", "NB_JOURS_TRAVAILLES", "PRIME_ANCIENNETE", "COUT_ASSURANCE"],
      },
      {
        name: "condition",
        label: "Condition du Test",
        type: "expressionEditor",
        showWhen: (values) => values.typeVariable === "Test",
        placeholder: "Ex: SALAIRE_BRUT > 750000 ET ANCIENNETE >= 5",
        availableVariables: ["SALAIRE_BRUT", "ANCIENNETE", "NB_ENFANTS", "EST_LOGE"],
      },
      {
        name: "valeur",
        label: "Valeur Fixe",
        type: "text",
        showWhen: (values) => values.typeVariable === "Valeur",
        placeholder: "Ex: 50000 ou 'Texte'",
      },
      {
        name: "valeurTestConfig",
        label: "Valeurs du Test",
        type: "testResultConfig",
        showWhen: (values) => values.typeVariable === "Test",
      },
      {
        name: "intervalle",
        label: "Configuration des Tranches",
        type: "intervalEditor",
        showWhen: (values) => values.typeVariable === "Intervalle",
      },
    ],
  },
];
