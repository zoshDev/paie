import React from 'react';

interface Props {
  rubrique: string;
  setRubrique: (v: string) => void;
  setShowRubriqueModal: (v: boolean) => void;
  handleApplyRubrique: () => void;
}

const RubriqueModal: React.FC<Props> = ({
  rubrique, setRubrique, setShowRubriqueModal, handleApplyRubrique
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Joindre rubrique(s)
      </h2>
      <input
        type="text"
        placeholder="Nom de la rubrique"
        value={rubrique}
        onChange={(e) => setRubrique(e.target.value)}
        className="border rounded px-3 py-2 w-full mb-4 dark:bg-gray-900 dark:text-white"
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowRubriqueModal(false)}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Annuler
        </button>
        <button
          onClick={handleApplyRubrique}
          disabled={!rubrique}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        >
          Appliquer
        </button>
      </div>
    </div>
  </div>
);

export default RubriqueModal;