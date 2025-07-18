import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { bulletinService } from "./BulletinService";
import type { BulletinPaie } from "./types";
import { BulletinSummaryCard } from "./BulletinSummaryCard";
import { BulletinLoader } from "./BulletinLoader";

interface Props {
  employeeId: number;
}

export function ReevaluateBulletinForm({ employeeId }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: bulletins, isLoading } = useQuery({
    queryKey: ["bulletins", employeeId],
    queryFn: () => bulletinService.getByEmploye(employeeId),
  });

  const { mutate, data, isPending } = useMutation({
    mutationFn: () =>
      selectedId ? bulletinService.reevaluateBulletin(selectedId) : Promise.resolve(),
  });

  return (
    <div className="space-y-4 text-sm">
      <h3 className="font-semibold text-gray-700">Réévaluer un bulletin existant</h3>

      {/* Sélecteur de bulletin */}
      {isLoading ? (
        <p className="text-gray-500">Chargement…</p>
      ) : (
        <select
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="px-2 py-1 border rounded w-full"
        >
          <option value="" disabled>-- Choisir un bulletin --</option>
          {bulletins?.map((b) => (
            <option key={b.id} value={b.id}>
              {b.mois}/{b.annee} — Net : {b.montant_net.toLocaleString()} FCFA
            </option>
          ))}
        </select>
      )}

      <button
        disabled={!selectedId}
        onClick={() => mutate()}
        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        Réévaluer le bulletin
      </button>

      {/* Résultat */}
      {isPending && <BulletinLoader />}
      {data && (
        <BulletinSummaryCard
          mois={data.mois}
          annee={data.annee}
          lignes={data.details}
        />
      )}
    </div>
  );
}
