import React from "react";

interface Variable {
  code: string;
  libelle?: string;
}

interface FormulaFieldProps {
  value: string;
  onChange: (val: string) => void;
  availableVariables: Variable[];
  error?: string;
}

export const FormulaField: React.FC<FormulaFieldProps> = ({
  value,
  onChange,
  availableVariables,
  error,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 🧠 Insère une variable à la fin ou au curseur
  const insertVariable = (code: string) => {
    if (!inputRef.current) return;

    const el = inputRef.current;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const newValue = value.slice(0, start) + code + value.slice(end);
    onChange(newValue);

    // repositionne le curseur après insertion
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + code.length, start + code.length);
    }, 0);
  };

  return (
    <div className="space-y-2">
      {/* 🔹 Barre des variables */}
      <div className="flex flex-wrap gap-2">
        {availableVariables.map((v) => (
          <button
            key={v.code}
            type="button"
            onClick={() => insertVariable(v.code)}
            className="bg-gray-100 hover:bg-gray-200 text-sm px-2 py-1 rounded border"
          >
            {v.code}
          </button>
        ))}
      </div>

      {/* 🔹 Champ de saisie */}
      <input
        ref={inputRef}
        type="text"
        className="w-full border px-3 py-2 rounded text-sm"
        placeholder="Ex: SALAIRE_BASE * 0.075"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* 🔹 Message d’erreur */}
      {error && <p className="text-red-500 text-sm">⚠️ {error}</p>}
    </div>
  );
};
