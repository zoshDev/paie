// src/components/form/IntervalEditor.tsx
import React from 'react';
import { PlusCircleIcon, MinusCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import type { IntervalValue, Tranche } from '@/types/forms'; // Importez les types depuis la source centrale
import { XCircleIcon } from '@heroicons/react/24/solid'; // Pour les icônes d'erreur

interface IntervalEditorProps {
  value: IntervalValue;
  onChange: (value: IntervalValue) => void;
  className?: string;
}

const IntervalEditor: React.FC<IntervalEditorProps> = ({ value, onChange, className }) => {
  // Initialisation des valeurs par défaut si 'value' est vide ou partiel
  const currentBase = value?.base ?? 0;
  const currentTranches = value?.tranches ?? [];

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, base: Number(e.target.value) });
  };

  const handleTrancheChange = (index: number, field: keyof Tranche, val: number) => {
    const newTranches = [...currentTranches];
    newTranches[index] = { ...newTranches[index], [field]: val };
    onChange({ ...value, tranches: newTranches });
  };

  const addTranche = () => {
    onChange({
      ...value,
      base: currentBase, // Assure que la base est conservée
      tranches: [...currentTranches, { min: 0, max: 0, valeur: 0 }],
    });
  };

  const removeTranche = (index: number) => {
    const newTranches = currentTranches.filter((_, i) => i !== index);
    onChange({ ...value, tranches: newTranches });
  };

  // Simple validation frontend pour les chevauchements ou incohérences
  const validateTranches = (tranches: Tranche[]) => {
    if (!tranches || tranches.length === 0) return { isValid: true, message: "" };

    // Tri par min pour faciliter la vérification des chevauchements
    const sortedTranches = [...tranches].sort((a, b) => a.min - b.min);

    for (let i = 0; i < sortedTranches.length; i++) {
      const current = sortedTranches[i];
      if (current.min > current.max) {
        return { isValid: false, message: `La tranche ${i + 1} a un 'min' supérieur à son 'max'.` };
      }
      if (i < sortedTranches.length - 1) {
        const next = sortedTranches[i + 1];
        // Vérifie si le max de la tranche actuelle est supérieur ou égal au min de la suivante
        // Si les intervalles sont exclusifs (ex: [0, 10[ et [10, 20[), alors `current.max >= next.min` est une erreur.
        // Si les intervalles sont inclusifs (ex: [0, 10] et [10, 20]), alors `current.max > next.min` est une erreur.
        // J'ai mis `>=` pour couvrir les chevauchements et les contiguïtés non souhaitées.
        if (current.max >= next.min) {
          return { isValid: false, message: `Les tranches ${i + 1} et ${i + 2} se chevauchent ou sont contiguës de manière invalide.` };
        }
      }
    }
    return { isValid: true, message: "Tranches valides." };
  };

  const trancheValidation = validateTranches(currentTranches);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Champ Base */}
      <div>
        <label htmlFor="interval-base" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Base de l'intervalle :
        </label>
        <input
          type="number"
          id="interval-base"
          value={currentBase}
          onChange={handleBaseChange}
          placeholder="Ex: SALAIRE_BRUT ou 100000"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          <InformationCircleIcon className="inline-block h-4 w-4 mr-1" />
          Peut être une valeur numérique ou le nom d'une variable (ex: SALAIRE_BRUT).
        </p>
      </div>

      {/* Gestion des Tranches */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">Tranches :</h4>
        {currentTranches.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Aucune tranche définie. Ajoutez-en une !</p>
        )}
        {currentTranches.map((tranche, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-750 relative">
            <div className="absolute top-2 right-2">
              <button
                type="button"
                onClick={() => removeTranche(index)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                aria-label={`Supprimer la tranche ${index + 1}`}
              >
                <MinusCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <div>
                <label htmlFor={`tranche-${index}-min`} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Min :</label>
                <input
                  type="number"
                  id={`tranche-${index}-min`}
                  placeholder="Min"
                  value={tranche.min}
                  onChange={(e) => handleTrancheChange(index, 'min', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor={`tranche-${index}-max`} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Max :</label>
                <input
                  type="number"
                  id={`tranche-${index}-max`}
                  placeholder="Max"
                  value={tranche.max}
                  onChange={(e) => handleTrancheChange(index, 'max', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor={`tranche-${index}-valeur`} className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Valeur :</label>
                <input
                  type="number"
                  id={`tranche-${index}-valeur`}
                  placeholder="Valeur"
                  value={tranche.valeur}
                  onChange={(e) => handleTrancheChange(index, 'valeur', Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addTranche}
          className="flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:text-white dark:hover:bg-indigo-600"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" /> Ajouter une tranche
        </button>
      </div>

      {/* Message de validation des tranches */}
      {!trancheValidation.isValid && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <XCircleIcon className="h-5 w-5" />
          <span>{trancheValidation.message}</span>
        </div>
      )}
    </div>
  );
};

export default IntervalEditor;
