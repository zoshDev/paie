/**
 * Composant ConfirmModal
 *
 * Modale de confirmation réutilisable pour valider une action sensible (suppression, etc.).
 *
 * Props :
 * - open         : boolean   | Affiche ou masque la modale.
 * - title        : string?   | Titre de la modale (par défaut "Confirmation").
 * - message      : string?   | Message affiché dans la modale.
 * - confirmLabel : string?   | Texte du bouton de confirmation (par défaut "Confirmer").
 * - cancelLabel  : string?   | Texte du bouton d'annulation (par défaut "Annuler").
 * - onClose      : () => void| Fonction appelée lors de la fermeture de la modale.
 * - onConfirm    : () => void| Fonction appelée lors de la confirmation.
 * - confirmColor : string?   | Classes Tailwind pour la couleur du bouton de confirmation.
 *
 * Exemple d'utilisation :
 *
 * ```tsx
 * import React, { useState } from 'react';
 * import ConfirmModal from './ConfirmModal';
 *
 * const ExempleSuppression = () => {
 *   const [open, setOpen] = useState(false);
 *   const handleDelete = () => {
 *     // Action de suppression ici
 *     setOpen(false);
 *   };
 *   return (
 *     <>
 *       <button onClick={() => setOpen(true)}>Supprimer</button>
 *       <ConfirmModal
 *         open={open}
 *         title="Confirmer la suppression"
 *         message="Êtes-vous sûr de vouloir supprimer cet élément ?"
 *         confirmLabel="Supprimer"
 *         cancelLabel="Annuler"
 *         onClose={() => setOpen(false)}
 *         onConfirm={handleDelete}
 *         confirmColor="bg-red-600 hover:bg-red-700"
 *       />
 *     </>
 *   );
 * };
 * ```
 */

import React from 'react';

export interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmColor?: string; // ex: "bg-red-600 hover:bg-red-700"
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onClose,
  onConfirm,
  confirmColor = 'bg-red-600 hover:bg-red-700',
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          {message}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white ${confirmColor}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;