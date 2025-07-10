import React from "react";
import GenericForm from "../../components/form/GenericForm";
import { categorieFields } from "../../pages/categories/categorieFields";
import type { Categorie } from "../../pages/categories/categoryType";

interface Props {
  initialData?: Partial<Categorie>;
  onSubmit: (data: Partial<Categorie>) => void;
}

const CategorieForm: React.FC<Props> = ({ initialData = {}, onSubmit }) => {
  return (
    <GenericForm
      fields={categorieFields}
      initialValues={initialData}
      onSubmit={onSubmit}
    />
  );
};

export default CategorieForm;
