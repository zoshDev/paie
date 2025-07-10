
export interface Rubric {
  id: string;
  code: string;
  nom: string;
  type: "salaire" | "gain" | "deduction";
  description?: string;
  qui_paie?: "employe" | "employeur" | "les_deux";
  methode_calcul?: "montant_fixe" | "pourcentage" | "bareme_progressif" | "formule_personnalisee";
  ordre_application?: number;
  base_calcul?: "salaire_brut" | "salaire_net" | "autre";
  valeur_defaut?: number;
}

export interface RubricFormData {
  code: string;
  nom: string;
  type: "salaire" | "gain" | "deduction";
  description?: string;
  qui_paie?: "employe" | "employeur" | "les_deux";
  methode_calcul?: "montant_fixe" | "pourcentage" | "bareme_progressif" | "formule_personnalisee";
  bareme_progressif?: {
    tranches: {
      min: number;
      max: number;
      taux: number;
    }[];
  };
  ordre_application?: number;
  base_calcul?: "salaire_brut" | "salaire_net" | "autre";
  valeur_defaut?: number;
}   

