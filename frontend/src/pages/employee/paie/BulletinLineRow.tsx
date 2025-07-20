import React from "react";

// 👉 Composant affichant une ligne du bulletin (libellé + montants)
interface Props {
  libelle: string;              // Désignation de la ligne (ex : CNPS, Salaire de base)
  montantEmploye: number;       // Montant à la charge de l'employé
  montantEmployeur?: number;    // Montant à la charge de l'employeur (optionnel)
}

export function BulletinLineRow({ libelle, montantEmploye, montantEmployeur }: Props) {
  return (
    <div className="flex justify-between items-center py-1 border-b text-sm text-gray-700">
      {/* Libellé de la ligne */}
      <span className="font-medium">{libelle}</span>
      
      {/* Montants employés / employeur alignés à droite */}
      <div className="flex gap-x-6 text-right">
        <span className="text-gray-800">
          {montantEmploye.toLocaleString()} FCFA
        </span>

        {/* Affichage du montant employeur uniquement s’il est fourni */}
        {typeof montantEmployeur === "number" && (
          <span className="text-gray-500">
            {montantEmployeur.toLocaleString()} FCFA
          </span>
        )}
      </div>
    </div>
  );
}
