import React, { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface GenericDuplicateFormProps<T> {
  entityToDuplicate: T;
  onClose: () => void;
  onDuplicateSubmit: (duplicatedData: Partial<T>) => void;
  isSubmitting?: boolean;
  renderEntityForm: (
    initialData: Partial<T>,
    onSubmit: (data: Partial<T>) => void,
    isSubmitting: boolean,
    onClose: () => void
  ) => React.ReactNode;
  generateNewName: (originalName: string | undefined) => string;
  nameFieldName?: keyof T;
  modalTitle?: string;
  introText?: string;
}

const GenericDuplicateForm = <T extends { id: string }>({
  entityToDuplicate,
  onClose,
  onDuplicateSubmit,
  isSubmitting = false,
  renderEntityForm,
  generateNewName,
  nameFieldName = "nom" as keyof T,
  modalTitle = "Dupliquer l'élément",
  introText = "Modifiez le nom de la copie avant de la créer."
}: GenericDuplicateFormProps<T>) => {
  const { id, ...entityWithoutId } = entityToDuplicate;

  const [generatedName, setGeneratedName] = useState<string>(() =>
    generateNewName(entityToDuplicate[nameFieldName] as string | undefined)
  );

  useEffect(() => {
    setGeneratedName(generateNewName(entityToDuplicate[nameFieldName] as string | undefined));
  }, [entityToDuplicate?.id]);

  const initialDuplicateData = useMemo(() => ({
    ...entityWithoutId,
    [nameFieldName]: generatedName
  }) as Partial<T>, [entityWithoutId, nameFieldName, generatedName]);

  const [entityInitialData, setEntityInitialData] = useState<Partial<T> | null>(null);

  useEffect(() => {
    setEntityInitialData(null);
  }, [entityToDuplicate?.id]);

  const form = useForm<{ [key: string]: string }>({
    defaultValues: { [nameFieldName as string]: generatedName }
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmitName = (data: { [key: string]: string }) => {
    const updatedInitialData = {
      ...initialDuplicateData,
      [nameFieldName]: data[nameFieldName as string]
    };
    setEntityInitialData(updatedInitialData);
  };

  const handleEntityFormSubmit = (entityData: Partial<T>) => {
    try {
      onDuplicateSubmit(entityData);
      toast.success("Duplication réussie !");
    } catch (error) {
      console.error("Erreur lors de la duplication :", error);
      toast.error("Erreur lors de la duplication");
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{modalTitle}</h2>
        {introText && <p className="text-gray-600 text-sm">{introText}</p>}
      </div>

      {!entityInitialData && (
        <form onSubmit={handleSubmit(onSubmitName)} className="space-y-4 mb-6">
          <div>
            <label htmlFor={nameFieldName as string} className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              id={nameFieldName as string}
              type="text"
              disabled={isSubmitting}
              className={`w-full px-3 py-2 border rounded-md shadow-sm ${errors[nameFieldName as string] ? 'border-red-300' : 'border-gray-300'}`}
              {...register(nameFieldName as string, { required: "Le nom est obligatoire" })}
            />
            {errors[nameFieldName as string] && (
              <p className="mt-1 text-sm text-red-600">{errors[nameFieldName as string]?.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md" disabled={isSubmitting}>
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md" disabled={isSubmitting}>
              Créer la copie
            </button>
          </div>
        </form>
      )}

      {entityInitialData &&
        renderEntityForm(
          entityInitialData,
          handleEntityFormSubmit,
          isSubmitting,
          onClose
        )}
    </div>
  );
};

export default GenericDuplicateForm;
