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
}
