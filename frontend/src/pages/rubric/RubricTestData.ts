// Test data for the rubrics form
import type { RubricFormData } from '../../components/form/fields/RubricMethodCalculator.types';

/**
 * Données de test pour différentes rubriques de paie
 * Chaque exemple est conçu pour tester un cas d'utilisation spécifique
 */
export const rubricTestData: Record<string, RubricFormData> = {
  // Exemple de salaire de base
  salaireDeBase: {
    code: "SAL001",
    nom: "Salaire mensuel",
    type: "salaire",
    description: "Salaire mensuel de base",
    qui_paie: "employeur",
    methode_calcul: "montant_fixe",
    montant_fixe: 120000,
    ordre_application: 100, // Commence par 1 pour respecter la règle de validation
    valeur_defaut: 120000
  },
  
  // Exemple de gain avec montant fixe
  primeAnciennete: {
    code: "PRM001",
    nom: "Prime d'ancienneté",
    type: "gain",
    description: "Prime accordée selon l'ancienneté",
    qui_paie: "employeur",
    methode_calcul: "montant_fixe",
    montant_fixe: 25000,
    ordre_application: 201, // Commence par 2 pour respecter la règle de validation
    valeur_defaut: 25000
  },
  
  // Exemple de gain avec pourcentage sur base de calcul standard
  primeRendement: {
    code: "PRM002",
    nom: "Prime de rendement",
    type: "gain",
    description: "Prime basée sur la performance",
    qui_paie: "employeur",
    methode_calcul: "pourcentage",
    pourcentage: 10.5,
    base_calcul_standard: "salaire_brut",
    ordre_application: 202,
    valeur_defaut: 0
  },
  
  // Exemple de gain avec pourcentage sur rubriques spécifiques
  primeProjet: {
    code: "PRM003",
    nom: "Prime de projet",
    type: "gain",
    description: "Prime additionnelle pour projets spéciaux",
    qui_paie: "employeur",
    methode_calcul: "pourcentage",
    pourcentage: 5.75,
    rubriques_base_calcul: ["rubrique_001", "rubrique_004"],
    ordre_application: 205,
    valeur_defaut: 0
  },
  
  // Exemple de déduction avec barème progressif
  irpp: {
    code: "IRPP001",
    nom: "Impôt sur le Revenu",
    type: "deduction",
    description: "Impôt sur le revenu des personnes physiques",
    qui_paie: "employe",
    methode_calcul: "bareme_progressif",
    bareme_progressif: [
      { min: 0, max: 50000, taux: 0 },
      { min: 50001, max: 130000, taux: 10 },
      { min: 130001, max: 280000, taux: 15 },
      { min: 280001, max: 500000, taux: 20 },
      { min: 500001, max: 999999999, taux: 30 }
    ],
    ordre_application: 310, // Commence par 3 pour respecter la règle de validation
    valeur_defaut: 0
  },
  
  // Exemple de déduction avec formule personnalisée
  cnps: {
    code: "CNPS001",
    nom: "Cotisation CNPS",
    type: "deduction",
    description: "Caisse Nationale de Prévoyance Sociale",
    qui_paie: "les_deux",
    taux_employe: 2.8,
    taux_employeur: 7.4,
    methode_calcul: "formule_personnalisee",
    formule_personnalisee: "min(salaire_brut * 0.028, 42000)",
    ordre_application: 301,
    valeur_defaut: 0
  },
  
  // Exemple de déduction avec pourcentage et maximum
  mutuelle: {
    code: "MUT001",
    nom: "Mutuelle de santé",
    type: "deduction",
    description: "Cotisation à la mutuelle de santé",
    qui_paie: "les_deux",
    taux_employe: 1.5,
    taux_employeur: 3.0,
    methode_calcul: "pourcentage",
    pourcentage: 1.5,
    base_calcul_standard: "salaire_brut",
    ordre_application: 305,
    valeur_defaut: 0
  }
};

// Données pour un test complet du formulaire
export const completFormTest: RubricFormData = {
  code: "TEST001",
  nom: "Test complet",
  type: "gain",
  description: "Rubrique pour tester toutes les validations",
  qui_paie: "les_deux",
  taux_employe: 2.5,
  taux_employeur: 4.75,
  methode_calcul: "pourcentage",
  pourcentage: 8.25,
  base_calcul_standard: "salaire_brut",
  ordre_application: 245,
  valeur_defaut: 1000
}; 