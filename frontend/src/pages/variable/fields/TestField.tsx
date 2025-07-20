import React from "react";

interface TestFieldValue {
  expression: string;
  valeur: {
    True: string;
    False: string;
  };
}

interface TestFieldProps {
  value: TestFieldValue;
  onChange: (val: TestFieldValue) => void;
  error?: string;
}

export const TestField: React.FC<TestFieldProps> = ({
  value,
  onChange,
  error,
}) => {
  const update = (field: keyof TestFieldValue, val: string) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

  const updateResult = (key: "True" | "False", val: string) => {
    onChange({
      ...value,
      valeur: {
        ...value.valeur,
        [key]: val,
      },
    });
  };

  return (
    <div className="space-y-3">
      {/* 🔹 Champ expression */}
      <div>
        <label className="text-sm font-medium">Expression</label>
        <input
          type="text"
          value={value.expression}
          onChange={(e) => update("expression", e.target.value)}
          placeholder="Ex: SALAIRE_BRUT > 750000"
          className={`w-full border px-3 py-2 rounded text-sm ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      </div>

      {/* 🔹 Résultat True / False */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Valeur si vrai</label>
          <input
            type="text"
            value={value.valeur.True}
            onChange={(e) => updateResult("True", e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
            placeholder="Ex: SALAIRE_BRUT"
          />
        </div>

        <div>
          <label className="text-sm">Valeur si faux</label>
          <input
            type="text"
            value={value.valeur.False}
            onChange={(e) => updateResult("False", e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
            placeholder="Ex: PRIME_TAXI"
          />
        </div>
      </div>

      {/* 🔹 Message d’erreur */}
      {error && <p className="text-red-500 text-sm">⚠️ {error}</p>}
    </div>
  );
};
