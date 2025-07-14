import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Button from "@/components/ui/Button";
import type { FormSection, FormField, SelectOption as Option } from "@/components/form/types";
import RubriqueSelector from "@/components/form/RubriqueSelector";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  roleName: z.string().min(1),
  categorie: z.string().min(1),
}).passthrough();

interface GenericFormStableProps {
  sections: FormSection[];
  initialValues: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const GenericFormStable: React.FC<GenericFormStableProps> = ({
  sections,
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Enregistrer",
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    //formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {sections.map((section: FormSection, sIndex: number) => (
        <div key={sIndex}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {section.title}
          </h3>
          <div className={`grid grid-cols-1 md:grid-cols-${section.columns} gap-6`}>
            {section.fields.map((field: FormField, fIndex: number) => {
              if (field.type === "select" && field.options) {
                return (
                  <div key={fIndex}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                    </label>
                    <select {...register(field.name)} className="input">
                      {field.options.map((opt: Option, oIdx: number) => (
                        <option key={oIdx} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === "textarea") {
                return (
                  <div key={fIndex}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                    </label>
                    <textarea {...register(field.name)} className="input" rows={3} />
                  </div>
                );
              }

              if (field.type === "checkbox") {
                return (
                  <div key={fIndex} className="flex items-center space-x-2">
                    <input type="checkbox" {...register(field.name)} />
                    <label className="text-sm font-medium">{field.label}</label>
                  </div>
                );
              }

              if (field.type === "multiselect" && field.itemFields) {
                const { fields: rubFields, append, remove } = useFieldArray({
                  control,
                  name: field.name,
                });

                return (
                  <div key={fIndex} className="col-span-full">
                    <label className="block text-sm font-semibold mb-2">
                      {field.label}
                    </label>
                    {rubFields.map((item, idx: number) => (
                      <div key={item.id} className="grid grid-cols-2 gap-4 p-4 border rounded mb-4">
                        {(field.itemFields ?? []).map((itemField: FormField, iIdx: number) => {
                          const fieldPath = `${field.name}.${idx}.${itemField.name}`;
                          return (
                            <div key={iIdx}>
                              <label className="block text-sm font-medium mb-1">
                                {itemField.label}
                              </label>
                              {itemField.type === "select" ? (
                                <select {...register(fieldPath)} className="input">
                                  {itemField.options?.map((opt: Option, optIdx: number) => (
                                    <option key={optIdx} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              ) : itemField.type === "checkbox" ? (
                                <input type="checkbox" {...register(fieldPath)} />
                              ) : (
                                <input
                                  type={itemField.type || "text"}
                                  {...register(fieldPath)}
                                  className="input"
                                />
                              )}
                            </div>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="text-xs text-red-600 ml-auto hover:underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => append({})}
                      className="text-sm text-blue-600 hover:underline mt-2"
                    >
                      + Ajouter une rubrique
                    </button>
                  </div>
                );
              }

              if (field.type === "rubriqueSelector") {
                return (
                  <div key={fIndex} className="col-span-full">
                    <label className="block text-sm font-semibold mb-2">
                      {field.label}
                    </label>
                    <RubriqueSelector
                      selectedRubriques={watch(field.name) || []}
                      onChange={(rubriques) => setValue(field.name, rubriques)}
                    />
                  </div>
                );
              }

              return (
                <div key={fIndex}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    {...register(field.name)}
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

export default GenericFormStable;
