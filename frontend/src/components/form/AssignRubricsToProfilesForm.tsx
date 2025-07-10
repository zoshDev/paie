import React, { useState,  useMemo } from "react";
import { XMarkIcon, FunnelIcon, PlusIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";
import type { PayrollProfile } from "../../models/payrollProfiles";

// Données de test pour simuler des profils de paie
const MOCK_PROFILES: PayrollProfile[] = [
  { id: "profile1", name: "Profil Standard", description: "Profil de paie standard pour les employés permanents", isDefault: true, items: [] },
  { id: "profile2", name: "Profil Contractuel", description: "Profil pour employés sous contrat à durée déterminée", isDefault: false, items: [] },
  { id: "profile3", name: "Profil Direction", description: "Profil pour les membres de la direction", isDefault: false, items: [] },
  { id: "profile4", name: "Profil Stage", description: "Profil pour les stagiaires", isDefault: false, items: [] },
  { id: "profile5", name: "Profil Consultant", description: "Profil pour les consultants externes", isDefault: false, items: [] }
];

interface AssignRubricsToProfilesFormProps {
  selectedRubricIds: string[]; // IDs des rubriques à assigner
  onClose: () => void; // Fermeture de la modale
  onSubmit: (rubricIds: string[], profilIds: string[]) => void; // Soumission du formulaire
}

const AssignRubricsToProfilesForm: React.FC<AssignRubricsToProfilesFormProps> = ({
  selectedRubricIds,
  onClose,
  onSubmit
}) => {
  // État pour le terme de recherche
  const [searchTerm, setSearchTerm] = useState("");
  
  // État pour les profils sélectionnés
  const [selectedProfils, setSelectedProfils] = useState<string[]>([]);
  
  // Profils filtrés en fonction du terme de recherche
  const filteredProfiles = useMemo(() => {
    return MOCK_PROFILES.filter(profile => 
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Fonction pour gérer la sélection/désélection d'un profil
  const handleProfilToggle = (profilId: string) => {
    setSelectedProfils(prev => {
      if (prev.includes(profilId)) {
        return prev.filter(id => id !== profilId);
      } else {
        return [...prev, profilId];
      }
    });
  };

  // Fonction pour retirer un profil de la sélection
  const handleRemoveProfil = (profilId: string) => {
    setSelectedProfils(prev => prev.filter(id => id !== profilId));
  };

  // Fonction pour réinitialiser la sélection
  const handleResetSelection = () => {
    setSelectedProfils([]);
    toast.success("Sélection réinitialisée");
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = () => {
    if (selectedProfils.length === 0) {
      toast.error("Veuillez sélectionner au moins un profil de paie");
      return;
    }
    
    onSubmit(selectedRubricIds, selectedProfils);
  };

  // Détails sur l'opération en cours
  const operationDetails = useMemo(() => {
    const rubricCount = selectedRubricIds.length;
    const profilCount = selectedProfils.length;
    
    return {
      rubricText: `${rubricCount} rubrique${rubricCount > 1 ? 's' : ''}`,
      profilText: `${profilCount} profil${profilCount > 1 ? 's' : ''}`
    };
  }, [selectedRubricIds, selectedProfils]);

  return (
    <div className="space-y-6">
      {/* Informations sur l'opération */}
      <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
        <ChevronDoubleRightIcon className="w-5 h-5 text-indigo-600 mr-2" />
        <p className="text-sm text-indigo-700">
          Vous êtes sur le point d'assigner <span className="font-semibold">{operationDetails.rubricText}</span> à 
          {selectedProfils.length > 0 
            ? <span className="font-semibold"> {operationDetails.profilText}</span> 
            : <span className="italic"> des profils de paie</span>}
        </p>
      </div>
      
      {/* Recherche de profils */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
          <span>Rechercher des profils de paie</span>
          {selectedProfils.length > 0 && (
            <button 
              onClick={handleResetSelection}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              Réinitialiser la sélection
            </button>
          )}
        </label>
        <div className="relative">
          <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom ou description..."
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Liste des profils sélectionnés */}
      {selectedProfils.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Profils sélectionnés:</p>
          <div className="flex flex-wrap gap-2">
            {selectedProfils.map(profilId => {
              const profil = MOCK_PROFILES.find(p => p.id === profilId);
              return (
                <div 
                  key={profilId}
                  className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm"
                >
                  <span>{profil?.name}</span>
                  <button 
                    onClick={() => handleRemoveProfil(profilId)}
                    className="ml-1 p-0.5 rounded-full hover:bg-indigo-200"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Liste des profils disponibles */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <p className="text-sm font-medium text-gray-700">Profils disponibles</p>
        </div>
        <div className="divide-y max-h-60 overflow-y-auto">
          {filteredProfiles.length === 0 ? (
            <div className="p-4 text-center text-gray-500 italic text-sm">
              Aucun profil ne correspond à votre recherche
            </div>
          ) : (
            filteredProfiles.map(profil => (
              <div 
                key={profil.id}
                className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer ${
                  selectedProfils.includes(profil.id) ? 'bg-indigo-50' : ''
                }`}
                onClick={() => handleProfilToggle(profil.id)}
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{profil.name}</div>
                  <div className="text-sm text-gray-500">{profil.description}</div>
                </div>
                <div className="flex items-center">
                  {selectedProfils.includes(profil.id) ? (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-indigo-600 text-white">
                      <PlusIcon className="w-4 h-4 transform rotate-45" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center border border-indigo-600 text-indigo-600">
                      <PlusIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button 
          variant="secondary"
          onClick={onClose}
        >
          Annuler
        </Button>
        <Button 
          variant="primary"
          onClick={handleSubmit}
          disabled={selectedProfils.length === 0}
        >
          Assigner
        </Button>
      </div>
    </div>
  );
};

export default AssignRubricsToProfilesForm; 