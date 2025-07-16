export interface ElementSalaire {
  id: string; // Optionnel pour les nouveaux éléments
  societeId: number;
  variableId: number;
  libelle: string;
  type_element: 'prime' | 'retenue';
  nature: 'fixe' | 'variable';
  imposable: boolean;
  soumisCnps: boolean;
  partEmploye: boolean;
  partEmployeur: boolean;
  prorataBase: number;
  processCalculJson: Record<string, unknown>;
}


