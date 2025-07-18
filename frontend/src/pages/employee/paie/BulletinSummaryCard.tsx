// 📄 src/pages/employee/paie/BulletinSummaryCard.tsx

import { BulletinLineRow } from "./BulletinLineRow";
import { BulletinTotals } from "./BulletinTotals";

interface Ligne {
  libelle: string;
  montant: number;
  montantEmployeur?: number;
}

interface Props {
  mois: string;
  annee: string;
  lignes: Ligne[];
}

export function BulletinSummaryCard({ mois, annee, lignes }: Props) {
  const totalEmploye = lignes.reduce((sum, l) => sum + l.montant, 0);
  const totalEmployeur = lignes.reduce((sum, l) => sum + (l.montantEmployeur || 0), 0);
  const netAPayer = totalEmploye;

  return (
    <div className="rounded border shadow-sm p-4 bg-gray-50 space-y-2 text-sm text-gray-700">
      <h3 className="text-base font-semibold text-indigo-700 mb-2">
        Bulletin de paie : {mois}/{annee}
      </h3>

      <div className="space-y-1">
        {lignes.map((l, i) => (
          <BulletinLineRow
            key={i}
            libelle={l.libelle}
            montantEmploye={l.montant}
            montantEmployeur={l.montantEmployeur}
          />
        ))}
      </div>

      <BulletinTotals
        montantEmployeTotal={totalEmploye}
        montantEmployeurTotal={totalEmployeur}
        netAPayer={netAPayer}
      />
    </div>
  );
}
