// 📄 src/pages/employee/paie/types.ts

export interface BulletinPayload {
  employeId: number;
  mois: string;  // ex: "07"
  annee: string; // ex: "2025"
}

export interface LigneBulletinSalaire {
  libelle: string;                  // ex: "CNPS"
  montant: number;                  // part employé
  montantEmployeur?: number;       // part employeur (optionnelle)
}

export interface BulletinPaie {
  id: number;
  employeId: number;
  mois: string;
  annee: string;
  montant_net: number;
  details: LigneBulletinSalaire[];
}
