export interface PayrollElement {
    id: number;
    code: string;
    libelle: string;
    type: 'GAIN' | 'RETENUE';
    methodeCalcul: 'FIXE' | 'POURCENTAGE' | 'FORMULE';
    valeur: number;
    formule?: string;
  }
  
  export interface PayrollProfile {
    id: number;
    code: string;
    nom: string;
    description: string;
    elements: PayrollElement[];
    actif: boolean;
  }