import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Tranche {
  min: number;
  max: number;
  valeur: number;
}

interface IntervalData {
  base: string | number;
  tranches: Tranche[];
}

interface IntervalEditorProps {
  value?: IntervalData;
  onChange: (value: IntervalData) => void;
  availableVariables?: Array<{ code: string; libelle: string }>;
}

const IntervalEditor: React.FC<IntervalEditorProps> = ({
  value = { base: '', tranches: [] },
  onChange,
  availableVariables = []
}) => {
  const [intervalData, setIntervalData] = useState<IntervalData>(value);

  useEffect(() => {
    setIntervalData(value);
  }, [value]);

  const handleBaseChange = (newBase: string) => {
    // Essayer de convertir en nombre si c'est possible
    const numericValue = parseFloat(newBase);
    const baseValue = !isNaN(numericValue) && newBase.trim() !== '' ? numericValue : newBase;
    
    const updated = { ...intervalData, base: baseValue };
    setIntervalData(updated);
    onChange(updated);
  };

  const handleTrancheChange = (index: number, field: keyof Tranche, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updatedTranches = [...intervalData.tranches];
    updatedTranches[index] = { ...updatedTranches[index], [field]: numValue };
    
    const updated = { ...intervalData, tranches: updatedTranches };
    setIntervalData(updated);
    onChange(updated);
  };

  const addTranche = () => {
    const newTranche: Tranche = { min: 0, max: 1000, valeur: 0 };
    const updated = { 
      ...intervalData, 
      tranches: [...intervalData.tranches, newTranche] 
    };
    setIntervalData(updated);
    onChange(updated);
  };

  const removeTranche = (index: number) => {
    const updatedTranches = intervalData.tranches.filter((_, i) => i !== index);
    const updated = { ...intervalData, tranches: updatedTranches };
    setIntervalData(updated);
    onChange(updated);
  };

  const getBaseDisplayValue = () => {
    if (typeof intervalData.base === 'number') {
      return intervalData.base.toString();
    }
    return intervalData.base || '';
  };

  return (
    <div className="space-y-4">
      {/* Base Field - GESTION HYBRIDE STRING/NUMBER */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Base (valeur numérique ou nom de variable)
        </label>
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Ex: 5000 ou salaire_brut"
            value={getBaseDisplayValue()}
            onChange={(e) => handleBaseChange(e.target.value)}
            className="w-full"
          />
          
          {/* Variables disponibles */}
          {availableVariables.length > 0 && (
            <div className="text-xs text-gray-500">
              Variables: {availableVariables.map(v => `${v.libelle} (${v.code})`).join(', ')}
            </div>
          )}
          
          {/* Indicateur du type détecté */}
          <div className="text-xs">
            Type détecté: 
            <span className={`ml-1 px-2 py-0.5 rounded ${
              typeof intervalData.base === 'number' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {typeof intervalData.base === 'number' ? 'Nombre' : 'Variable'}
            </span>
          </div>
        </div>
      </div>

      {/* Tranches */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Tranches d'intervalle</label>
          <Button
            type="button"
            onClick={addTranche}
            className="flex items-center gap-1 text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Ajouter
          </Button>
        </div>

        <div className="space-y-3">
          {intervalData.tranches.map((tranche, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Min</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={tranche.min}
                    onChange={(e) => handleTrancheChange(index, 'min', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Max</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={tranche.max}
                    onChange={(e) => handleTrancheChange(index, 'max', e.target.value)}
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Taux/Valeur</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={tranche.valeur}
                    onChange={(e) => handleTrancheChange(index, 'valeur', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <Button
                type="button"
                onClick={() => removeTranche(index)}
                className="text-red-600 hover:bg-red-50 p-2"
                title="Supprimer cette tranche"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          {intervalData.tranches.length === 0 && (
            <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-md">
              <p>Aucune tranche définie</p>
              <p className="text-xs mt-1">Cliquez sur "Ajouter" pour définir les tranches d'intervalle</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview JSON */}
      <div className="bg-gray-50 p-3 rounded-md border">
        <h4 className="text-sm font-medium mb-2 text-gray-700">📋 Aperçu structure:</h4>
        <pre className="text-xs text-gray-600 overflow-x-auto">
{JSON.stringify(intervalData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default IntervalEditor;