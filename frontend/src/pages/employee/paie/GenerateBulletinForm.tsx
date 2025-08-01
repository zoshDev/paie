import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { bulletinService } from "./BulletinService";
import { BulletinSummaryCard } from "./BulletinSummaryCard";
import { BulletinLoader } from "./BulletinLoader";
import { generateBulletinSchema } from "./generateBulletinSchema"; // ✅ Zod schema

interface Props {
  employeeId: number;
}

export function GenerateBulletinForm({ employeeId }: Props) {
  const [mois, setMois] = useState("07");
  const [annee, setAnnee] = useState("2025");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({}); // ✅ erreurs des champs

  const { mutate, data, isPending } = useMutation({
    mutationFn: () =>
      bulletinService.generateBulletin({
        employeId: employeeId,
        mois,
        annee,
      }),
  });

  // ✅ soumission avec validation Zod
  const handleGenerate = () => {
    const result = generateBulletinSchema.safeParse({ mois, annee });
    if (!result.success) {
      const errors: Record<string, string> = {};
      const fields = result.error.format();
      if (fields.mois?._errors) errors.mois = fields.mois._errors[0];
      if (fields.annee?._errors) errors.annee = fields.annee._errors[0];
      setFormErrors(errors);
      return;
    }

    // ✅ si valide → mutation backend
    setFormErrors({});
    mutate();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Générer un Bulletin de Paie</h2>

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
          {formErrors.mois && (
            <p className="text-xs text-red-600 mt-1">{formErrors.mois}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600">Année</label>
          <input
            type="number"
            value={annee}
            onChange={(e) => setAnnee(e.target.value)}
            className="px-2 py-1 border rounded w-24 text-sm"
          />
          {formErrors.annee && (
            <p className="text-xs text-red-600 mt-1">{formErrors.annee}</p>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
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
