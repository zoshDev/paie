import React, { useState, useEffect } from "react";
import type { ProfilPaie, ProfilPaieRubrique } from "../../pages/profilPaie/types";
import { profilPaieFields } from "../../pages/profilPaie/profilPaieField";
import RubriqueSelector from "./RubriqueSelector";
import GenericForm from "./GenericForm";

interface ProfilPaieFormProps {
  initialData?: Partial<ProfilPaie>;
  onSubmit: (data: Partial<ProfilPaie>) => void;
  isSubmitting?: boolean;
}

const ProfilPaieForm: React.FC<ProfilPaieFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
}) => {
  // État local pour les rubriques
  const [selectedRubriques, setSelectedRubriques] = useState<ProfilPaieRubrique[]>(
    initialData.rubriques || []
  );

  // Valeurs initiales pour le formulaire
  const formInitialValues = {
    code: initialData.code || "",
    nom: initialData.nom || "",
    categorie: initialData.categorie || "",
    description: initialData.description || "",
  };
  
  // Mettre à jour les rubriques lorsque les données initiales changent
  useEffect(() => {
    setSelectedRubriques(initialData.rubriques || []);
  }, [initialData]);

  // Gérer la soumission du formulaire avec les rubriques
  const handleFormSubmit = (formData: Record<string, any>) => {
    onSubmit({
      ...formData,
      rubriques: selectedRubriques,
    });
  };

  return (
    <div className="space-y-6">
      {/* Formulaire principal avec GenericForm */}
      <GenericForm
        fields={profilPaieFields}
        initialValues={formInitialValues}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Enregistrer"
      />
      
      {/* Section des rubriques */}
      <div>
        <h3 className="text-md font-semibold border-b pb-1 mb-3 text-gray-700">
          Rubriques associées
        </h3>
        <RubriqueSelector 
          selectedRubriques={selectedRubriques}
          onChange={setSelectedRubriques}
        />
      </div>
    </div>
  );
};

export default ProfilPaieForm; 