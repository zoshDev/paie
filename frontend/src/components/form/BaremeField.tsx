// components/ui/form/BaremeField.tsx
import React, { useState, useCallback } from "react";
import {
  TrashIcon,
  PlusIcon,
  ExclamationCircleIcon,
  ArrowUturnLeftIcon
} from "@heroicons/react/24/outline";

export interface Tranche {
  min: number;
  max: number;
  taux: number;
}

interface BaremeFieldProps {
  value: Tranche[];
  onChange: (tranches: Tranche[]) => void;
  className?: string;
}

const BaremeField: React.FC<BaremeFieldProps> = ({
  value = [],
  onChange,
  className = ""
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  // Validation des tranches
  const validateTranches = useCallback((tranches: Tranche[]): string[] => {
    const validationErrors: string[] = [];

    for (let i = 0; i < tranches.length; i++) {
      const tranche = tranches[i];
      
      // Validation min < max
      if (tranche.min >= tranche.max) {
        validationErrors.push(`Tranche ${i + 1}: Le minimum doit être inférieur au maximum`);
      }

      // Validation des valeurs négatives
      if (tranche.min < 0 || tranche.max < 0) {
        validationErrors.push(`Tranche ${i + 1}: Les valeurs ne peuvent pas être négatives`);
      }

      if (tranche.taux < 0) {
        validationErrors.push(`Tranche ${i + 1}: Le taux ne peut pas être négatif`);
      }

      // Validation des chevauchements
      for (let j = i + 1; j < tranches.length; j++) {
        const autreTranche = tranches[j];
        
        if (
          (tranche.min <= autreTranche.max && tranche.max >= autreTranche.min) ||
          (autreTranche.min <= tranche.max && autreTranche.max >= tranche.min)
        ) {
          validationErrors.push(`Chevauchement entre les tranches ${i + 1} et ${j + 1}`);
        }
      }
    }

    return validationErrors;
  }, []);

  // Ajouter une nouvelle tranche
  const ajouterTranche = useCallback(() => {
    const dernierMax = value.length > 0 ? Math.max(...value.map(t => t.max)) : 0;
    const nouvelleTranche: Tranche = {
      min: dernierMax,
      max: dernierMax + 1000,
      taux: 0
    };
    
    const nouvellesTranches = [...value, nouvelleTranche];
    onChange(nouvellesTranches);
    
    // Valider les nouvelles tranches
    const erreurs = validateTranches(nouvellesTranches);
    setErrors(erreurs);
  }, [value, onChange, validateTranches]);

  // Reset toutes les tranches
  const resetTranches = useCallback(() => {
    onChange([]);
    setErrors([]);
  }, [onChange]);

  // Supprimer une tranche
  const supprimerTranche = useCallback((index: number) => {
    const nouvellesTranches = value.filter((_, i) => i !== index);
    onChange(nouvellesTranches);
    
    // Valider après suppression
    const erreurs = validateTranches(nouvellesTranches);
    setErrors(erreurs);
  }, [value, onChange, validateTranches]);

  // Modifier une tranche
  const modifierTranche = useCallback((index: number, champ: keyof Tranche, valeur: number) => {
    const nouvellesTranches = value.map((tranche, i) => 
      i === index ? { ...tranche, [champ]: valeur } : tranche
    );
    onChange(nouvellesTranches);
    
    // Valider après modification
    const erreurs = validateTranches(nouvellesTranches);
    setErrors(erreurs);
  }, [value, onChange, validateTranches]);

  return (
    <div className={`space-y-3 ${className} w-full`}>
      {/* En-tête */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700">
          Tranches du barème progressif
        </span>
        <div className="flex gap-2">
          {value.length > 0 && (
            <button
              type="button"
              onClick={resetTranches}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              title="Supprimer toutes les tranches"
            >
              <ArrowUturnLeftIcon className="w-3 h-3" />
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={ajouterTranche}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
          >
            <PlusIcon className="w-3 h-3" />
            Ajouter une tranche
          </button>
        </div>
      </div>

      {/* Messages d'erreur */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-2">
          <div className="flex items-center gap-2 text-red-700 text-xs font-medium mb-1">
            <ExclamationCircleIcon className="w-4 h-4" />
            Erreurs de validation
          </div>
          <ul className="text-red-600 text-xs space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tableau des tranches */}
      {value.length > 0 ? (
        <div className="border border-gray-200 rounded overflow-x-auto">
          {/* En-tête du tableau */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 border-b text-xs font-medium text-gray-700">
            <div>Minimum (FCFA)</div>
            <div>Maximum (FCFA)</div>
            <div>Taux (%)</div>
            <div className="text-center">Actions</div>
          </div>

          {/* Corps du tableau */}
          <div className="divide-y divide-gray-200">
            {value.map((tranche, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 p-3 items-center hover:bg-gray-50 transition-colors">
                {/* Minimum */}
                <div>
                  <input
                    type="number"
                    value={tranche.min}
                    onChange={(e) => modifierTranche(index, 'min', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>

                {/* Maximum */}
                <div>
                  <input
                    type="number"
                    value={tranche.max}
                    onChange={(e) => modifierTranche(index, 'max', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                    step="0.01"
                    placeholder="1000"
                  />
                </div>

                {/* Taux */}
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      value={tranche.taux}
                      onChange={(e) => modifierTranche(index, 'taux', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 pr-6 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="0"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => supprimerTranche(index)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Supprimer cette tranche"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* État vide */
        <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
          <div className="text-gray-500 text-sm mb-2">
            Aucune tranche définie
          </div>
          <button
            type="button"
            onClick={ajouterTranche}
            className="text-indigo-600 hover:text-indigo-800 text-sm underline"
          >
            Ajouter la première tranche
          </button>
        </div>
      )}

      {/* Résumé */}
      {value.length > 0 && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          {value.length} tranche{value.length > 1 ? 's' : ''} définie{value.length > 1 ? 's' : ''}
          {errors.length === 0 && (
            <span className="text-green-600 ml-2">✓ Configuration valide</span>
          )}
        </div>
      )}
    </div>
  );
};

export default BaremeField;