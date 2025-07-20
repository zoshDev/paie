import React from "react";

interface FixedValueFieldProps {
  value?: string;
  onChange: (val: string) => void;
  error?: string;
}

export const FixedValueField: React.FC<FixedValueFieldProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className="space-y-1">
      {/* 🔹 Champ fixe */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border px-3 py-2 rounded text-sm ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="Ex: 75000 ou TX_IR"
      />
      {/* 🔹 Message d’erreur */}
      {error && <p className="text-red-500 text-sm">⚠️ {error}</p>}
    </div>
  );
};