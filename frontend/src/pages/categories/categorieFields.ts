import type { FormField } from "../../components/form/GenericForm";

export const categorieFields: FormField[] = [
  {
    name: "code",
    label: "Code",
    type: "text",
    required: true,
  },
  {
    name: "nom",
    label: "Nom",
    type: "text",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
  },
];

export const categorieTypeFields: FormField[] = [
  {
    name: "code",
    label: "Code",
    type: "text",
    required: true,
  },
  {
    name: "nom",
    label: "Nom",
    type: "text",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
  },
];