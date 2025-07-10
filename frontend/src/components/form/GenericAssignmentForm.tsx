import React, { useState, useMemo, useCallback } from "react";
import { XMarkIcon, FunnelIcon, PlusIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

/**
 * Interface étendant les propriétés de base pour les entités cible
 */
interface EntityWithOptionalDescription {
  id: string;
  description?: string;
}

/**
 * Props génériques pour le composant GenericAssignmentForm
 * @template T - Type générique représentant la structure des entités cible
 */
export interface GenericAssignmentFormProps<T extends { id: string }> {
  /** IDs des entités source à assigner */
  sourceItemsIds: string[];
  
  /** Entités cible disponibles pour l'assignation */
  availableTargetEntities: T[];
  
  /** Fonction pour fermer la modale */
  onClose: () => void;
  
  /** Fonction appelée lors de la soumission avec les IDs source et cible */
  onSubmit: (sourceIds: string[], targetIds: string[]) => void;
  
  /** Indique si la soumission est en cours */
  isSubmitting?: boolean;
  
  /** Titre du formulaire d'assignation */
  title?: string;
  
  /** Description du formulaire */
  description?: string;
  
  /** Libellé pour les éléments source */
  sourceItemsLabel?: string;
  
  /** Texte placeholder pour le filtre des cibles */
  targetFilterPlaceholder?: string;
  
  /** Clé de la propriété à utiliser pour l'affichage du nom de l'entité cible */
  targetLabelKey?: keyof T;
  
  /** Clé de la propriété à utiliser comme valeur unique de l'entité cible */
  targetValueKey?: keyof T;
}

/**
 * Composant générique pour assigner des entités source à des entités cible
 * @template T - Type générique représentant la structure des entités cible
 */
function GenericAssignmentForm<T extends { id: string }>({
  sourceItemsIds,
  availableTargetEntities,
  onClose,
  onSubmit,
  isSubmitting = false,
  title = "Assignation d'entités",
  description = "Sélectionnez les cibles auxquelles vous souhaitez assigner les entités sélectionnées.",
  sourceItemsLabel = "Élément(s) à assigner",
  targetFilterPlaceholder = "Rechercher...",
  targetLabelKey = 'name' as keyof T,
  targetValueKey = 'id' as keyof T,
}: GenericAssignmentFormProps<T>) {
  // État pour le terme de recherche
  const [searchTerm, setSearchTerm] = useState("");
  
  // État pour les entités cibles sélectionnées
  const [selectedTargetEntities, setSelectedTargetEntities] = useState<T[]>([]);
  
  /**
   * Filtre les entités cible disponibles en fonction du terme de recherche
   * La recherche est insensible à la casse et s'applique aux valeurs de targetLabelKey et targetValueKey
   */
  const filteredAvailableTargetEntities = useMemo(() => {
    if (!searchTerm.trim()) {
      return availableTargetEntities.filter(entity => 
        !selectedTargetEntities.some(selected => selected[targetValueKey] === entity[targetValueKey])
      );
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return availableTargetEntities.filter(entity => {
      // Vérifier si l'entité est déjà sélectionnée
      const isAlreadySelected = selectedTargetEntities.some(
        selected => selected[targetValueKey] === entity[targetValueKey]
      );
      
      if (isAlreadySelected) return false;
      
      // Recherche dans la propriété d'affichage
      const labelValue = String(entity[targetLabelKey] || '').toLowerCase();
      if (labelValue.includes(lowerSearchTerm)) return true;
      
      // Recherche dans la propriété de valeur
      const idValue = String(entity[targetValueKey] || '').toLowerCase();
      return idValue.includes(lowerSearchTerm);
    });
  }, [availableTargetEntities, searchTerm, selectedTargetEntities, targetLabelKey, targetValueKey]);

  /**
   * Ajoute une entité cible à la sélection
   */
  const handleAddTarget = useCallback((entity: T) => {
    setSelectedTargetEntities(prev => {
      // Vérifier si l'entité est déjà sélectionnée
      if (prev.some(item => item[targetValueKey] === entity[targetValueKey])) {
        return prev;
      }
      return [...prev, entity];
    });
    
    // Supprimé : Notification de succès pour chaque ajout
  }, [targetValueKey]);

  /**
   * Retire une entité cible de la sélection
   */
  const handleRemoveTarget = useCallback((entityId: any) => {
    setSelectedTargetEntities(prev => {
      const filtered = prev.filter(item => item[targetValueKey] !== entityId);
      return filtered;
    });
    
    // Supprimé : Notification d'information pour chaque suppression
  }, [targetValueKey]);

  /**
   * Réinitialise la sélection des entités cibles
   */
  const handleResetSelection = useCallback(() => {
    setSelectedTargetEntities([]);
    
    // Supprimé : Notification d'information pour la réinitialisation
  }, []);

  /**
   * Soumet le formulaire avec les IDs source et cible
   */
  const handleSubmit = useCallback(() => {
    if (selectedTargetEntities.length === 0) {
      toast.error("Veuillez sélectionner au moins une cible");
      return;
    }
    
    // Extraction des IDs des entités cibles sélectionnées
    const targetIds = selectedTargetEntities.map(entity => String(entity[targetValueKey]));
    
    // Notification de succès pour la soumission
    toast.success(`${selectedTargetEntities.length} cible(s) sélectionnée(s) avec succès`);
    
    // Appel de la fonction de soumission
    onSubmit(sourceItemsIds, targetIds);
  }, [onSubmit, selectedTargetEntities, sourceItemsIds, targetValueKey]);

  /**
   * Détails sur l'opération d'assignation en cours
   */
  const operationDetails = useMemo(() => {
    const sourceCount = sourceItemsIds.length;
    const targetCount = selectedTargetEntities.length;
    
    return {
      sourceText: `${sourceCount} ${sourceItemsLabel}${sourceCount > 1 ? 's' : ''}`,
      targetText: `${targetCount} cible${targetCount > 1 ? 's' : ''}`
    };
  }, [sourceItemsIds, sourceItemsLabel, selectedTargetEntities]);

  /**
   * Vérifie si une entité est dans la liste des entités sélectionnées
   */
  const isEntitySelected = useCallback((entityId: any) => {
    return selectedTargetEntities.some(entity => entity[targetValueKey] === entityId);
  }, [selectedTargetEntities, targetValueKey]);

  return (
    <div className="space-y-6">
      {/* En-tête avec informations sur l'opération */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      </div>
      
      {/* Informations sur l'opération */}
      <div className="bg-indigo-50 p-4 rounded-lg flex items-center">
        <ChevronDoubleRightIcon className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" />
        <p className="text-sm text-indigo-700">
          Vous êtes sur le point d'assigner <span className="font-semibold">{operationDetails.sourceText}</span> à 
          {selectedTargetEntities.length > 0 
            ? <span className="font-semibold"> {operationDetails.targetText}</span> 
            : <span className="italic"> des cibles à sélectionner</span>}
        </p>
      </div>
      
      {/* Recherche de cibles */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
          <span>Rechercher des cibles</span>
          {selectedTargetEntities.length > 0 && (
            <button 
              onClick={handleResetSelection}
              className="text-xs text-indigo-600 hover:text-indigo-800"
              type="button"
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
            placeholder={targetFilterPlaceholder}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Liste des cibles sélectionnées */}
      {selectedTargetEntities.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Cibles sélectionnées ({selectedTargetEntities.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTargetEntities.map((entity) => {
              const label = String(entity[targetLabelKey] || entity[targetValueKey]);
              const value = String(entity[targetValueKey]);
              
              return (
                <div 
                  key={value}
                  className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm"
                >
                  <span>{label}</span>
                  <button 
                    onClick={() => handleRemoveTarget(entity[targetValueKey])}
                    className="ml-1 p-0.5 rounded-full hover:bg-indigo-200"
                    type="button"
                    aria-label={`Retirer ${label}`}
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Liste des cibles disponibles */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <p className="text-sm font-medium text-gray-700">
            Cibles disponibles {filteredAvailableTargetEntities.length > 0 && `(${filteredAvailableTargetEntities.length})`}
          </p>
        </div>
        <div className="divide-y max-h-60 overflow-y-auto">
          {filteredAvailableTargetEntities.length === 0 ? (
            <div className="p-4 text-center text-gray-500 italic text-sm">
              {searchTerm.trim() 
                ? "Aucune cible ne correspond à votre recherche" 
                : "Aucune cible disponible"}
            </div>
          ) : (
            filteredAvailableTargetEntities.map(entity => {
              const label = String(entity[targetLabelKey] || entity[targetValueKey]);
              const value = String(entity[targetValueKey]);
              
              // Vérifier de façon sécurisée si l'entité a une description
              const entityWithDesc = entity as unknown as EntityWithOptionalDescription;
              const secondaryInfo = entityWithDesc.description ? String(entityWithDesc.description) : "";
              
              // Vérifier si l'entité est déjà sélectionnée
              const isSelected = isEntitySelected(entity[targetValueKey]);
              
              return (
                <div 
                  key={value}
                  className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer ${
                    isSelected ? 'bg-indigo-50' : ''
                  }`}
                  onClick={() => handleAddTarget(entity)}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{label}</div>
                    {secondaryInfo && (
                      <div className="text-sm text-gray-500">{secondaryInfo}</div>
                    )}
                  </div>
                  <div className="flex items-center">
                    {isSelected ? (
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
              );
            })
          )}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button 
          variant="secondary"
          onClick={onClose}
          disabled={isSubmitting}
          type="button"
        >
          Annuler
        </Button>
        <Button 
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting || selectedTargetEntities.length === 0}
          type="button"
        >
          Assigner
        </Button>
      </div>
    </div>
  );
}

export default GenericAssignmentForm; 