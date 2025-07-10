import React from 'react';
import type { ReactNode } from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

export interface GenericDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  selectedIds?: Array<string | number>;
  onSelectRow?: (id: string | number) => void;
  onSelectAll?: () => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  actions?: (item: T) => ReactNode;
  emptyMessage?: string;
  maxHeight?: string;
}

function GenericDataTable<T>({
  data,
  columns,
  keyExtractor,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  onEdit,
  onDelete,
  actions,
  emptyMessage = "Aucun élément trouvé.",
  maxHeight = '70vh'
}: GenericDataTableProps<T>) {
  const hasSelectionColumn = onSelectRow !== undefined;
  const hasActionsColumn = onEdit !== undefined || onDelete !== undefined || actions !== undefined;

  const renderCell = (item: T, column: Column<T>): ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    } else {
      return String(item[column.accessor as keyof T]);
    }
  };

  return (
    <div 
      className="rounded-lg shadow w-full overflow-x-auto overflow-y-auto"
      style={{ maxHeight }}
    >
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg text-xs">
        <thead>
          <tr className="sticky top-0 z-10 bg-blue-50 dark:bg-gray-700">
            {hasSelectionColumn && (
              <th className="px-1 py-2 text-center">
                <input
                  type="checkbox"
                  checked={
                    data.length > 0 &&
                    data.every((item) => selectedIds.includes(keyExtractor(item)))
                  }
                  onChange={onSelectAll}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={`px-3 py-2 text-left font-semibold text-blue-700 dark:text-gray-200 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
            {hasActionsColumn && (
              <th className="px-3 py-2 text-center font-semibold text-blue-700 dark:text-gray-200 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length + (hasSelectionColumn ? 1 : 0) + (hasActionsColumn ? 1 : 0)} 
                className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => {
              const id = keyExtractor(item);
              return (
                <tr
                  key={id}
                  className={
                    idx % 2 === 0
                      ? 'bg-white dark:bg-gray-800'
                      : 'bg-blue-50 dark:bg-gray-700'
                  }
                >
                  {hasSelectionColumn && (
                    <td className="px-1 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(id)}
                        onChange={() => onSelectRow && onSelectRow(id)}
                      />
                    </td>
                  )}
                  {columns.map((column, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={`px-3 py-2 whitespace-nowrap ${column.className || ''}`}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {hasActionsColumn && (
                    <td className="px-3 py-2 flex justify-center gap-1">
                      {actions ? (
                        actions(item)
                      ) : (
                        <>
                          {onEdit && (
                            <button
                              onClick={() => onEdit(id)}
                              className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-200 transition text-xs"
                              title="Modifier"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                              <span className="hidden sm:inline">Modifier</span>
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(id)}
                              className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-200 transition text-xs"
                              title="Supprimer"
                            >
                              <TrashIcon className="h-4 w-4" />
                              <span className="hidden sm:inline">Supprimer</span>
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GenericDataTable; 