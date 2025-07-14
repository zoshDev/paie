import React from "react";
import { profilPaieFormSections } from "./profilPaieFormSections"; // à placer si ce n’est pas déjà dans un fichier dédié
import GenericFormStable from "./GenericFormStable";

interface ProfilPaieFormProps {
  initialData: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

const ProfilPaieForm: React.FC<ProfilPaieFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false
}) => {
  return (
    <GenericFormStable
      sections={profilPaieFormSections}
      initialValues={initialData}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Enregistrer"
    />
  );
};

export default ProfilPaieForm;
