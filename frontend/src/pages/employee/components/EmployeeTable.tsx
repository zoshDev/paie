import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Props {
  paginated: any[];
  selectedIds: number[];
  handleSelect: (id: number) => void;
  handleSelectAll: () => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const EmployeeTable: React.FC<Props> = ({
  paginated, selectedIds, handleSelect, handleSelectAll, handleEdit, handleDelete
}) => (
  <div className="rounded-lg shadow w-full overflow-x-auto overflow-y-auto" style={{ maxHeight: '70vh' }}>
    <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg text-xs">
      <thead>
        <tr className="sticky top-0 z-10 bg-blue-50 dark:bg-gray-700">
          <th className="px-1 py-2 text-center">
            <input
              type="checkbox"
              checked={
                paginated.length > 0 &&
                paginated.every((emp) => selectedIds.includes(emp.id))
              }
              onChange={handleSelectAll}
            />
          </th>
          <th className="px-2 py-2 text-left font-semibold text-blue-700 dark:text-gray-200 uppercase tracking-wider">
            ID
          </th>
          <th className="px-3 py-2 text-left font-semibold text-blue-700 dark:text-gray-200 uppercase tracking-wider">
            Nom
          </th>
          <th className="px-3 py-2 text-left font-semibold text-blue-700 dark:text-gray-200 uppercase tracking-wider">
            Poste
          </th>
          <th className="px-3 py-2 text-left font-semibold text-blue-700 dark:text-gray-200 uppercase tracking-wider">
            Catégorie
          </th>
          <th className="px-3 py-2 text-left font-semibold text-blue-700 dark:text-gray-200 uppercase tracking-wider">
            Échelon
          </th>
          <th className="px-3 py-2 text-center font-semibold text-blue-700 dark:text-gray-200 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {paginated.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
              Aucun employé trouvé.
            </td>
          </tr>
        ) : (
          paginated.map((emp, idx) => (
            <tr
              key={emp.id}
              className={
                idx % 2 === 0
                  ? 'bg-white dark:bg-gray-800'
                  : 'bg-blue-50 dark:bg-gray-700'
              }
            >
              <td className="px-1 py-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(emp.id)}
                  onChange={() => handleSelect(emp.id)}
                />
              </td>
              <td className="px-2 py-2 whitespace-nowrap">{emp.id}</td>
              <td className="px-3 py-2 whitespace-nowrap">{emp.name}</td>
              <td className="px-3 py-2 whitespace-nowrap">{emp.poste}</td>
              <td className="px-3 py-2 whitespace-nowrap">{emp.categorie}</td>
              <td className="px-3 py-2 whitespace-nowrap">{emp.echelon}</td>
              <td className="px-3 py-2 flex justify-center gap-1">
                <button
                  onClick={() => handleEdit(emp.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-200 transition text-xs"
                  title="Modifier"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Modifier</span>
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200 transition text-xs"
                  title="Supprimer"
                >
                  <TrashIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Supprimer</span>
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default EmployeeTable;