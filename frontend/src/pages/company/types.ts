export interface Societe {
  id: string; // aligné avec l'ID numérique du backend
  nom: string;
  localisation?: string;
  regime_fiscal?: string;//'reel' | 'simplifie' | 'exonere'; // typage explicite des variantes

  // champs additionnels futurs
  adresse?: string;
  ville?: string;
  pays?: string;

  [key: string]: any; // permet d'ajouter dynamiquement des extensions métier
}
