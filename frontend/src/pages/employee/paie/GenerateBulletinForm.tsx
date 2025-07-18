import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { bulletinService } from "./BulletinService";
import { BulletinSummaryCard } from "./BulletinSummaryCard";
import { BulletinLoader } from "./BulletinLoader";

interface Props {
  employeeId: number;
}

export function GenerateBulletinForm({ employeeId }: Props) {
  const [mois, setMois] = useState("07");
  const [annee, setAnnee] = useState("2025");

  const { mutate, data, isPending } = useMutation({
    mutationFn: () =>
      bulletinService.generateBulletin({
        employeId: employeeId,
        mois,
        annee,
      }),
  });

  return (
    <div className="space-y-6">
      {/* Formulaire Mois / Année */}
      <div className="flex gap-6 items-end">
        <div>
          <label className="text-sm text-gray-600">Mois</label>
          <select
            value={mois}
            onChange={(e) => setMois(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            {["01","02","03","04","05","06","07","08","09","10","11","12"].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Année</label>
          <input
            type="number"
            value={annee}
            onChange={(e) => setAnnee(e.target.value)}
            className="px-2 py-1 border rounded w-24 text-sm"
          />
        </div>

        <button
          onClick={() => mutate()}
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
        >
          Générer le bulletin
        </button>
      </div>

      {/* Loader / Résultat */}
      {isPending && <BulletinLoader />}

      {data && (
        <BulletinSummaryCard
          mois={mois}
          annee={annee}
          lignes={data.details}
        />
      )}
    </div>
  );
}
