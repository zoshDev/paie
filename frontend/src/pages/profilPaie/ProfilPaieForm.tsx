import React from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import RubriqueSelector from "@/components/form/RubriqueSelector"; // si tu as ce composant
import GenericFormStable from "./GenericFormStable";

interface ProfilPaieFormProps {
  initialData: {
    roleName?: string;
    categorie?: string;
    description?: string;
    elements?: any[];
  };
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

const ProfilPaieForm: React.FC<ProfilPaieFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      roleName: initialData.roleName || "",
      categorie: initialData.categorie || "",
      description: initialData.description || "",
      elements: initialData.elements || [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nom */}
      <div>
        <label className="font-medium text-sm">Nom du Profil</label>
        <input
          type="text"
          {...register("roleName", { required: "Champ requis" })}
          className="input"
        />
        {errors.roleName && (
          <p className="text-xs text-red-500">{errors.roleName.message}</p>
        )}
      </div>

      {/* Catégorie */}
      <div>
        <label className="font-medium text-sm">Catégorie</label>
        <input
          type="text"
          {...register("categorie")}
          className="input"
        />
      </div>

      {/* Description */}
      <div>
        <label className="font-medium text-sm">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="input"
        />
      </div>

      {/* Rubriques */}
      {typeof RubriqueSelector !== "undefined" && (
        <RubriqueSelector
          selectedRubriques={getValues("elements")}
          onChange={(rubriques) => setValue("elements", rubriques)}
        />
      )}

      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default ProfilPaieForm;
