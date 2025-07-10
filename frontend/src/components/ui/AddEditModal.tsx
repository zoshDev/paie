import React from 'react';

/**
 * Composant AddEditModal
 *
 * Modale réutilisable pour ajouter ou éditer un élément (formulaire).
 *
 * Props :
 * - open       : boolean         | Affiche ou masque la modale.
 * - onClose    : () => void      | Fonction appelée lors de la fermeture.
 * - onSubmit   : (data: any) => void | Fonction appelée lors de la validation.
 * - initialData: any             | Données initiales pour le formulaire (optionnel).
 * - children   : React.ReactNode | Le formulaire à afficher dans la modale.
 * - title      : string          | Titre de la modale.
 *
 * Exemple d'utilisation :
 *
 * ```tsx
 * import React, { useState } from 'react';
 * import { AddEditModal } from './AddEditModal';
 *
 * const ExempleAjout = () => {
 *   const [open, setOpen] = useState(false);
 *   const [nom, setNom] = useState('');
 *   const handleSubmit = () => {
 *     // Traitement de l'ajout ici
 *     setOpen(false);
 *   };
 *   return (
 *     <>
 *       <button onClick={() => setOpen(true)}>Ajouter</button>
 *       <AddEditModal
 *         open={open}
 *         onClose={() => setOpen(false)}
 *         onSubmit={handleSubmit}
 *         title="Ajouter un élément"
 *       >
 *         <input
 *           value={nom}
 *           onChange={e => setNom(e.target.value)}
 *           placeholder="Nom"
 *           className="border px-2 py-1 rounded"
 *         />
 *       </AddEditModal>
 *     </>
 *   );
 * };
 * ```
 */

type AddEditModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  children: React.ReactNode;
  title: string;
};

export default function AddEditModal({ open, onClose, onSubmit, initialData, children, title }: AddEditModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg min-w-[320px]">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit(initialData);
          }}
        >
          {children}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300">Annuler</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Valider</button>
          </div>
        </form>
      </div>
    </div>
  );
}