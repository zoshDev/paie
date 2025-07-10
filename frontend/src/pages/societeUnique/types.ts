export interface Societe {
  id: string;
  Nom: string;
  Adresse?: string;
  CodePostal?: string;
  Ville?: string;
  Pays?: string;
  [key: string]: any; // Allow additional properties
}