import React from "react";
import GenericForm from "./GenericForm";
import { rubricFormSections } from "./rubricFormSections";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import type { Rubric } from "../../pages/rubric/types";

interface RubricFormProps {
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
  onClose?: () => void;
  entity?: Rubric | null;
  mode?: "create" | "edit";
}

const RubricForm: React.FC<RubricFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  onClose,
  entity,
  mode = "create"
}) => {
  // Utiliser les données de l'entité si disponibles (pour le mode edit)
  const formData = entity || initialData;
  
  const handleSubmit = (data: Record<string, any>) => {
    try {
      // Nous pouvons voir les données dans la console grâce à la modification de GenericForm
      console.log("Données soumises:", data);
      
      // Appeler la fonction onSubmit passée en props
      onSubmit(data);
      
      // Afficher une notification de succès
      toast.success(`La rubrique a été ${mode === "edit" ? "modifiée" : "créée"} avec succès.`);
      
      // Fermer la modale si la fonction onClose est disponible
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement de la rubrique.");
    }
  };

  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {mode === "create" ? "Nouvelle rubrique de paie" : "Modifier la rubrique"}
      </h2>
      
      <GenericForm
        sections={rubricFormSections}
        initialValues={formData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={mode === "create" ? "Créer la rubrique" : "Mettre à jour"}
        backgroundIllustration={<BuildingLibraryIcon className="w-64 h-64" />}
      />
    </div>
  );
};

export default RubricForm;