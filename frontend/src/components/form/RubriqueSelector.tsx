import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import type { ElementSalaire } from "../../pages/profilPaie/types";

// Fonction simulée pour récupérer les rubriques
async function fetchRubrics(): Promise<ElementSalaire[]> {
  // À remplacer par l'appel API réel
  return [
     {
      id: 'RB001',
      code: 'SB',
      libelle: 'Salaire de Base',
      type_element: 'salaire',
      nature: 'fixe',
      imposable: true,
      ordre: 1,
    },
    {
      id: 'RB002',
      code: 'PRIME_ANCIENNETE',
      libelle: 'Prime d\'Ancienneté',
      type_element: 'gain',
      nature: 'fixe',
      imposable: true,
      ordre: 2,
    },
    {
      id: 'RB003',
      code: 'INDEMNITE_TRANSPORT',
      libelle: 'Indemnité de Transport',
      type_element: 'gain',
      nature: 'fixe',
      imposable: true,
      ordre: 3,
    },
    {
      id: 'RB004',
      code: 'COTIS_SANTÉ',
      libelle: 'Cotisation Santé',
      type_element: 'deduction',
      nature: 'fixe',
      imposable: true,
      ordre: 4,
    }
  ];
}

interface RubriqueSelectorProps {
  selectedRubriques: ElementSalaire[];
  onChange: (rubriques: ElementSalaire[]) => void;
}

const RubriqueSelector: React.FC<RubriqueSelectorProps> = ({ 
  selectedRubriques = [], 
  onChange
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Récupération des rubriques disponibles
  const { data: availableRubrics = [] } = useQuery<ElementSalaire[]>({
    queryKey: ["rubrics"],
    queryFn: fetchRubrics,
  });
  
  // Rubriques filtrées selon la recherche
  const filteredRubrics = availableRubrics.filter(
    rub => !selectedRubriques.some(sr => sr.id === rub.id) && 
    (
      rub.libelle.toLowerCase().includes(searchTerm.toLowerCase()) || 
      rub.code.toLowerCase().includes(searchTerm.toLowerCase())||
      rub.type_element.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Ajouter une rubrique au profil
  const handleAddRubrique = (rubric: ElementSalaire) => {
    const newRubrique: ElementSalaire = {
      id: rubric.id,
      libelle: rubric.libelle,
      code: rubric.code,
      type_element: rubric.type_element,
      nature: rubric.nature,
      imposable: rubric.imposable,
      ordre: selectedRubriques.length + 1
    };
    
    onChange([...selectedRubriques, newRubrique]);
  };

  // Supprimer une rubrique du profil
  const handleRemoveRubrique = (index: number) => {
    const newRubriques = [...selectedRubriques];
    newRubriques.splice(index, 1);
    
    // Réorganiser les ordres
    const updatedRubriques = newRubriques.map((rub, idx) => ({
      ...rub,
      ordre: idx + 1
    }));
    
    onChange(updatedRubriques);
  };

  // Déplacer une rubrique vers le haut ou le bas
  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === selectedRubriques.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newRubriques = [...selectedRubriques];
    
    // Échanger les positions
    [newRubriques[index], newRubriques[newIndex]] = [newRubriques[newIndex], newRubriques[index]];
    
    // Mettre à jour les ordres
    const updatedRubriques = newRubriques.map((rub, idx) => ({
      ...rub,
      ordre: idx + 1
    }));
    
    onChange(updatedRubriques);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <h4 className="text-sm font-medium mb-2">Rubriques sélectionnées</h4>
        
        {selectedRubriques.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Aucune rubrique sélectionnée</p>
        ) : (
          <div className="border rounded overflow-hidden">
            {selectedRubriques.map((rub, index) => (
              <div key={rub.id} className="flex items-center justify-between border-b last:border-b-0 p-2 hover:bg-gray-50">
                <div className="flex items-center space-x-2">
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                    {rub.ordre}
                  </span>
                  <span className="font-medium text-sm">{rub.code}</span>
                  <span className="text-sm text-gray-600">{rub.libelle}</span>
                </div>
                
                <div className="flex space-x-1">
                  <button 
                    type="button" 
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-indigo-500 disabled:opacity-30"
                  >
                    <ArrowUpIcon className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === selectedRubriques.length - 1}
                    className="p-1 text-gray-500 hover:text-indigo-500 disabled:opacity-30"
                  >
                    <ArrowDownIcon className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveRubrique(index)}
                    className="p-1 text-gray-500 hover:text-red-500"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Ajouter des rubriques</h4>
        
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une rubrique..."
          className="border rounded px-3 py-2 text-sm w-full mb-2"
        />
        
        <div className="border rounded max-h-40 overflow-y-auto">
          {filteredRubrics.length === 0 ? (
            <p className="p-2 text-sm text-gray-500 italic">
              {searchTerm ? "Aucune rubrique trouvée" : "Toutes les rubriques ont été ajoutées"}
            </p>
          ) : (
            filteredRubrics.map((rubric: ElementSalaire) => (
              <div key={rubric.id} className="flex items-center justify-between p-2 border-b last:border-b-0 hover:bg-gray-50">
                <div>
                  <span className="font-medium text-sm">{rubric.code}</span>
                  <span className="text-sm text-gray-600 ml-2">{rubric.libelle}</span>
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                    rubric.type_element === 'salaire' ? 'bg-blue-100 text-blue-800' : 
                    rubric.type_element === 'gain' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {rubric.type_element}
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleAddRubrique(rubric)}
                  className="flex items-center text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                >
                  <PlusIcon className="w-3 h-3 mr-1" />
                  Ajouter
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RubriqueSelector; 