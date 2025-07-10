export interface Employe {
    id: number;
    userId: number;
    matricule: string;
    nom: string;
    prenom: string;
    dateNaissance: string;
    lieuNaissance: string;
    nationalite: string;
    situationFamiliale: string;
    nombreEnfants: number;
    adresse: string;
    telephone: string;
    email: string;
    dateEmbauche: string;
    categorie: string;
    departement: string;
    poste: string;
    statut: 'ACTIF' | 'INACTIF';
  }