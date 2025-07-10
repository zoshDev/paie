// types/RubricMethodCalculator.types.ts - Version améliorée
import type { Control, UseFormRegister, UseFormWatch, FieldErrors, UseFormSetValue } from "react-hook-form";

/**
 * Représente une option dans une liste déroulante
 */
export interface SelectOption {
  label: string;
  value: string;
}

/**
 * Les différentes méthodes de calcul disponibles pour les rubriques
 */
export type MethodeCalcul = 
  | "montant_fixe" 
  | "pourcentage" 
  | "bareme_progressif" 
  | "formule_personnalisee";

/**
 * Les bases de calcul standard disponibles pour la méthode pourcentage
 */
export type BaseCalculStandard = 
  | "salaire_brut" 
  | "salaire_net" 
  | "salaire_cotisable_cnps" 
  | "revenu_net_imposable";

/**
 * Interface principale pour les props du composant RubricMethodCalculator
 * Inclut tous les contrôles nécessaires pour gérer le formulaire avec react-hook-form
 */
export interface RubricMethodCalculatorProps {
  /** Control de react-hook-form pour gérer le formulaire */
  control: Control<any>;
  
  /** Fonction register de react-hook-form pour enregistrer les champs */
  register: UseFormRegister<any>;
  
  /** Fonction watch de react-hook-form pour observer les changements */
  watch: UseFormWatch<any>;
  
  /** Erreurs de validation du formulaire */
  errors: FieldErrors<any>;
  
  /** Liste des rubriques disponibles pour la base de calcul */
  rubriquesDisponibles: SelectOption[];
  
  /** Fonction setValue de react-hook-form pour mettre à jour les valeurs */
  setValue?: UseFormSetValue<any>;

  /** Indique si le sélecteur de méthode doit être désactivé (ex: pour les rubriques "Salaire de base") */
  isMethodSelectDisabled?: boolean;
}

/**
 * Représente une tranche dans un barème progressif
 */
export interface BaremeProgressifTranche {
  /** Valeur minimum de la tranche (incluse) */
  min: number;
  
  /** Valeur maximum de la tranche (incluse) */
  max: number;
  
  /** Taux appliqué à cette tranche (en pourcentage) */
  taux: number;
}

/**
 * Structure des données d'un barème progressif
 */
export interface BaremeProgressifData {
  /** Liste des tranches du barème */
  tranches: BaremeProgressifTranche[];
}

/**
 * Type pour les données complètes d'une rubrique
 */
export interface RubricFormData {
  /** Code unique de la rubrique */
  code: string;
  
  /** Nom descriptif de la rubrique */
  nom: string;
  
  /** Type de rubrique */
  type: 'salaire' | 'gain' | 'deduction';
  
  /** Description détaillée de la rubrique (optionnel) */
  description?: string;
  
  /** Qui paie cette rubrique */
  qui_paie?: 'employe' | 'employeur' | 'les_deux';
  
  /** Taux appliqué à l'employé (en pourcentage) */
  taux_employe?: number;
  
  /** Taux appliqué à l'employeur (en pourcentage) */
  taux_employeur?: number;
  
  /** Méthode de calcul choisie pour cette rubrique */
  methode_calcul: MethodeCalcul;
  
  /** Montant fixe si la méthode est 'montant_fixe' */
  montant_fixe?: number;
  
  /** Pourcentage si la méthode est 'pourcentage' */
  pourcentage?: number;
  
  /** Base de calcul standard si la méthode est 'pourcentage' */
  base_calcul_standard?: BaseCalculStandard;
  
  /** Rubriques sélectionnées comme base de calcul si la méthode est 'pourcentage' */
  rubriques_base_calcul?: string[];
  
  /** Données du barème progressif si la méthode est 'bareme_progressif' */
  bareme_progressif?: BaremeProgressifTranche[];
  
  /** Formule personnalisée si la méthode est 'formule_personnalisee' */
  formule_personnalisee?: string;
  
  /** Ordre d'application de la rubrique (doit suivre des règles de préfixe selon le type) */
  ordre_application?: number;
  
  /** Valeur par défaut (utilisée quand applicable) */
  valeur_defaut?: number;
}