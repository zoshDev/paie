import React from "react";

interface DeleteConfirmationProps {
  count?: number; // nombre d'éléments à supprimer (1 ou plusieurs)
  label?: string; // exemple : "employés"
  message?: string; // message personnalisé facultatif
  ids?: string[]; // liste des IDs à supprimer pour affichage
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  count = 1,
  label = "élément(s)",
  message,
  ids,
  onCancel,
  onConfirm,
}) => {
  return (
    <div>
      <p>
        {message ||
          `Vous êtes sur le point de supprimer ${
            count > 1 ? `${count} ${label}` : `cet ${label.slice(0, -3)}`
          }.`}
      </p>

      {ids && ids.length > 0 && (
        <ul className="text-xs text-gray-500 mt-2 max-h-32 overflow-y-auto list-disc pl-5">
          {ids.slice(0, 5).map((id) => (
            <li key={id}>{id}</li>
          ))}
          {ids.length > 5 && <li>...et {ids.length - 5} autre(s)</li>}
        </ul>
      )}

      <p className="text-sm text-red-600 mt-2">Cette action est irréversible.</p>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
