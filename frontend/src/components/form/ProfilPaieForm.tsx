import React from "react";
import GenericFormStable from "@/pages/profilPaie/GenericFormStable";
import type { FormField } from "./GenericForm";

interface RoleProfilPaieFormData {
  roleName: string;
  categorie: string;
  description?: string;
}

interface ProfilPaieFormProps {
  initialData: Partial<RoleProfilPaieFormData>;
  onSubmit: (data: RoleProfilPaieFormData) => void;
  isSubmitting?: boolean;
}

const ProfilPaieForm: React.FC<ProfilPaieFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const fields: FormField[] = [
    {
      name: "roleName",
      label: "Nom du Profil",
      placeholder: "Ex: Gestionnaire RH",
      type: "text",
    },
    {
      name: "categorie",
      label: "Catégorie",
      type: "select",
      placeholder: "Ex: Cadre, Non Cadre",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Ex: Profil appliqué aux employés cadres",
    },
  ];

  const initialValues = {
    roleName: initialData.roleName || "",
    categorie: initialData.categorie || "",
    description: initialData.description || "",
  };

  return (
    <GenericFormStable
      fields={fields}
      initialValues={initialValues}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Enregistrer"
    />
  );
};

export default ProfilPaieForm;
