// 📁 src/pages/employee/paie/BulletinLineRow.tsx

import React from "react";

interface Props {
  libelle: string;
  montantEmploye: number;
  montantEmployeur?: number;
}

export function BulletinLineRow({ libelle, montantEmploye, montantEmployeur }: Props) {
  return (
    <div className="flex justify-between items-center py-1 border-b text-sm text-gray-700">
      <span className="font-medium">{libelle}</span>
      
      <div className="flex gap-x-6 text-right">
        <span className="text-gray-800">
          {montantEmploye.toLocaleString()} FCFA
        </span>

        {typeof montantEmployeur === "number" && (
          <span className="text-gray-500">
            {montantEmployeur.toLocaleString()} FCFA
          </span>
        )}
      </div>
    </div>
  );
}
