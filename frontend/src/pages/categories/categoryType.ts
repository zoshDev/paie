export interface Categorie {
  id: string;
  code: string;
  nom: string;
  description?: string;
}
export interface CategorieType {
  id: string;
  code: string;
  nom: string;
  description?: string;
  categories: Categorie[];
}