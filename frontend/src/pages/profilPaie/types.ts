export interface ProfilPaieRubrique {
  rubriqueId: string;
  code: string;
  nom: string;
  type: string;
  ordre: number;
}

export interface ProfilPaie {
  id: string;
  code: string;
  nom: string;
  description?: string;
  categorie: string;
  rubriques: ProfilPaieRubrique[];
}

export interface ProfilPaieFormData {
  code: string;
  nom: string;
  description?: string;
  categorie: string;
  rubriques: ProfilPaieRubrique[];
} 