import React from 'react';

/**
 * Composant DataTable
 *
 * Tableau générique réutilisable pour afficher des listes (employés, catégories...).
 *
 * Props :
 * - columns      : Array<{ header, accessor, className? }> | Colonnes à afficher.
 * - data         : Array<any>                              | Données à afficher.
 * - loading      : boolean?                                | Affiche "Chargement..." si true.
 * - onEdit       : (row: any) => void                      | Callback pour l'action "Modifier".
 * - onDelete     : (row: any) => void                      | Callback pour l'action "Supprimer".
 * - selectable   : boolean?                                | Active la sélection multiple.
 * - selectedIds  : Array<string | number>?                 | IDs sélectionnés.
 * - setSelectedIds: (ids: Array<string | number>) => void  | Setter pour la sélection.
 *
 * Exemple d'utilisation :
 *
 * ```tsx
 * import { DataTable } from './DataTable';
 *
 * const columns = [
 *   { header: 'Nom', accessor: 'nom' },
 *   { header: 'Description', accessor: 'description' },
 * ];
 *
 * <DataTable
 *   columns={columns}
 *   data={categories}
 *   loading={loading}
 *   onEdit={cat => ...}
 *   onDelete={cat => ...}
 *   selectable
 *   selectedIds={selectedIds}
 *   setSelectedIds={setSelectedIds}
 * />
 * ```
 */

type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  selectable?: boolean;
  selectedIds?: (string | number)[];
  setSelectedIds?: (ids: (string | number)[]) => void;
};

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading,
  onEdit,
  onDelete,
  selectable,
  selectedIds = [],
  setSelectedIds,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
        <thead>
          <tr>
            {selectable && <th />}
            {columns.map((col, idx) => (
              <th key={idx} className={col.className + ' px-4 py-2 text-left'}>
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 2} className="text-center py-4">Chargement...</td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2} className="text-center py-4">Aucune donnée</td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-b dark:border-gray-700">
                {selectable && setSelectedIds && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds?.includes(row.id)}
                      onChange={() => {
                        setSelectedIds(
                          selectedIds.includes(row.id)
                            ? selectedIds.filter((id) => id !== row.id)
                            : [...selectedIds, row.id]
                        );
                      }}
                    />
                  </td>
                )}
                {columns.map((col, idx) => (
                  <td key={idx} className={col.className + ' px-4 py-2'}>
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row as any)[col.accessor]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                      >
                        Modifier
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Supprimer
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}