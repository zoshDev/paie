import React from "react";
import { useForm } from "react-hook-form";
import type { FormField } from "@/components/ui/GenericForm";
import Button from "@/components/ui/Button";

interface GenericFormStableProps {
  fields: FormField[];
  initialValues: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const GenericFormStable: React.FC<GenericFormStableProps> = ({
  fields,
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Soumettre"
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: initialValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <input
            type={field.type || "text"}
            {...register(field.name)}
            placeholder={field.placeholder}
            className={`input ${errors[field.name] ? "border-red-500" : ""}`}
          />
          {errors[field.name] && (
            <p className="text-xs text-red-500">
              {errors[field.name]?.message as string}
            </p>
          )}
        </div>
      ))}

      <Button type="submit" disabled={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
};

export default GenericFormStable;
