import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (employee: {
    name: string;
    poste: string;
    categorie: string;
    echelon: string;
  }) => void;
}

const schema = yup.object().shape({
  name: yup.string().required('Nom requis'),
  poste: yup.string().required('Poste requis'),
  categorie: yup.string().required('Catégorie requise'),
  echelon: yup.string().required('Échelon requis'),
});

type FormValues = yup.InferType<typeof schema>;

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Ajouter un employé
        </h2>
        <form
          onSubmit={handleSubmit((values) => {
            onAdd(values);
            reset();
            onClose();
          })}
          className="flex flex-col gap-3"
        >
          <div>
            <input
              className="border rounded px-2 py-1 w-full"
              placeholder="Nom"
              {...register('name')}
            />
            {errors.name && (
              <div className="text-red-500 text-xs">{errors.name.message}</div>
            )}
          </div>
          <div>
            <input
              className="border rounded px-2 py-1 w-full"
              placeholder="Poste"
              {...register('poste')}
            />
            {errors.poste && (
              <div className="text-red-500 text-xs">{errors.poste.message}</div>
            )}
          </div>
          <div>
            <input
              className="border rounded px-2 py-1 w-full"
              placeholder="Catégorie"
              {...register('categorie')}
            />
            {errors.categorie && (
              <div className="text-red-500 text-xs">{errors.categorie.message}</div>
            )}
          </div>
          <div>
            <input
              className="border rounded px-2 py-1 w-full"
              placeholder="Échelon"
              {...register('echelon')}
            />
            {errors.echelon && (
              <div className="text-red-500 text-xs">{errors.echelon.message}</div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              disabled={isSubmitting}
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;