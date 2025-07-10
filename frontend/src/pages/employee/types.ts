
export interface Employee {
  id: string;
  Nom: string;
  Prenom?: string;
  email?: string;
  phone?: string;
  categorie?: string; //category ID
  department?: string; //department ID
  poste?: string; //job title
  date_debut?: string; //start date
  date_fin?: string; //end date
  [key: string]: any; // Allow additional properties
}