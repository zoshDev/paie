import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Button from "../ui/Button";

interface Option {
  label: string;
  value: string | number | boolean;
}

interface ItemField {
  name: string;
  label: string;
  type: string;
  options?: Option[];
}

interface FormField extends ItemField {
  itemFields?: ItemField[]; // Pour multiselect/dynamic-list
}

interface FormSection {
  title: string;
  columns: number;
  fields: FormField[];
}

interface GenericFormStableWithSectionsProps {
  sections: FormSection[];
  initialValues: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const GenericFormStableWithSections: React.FC<GenericFormStableWithSectionsProps> = ({
  sections,
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Enregistrer"
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: initialValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {sections.map((section, idx) => (
        <div key={idx}>
          <h3 className="text-md font-semibold text-gray-700 mb-4">
            {section.title}
          </h3>

          <div className={`grid grid-cols-1 md:grid-cols-${section.columns} gap-6`}>
            {section.fields.map((field) => {
              if (field.type === "select") {
                return (
                  <div key={field.name} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <select {...register(field.name)} className="input">
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === "textarea") {
                return (
                  <div key={field.name} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <textarea {...register(field.name)} className="input" rows={3} />
                  </div>
                );
              }

              if (field.type === "checkbox") {
                return (
                  <div key={field.name} className="flex items-center space-x-2 mt-2">
                    <input type="checkbox" {...register(field.name)} />
                    <label className="text-sm font-medium">{field.label}</label>
                  </div>
                );
              }

              if (field.type === "multiselect" && field.itemFields) {
                const { fields: arrayFields, append, remove } = useFieldArray({
                  control,
                  name: field.name
                });

                return (
                  <div key={field.name} className="col-span-full">
                    <label className="text-sm font-medium block mb-2">
                      {field.label}
                    </label>
                    {arrayFields.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-2 gap-4 mb-4 p-3 border rounded">
                        {field.itemFields?.map((itemField) => (
                          <div key={itemField.name}>
                            <label className="block text-sm font-medium mb-1">
                              {itemField.label}
                            </label>
                            {itemField.type === "select" ? (
                              <select
                                {...register(`${field.name}.${index}.${itemField.name}`)}
                                className="input"
                              >
                                {itemField.options?.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : itemField.type === "checkbox" ? (
                              <input
                                type="checkbox"
                                {...register(`${field.name}.${index}.${itemField.name}`)}
                              />
                            ) : (
                              <input
                                type={itemField.type || "text"}
                                {...register(`${field.name}.${index}.${itemField.name}`)}
                                className="input"
                              />
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-xs text-red-600 hover:underline ml-auto"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => append({})}
                      className="text-sm text-blue-600 mt-2 hover:underline"
                    >
                      + Ajouter une rubrique
                    </button>
                  </div>
                );
              }

              return (
                <div key={field.name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    className="input"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default GenericFormStableWithSections;
