import { useQuery } from "@tanstack/react-query";
import { bulletinService } from "./BulletinService";
import type { BulletinPaie } from "./types";

interface Props {
  employeeId: number;
}

export function BulletinHistoryTable({ employeeId }: Props) {
  const { data, isLoading, error } = useQuery<BulletinPaie[]>({
    queryKey: ["bulletins", employeeId],
    queryFn: () => bulletinService.getByEmploye(employeeId),
  });

  if (isLoading) {
    return <p className="text-sm text-gray-500">Chargement de l'historique...</p>;
  }

  if (error || !data) {
    return <p className="text-sm text-red-600">Erreur lors du chargement.</p>;
  }

  return (
    <div className="border rounded shadow-sm bg-white p-4 text-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-2">
        Bulletins générés
      </h3>

      {data.length === 0 ? (
        <p className="text-gray-500">Aucun bulletin trouvé pour cet employé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 px-2">Période</th>
                <th className="py-2 px-2">Net à Payer</th>
                <th className="py-2 px-2">Lignes</th>
              </tr>
            </thead>
            <tbody>
              {data.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="py-2 px-2 font-medium">
                    {b.mois}/{b.annee}
                  </td>
                  <td className="py-2 px-2 text-green-700 font-semibold">
                    {b.montant_net.toLocaleString()} FCFA
                  </td>
                  <td className="py-2 px-2 text-gray-600">
                    {b.details.map((l) => l.libelle).join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
