export interface Contrat {
  typeContrat: string;
  dateDebut: string;
  dateFin: string;
  salaireBase: number;
}



export interface RawEmployee {
  id: number;
  userId: number;
  userRoleId: number[];
  isActive: boolean;
  name: string;

  matricule: string;
  statutFamilial: string;
  nbEnfants: number;
  nationalite: string;
  estLoge: boolean;
  societeId: number;
  categorieEchelonId: number;
  roleId: number[];
  contrat?: Contrat; // Optional field for contract details

}
