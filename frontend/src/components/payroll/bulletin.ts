export interface BulletinPaie {
  id: number;
  employeId: number;
  mois: number;
  annee: number;
  montantNet: number;
  lignes: LigneBulletinDePaie[];
}

export interface LigneBulletinDePaie {
  nom: string;
  montantEmploye: number;
  montantEmployeur: number;
  type: 'Prime' | 'Retenue' | 'Cotisation';
}
