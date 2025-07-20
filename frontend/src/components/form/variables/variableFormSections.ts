// src/variableFormSections.ts
// Correction: Assurez-vous que FormSection est importé depuis la source centrale des types.
import type { FormSection } from "./types.variables"; // Chemin corrigé
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
    // Gérer l'erreur, par exemple en laissant societeOptions vide ou avec une option par défaut
    societeOptions = [{ label: "Erreur de chargement", value: -1 }];
  }
}

// Appel de la fonction de chargement. Dans une vraie app, ceci serait géré par un hook ou un chargeur de données global.
// Pour que le formulaire puisse s'initialiser, il faut que `societeOptions` soit prêt.
// Pour l'exemple, nous allons le laisser synchrone ici, mais attention aux contextes asynchrones.
// Dans un environnement React, un `useEffect` dans le composant parent serait plus approprié.
// await chargerSocietes(); // Cette ligne ne peut pas être utilisée directement au top-level dans un module ES.

// Pour l'exemple, nous allons simuler des options pour le développement
// En production, assurez-vous que `societeOptions` est bien peuplé avant l'utilisation du formulaire.
if (societeOptions.length === 0) {
  chargerSocietes(); // Appel pour peupler les options (peut être asynchrone)
  // Ou des options statiques pour le développement si le chargement asynchrone est géré ailleurs
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
        type: "expressionEditor", // Nouveau type
        showWhen: (values) => values.typeVariable === "Calcul",
        placeholder: "Ex: SALAIRE_BASE + PRIME_ANCIENNETE",
        availableVariables: ["SALAIRE_BASE", "DATE_EMBAUCHE", "NB_JOURS_TRAVAILLES", "PRIME_ANCIENNETE", "COUT_ASSURANCE"], // Exemple de variables disponibles
      },
      {
        name: "condition",
        label: "Condition du Test",
        type: "expressionEditor", // Nouveau type
        showWhen: (values) => values.typeVariable === "Test",
        placeholder: "Ex: SALAIRE_BRUT > 750000 ET ANCIENNETE >= 5",
        availableVariables: ["SALAIRE_BRUT", "ANCIENNETE", "NB_ENFANTS", "EST_LOGE"], // Exemple de variables disponibles
      },
      {
        name: "valeur", // Ce champ est utilisé pour le type "Valeur" et pour contenir l'objet True/False pour "Test"
        label: "Valeur Fixe",
        type: "text", // Type text simple pour la valeur fixe
        showWhen: (values) => values.typeVariable === "Valeur",
        placeholder: "Ex: 50000 ou 'Texte'",
      },
      {
        name: "valeurTestConfig", // Nouveau nom pour gérer la configuration True/False du type Test
        label: "Valeurs du Test",
        type: "testResultConfig", // Nouveau type spécifique pour True/False
        showWhen: (values) => values.typeVariable === "Test",
        // availableVariables sera passé au ExpressionEditor interne si utilisé
      },
      {
        name: "intervalle",
        label: "Configuration des Tranches",
        type: "intervalEditor", // Nouveau type
        showWhen: (values) => values.typeVariable === "Intervalle",
      },
    ],
  },
];

// Cette ligne était la source du problème si le type de FormSection n'était pas unifié.
// En important FormSection depuis '@/types/types' ci-dessus, cette ligne devrait maintenant être correcte.
//const validationSchema = buildZodSchema(variableFormSections);
