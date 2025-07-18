// 📄 src/pages/employee/paie/BulletinTotals.tsx

import React from "react";

interface Props {
  montantEmployeTotal: number;
  montantEmployeurTotal?: number;
  netAPayer?: number;
}

export function BulletinTotals({
  montantEmployeTotal,
  montantEmployeurTotal,
  netAPayer,
}: Props) {
  return (
    <div className="mt-4 border-t pt-4 space-y-2 text-sm text-gray-800">
      <div className="flex justify-between">
        <span className="font-semibold">Total Employé</span>
        <span>{montantEmployeTotal.toLocaleString()} FCFA</span>
      </div>

      {typeof montantEmployeurTotal === "number" && (
        <div className="flex justify-between text-gray-600">
          <span>Total Employeur</span>
          <span>{montantEmployeurTotal.toLocaleString()} FCFA</span>
        </div>
      )}

      {typeof netAPayer === "number" && (
        <div className="flex justify-between font-bold text-green-700 pt-2">
          <span>Net à Payer</span>
          <span>{netAPayer.toLocaleString()} FCFA</span>
        </div>
      )}
    </div>
  );
}
