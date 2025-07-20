import React from "react";

// 👉 Composant d'affichage des totaux du bulletin
interface Props {
  montantEmployeTotal: number;     // Somme totale des montants employés
  montantEmployeurTotal?: number; // Somme totale des montants employeurs
  netAPayer?: number;              // Montant net à payer (souvent égal au brut employé)
}

export function BulletinTotals({
  montantEmployeTotal,
  montantEmployeurTotal,
  netAPayer,
}: Props) {
  return (
    <div className="mt-4 border-t pt-4 space-y-2 text-sm text-gray-800">
      {/* Total Employé */}
      <div className="flex justify-between">
        <span className="font-semibold">Total Employé</span>
        <span>{montantEmployeTotal.toLocaleString()} FCFA</span>
      </div>

      {/* Total Employeur affiché si fourni */}
      {typeof montantEmployeurTotal === "number" && (
        <div className="flex justify-between text-gray-600">
          <span>Total Employeur</span>
          <span>{montantEmployeurTotal.toLocaleString()} FCFA</span>
        </div>
      )}

      {/* Net à Payer affiché si fourni */}
      {typeof netAPayer === "number" && (
        <div className="flex justify-between font-bold text-green-700 pt-2">
          <span>Net à Payer</span>
          <span>{netAPayer.toLocaleString()} FCFA</span>
        </div>
      )}
    </div>
  );
}
