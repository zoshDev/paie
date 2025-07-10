/**
 * Interfaces pour la gestion des profils de paie
 */

// Rubrique de paie (élément de base d'un profil)
export interface PayrollItem {
  id: number;
  code: string;         // Code unique de la rubrique
  name: string;         // Nom de la rubrique
  type: 'gain' | 'deduction' | 'cotisation'; // Type de rubrique
  calculation: string;  // Formule de calcul
  value: number;        // Valeur fixe ou taux pour le calcul
  taxable: boolean;     // Soumis à l'impôt
  active: boolean;      // Si la rubrique est active
  order: number;        // Ordre d'affichage
}

// Catégorie de salariés
export interface EmployeeCategory {
  id: number;
  code: string;       // Code unique de la catégorie
  name: string;       // Nom de la catégorie (ex: Cadre, Agent de maîtrise)
  description: string;
  defaultProfileId: number; // ID du profil par défaut pour cette catégorie
}

// Profil de paie (ensemble de rubriques par défaut pour une catégorie)
export interface PayrollProfile {
  id: number;
  name: string;        // Nom du profil
  description: string;
  categoryId: number;  // ID de la catégorie associée
  isDefault: boolean;  // Si c'est le profil par défaut pour la catégorie
  items: PayrollProfileItem[]; // Rubriques associées
}

// Association entre un profil et ses rubriques avec valeurs spécifiques
export interface PayrollProfileItem {
  id: number;
  profileId: number;         // ID du profil
  payrollItemId: number;     // ID de la rubrique
  value?: number;            // Valeur spécifique au profil (surcharge la valeur par défaut)
  enabled: boolean;          // Si la rubrique est activée dans ce profil
}

// Personnalisation par employé
export interface EmployeePayrollCustomization {
  id: number;
  employeeId: number;        // ID de l'employé
  payrollItemId: number;     // ID de la rubrique
  value?: number;            // Valeur spécifique à l'employé
  enabled: boolean;          // Si la rubrique est activée pour cet employé
  startDate?: Date;          // Date de début (optionnelle)
  endDate?: Date;            // Date de fin (optionnelle)
}

// Association entre employé et profil
export interface EmployeeProfile {
  id: number;
  employeeId: number;        // ID de l'employé
  profileId: number;         // ID du profil
  startDate: Date;           // Date d'affectation du profil
  endDate?: Date;            // Date de fin d'affectation (si changement)
}

// Société (informations de l'employeur)
export interface Company {
  id: number;
  name: string;
  address: string;
  taxId: string;             // Numéro d'identification fiscale
  registrationNumber: string; // Numéro d'immatriculation
  phone: string;
  email: string;
  logo?: string;             // Chemin vers le logo
  bankDetails?: string;      // Coordonnées bancaires
} 