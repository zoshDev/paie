import React from "react";

interface Tranche {
  min: number;
  max: number;
  valeur: number;
}

interface IntervalFieldValue {
  base: number;
  tranches: Tranche[];
}

interface IntervalFieldProps {
  value: IntervalFieldValue;
  onChange: (val: IntervalFieldValue) => void;
  error?: string;
}

export const IntervalField: React.FC<IntervalFieldProps> = ({
  value,
  onChange,
  error,
}) => {
  const updateTranche = (index: number, field: keyof Tranche, val: number) => {
    const updated = [...value.tranches];
    updated[index] = { ...updated[index], [field]: val };
    onChange({ ...value, tranches: updated });
  };

  const addTranche = () => {
    onChange({
      ...value,
      tranches: [...value.tranches, { min: 0, max: 0, valeur: 0 }],
    });
  };

  const removeTranche = (index: number) => {
    const updated = value.tranches.filter((_, i) => i !== index);
    onChange({ ...value, tranches: updated });
  };

  return (
    <div className="space-y-4">
      {/* 🔹 Base de calcul */}
      <div>
        <label className="text-sm font-medium">Base</label>
        <input
          type="number"
          value={value.base}
          onChange={(e) => onChange({ ...value, base: Number(e.target.value) })}
          className="w-full border px-3 py-2 rounded text-sm"
          placeholder="Ex: 875000"
        />
      </div>

      {/* 🔹 Tableau des tranches */}
      <div className="space-y-2">
        {value.tranches.map((tranche, index) => (
          <div key={index} className="grid grid-cols-4 gap-3 items-center">
            <input
              type="number"
              value={tranche.min}
              onChange={(e) =>
                updateTranche(index, "min", Number(e.target.value))
              }
              className="border px-2 py-1 rounded text-sm"
              placeholder="Min"
            />
            <input
              type="number"
              value={tranche.max}
              onChange={(e) =>
                updateTranche(index, "max", Number(e.target.value))
              }
              className="border px-2 py-1 rounded text-sm"
              placeholder="Max"
            />
            <input
              type="number"
              value={tranche.valeur}
              onChange={(e) =>
                updateTranche(index, "valeur", Number(e.target.value))
              }
              className="border px-2 py-1 rounded text-sm"
              placeholder="Valeur"
            />
            <button
              type="button"
              onClick={() => removeTranche(index)}
              className="text-red-500 text-xs underline"
            >
              Supprimer
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTranche}
          className="text-sm text-blue-600 underline"
        >
          + Ajouter une tranche
        </button>
      </div>

      {/* 🔹 Message d’erreur */}
      {error && <p className="text-red-500 text-sm">⚠️ {error}</p>}
    </div>
  );
};
