import React, { useState } from "react";
import { EyeIcon, PencilIcon, TrashIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import type { MenuAction } from "../ui/Menu/MenuAction";

export interface Column<T> {
  header: string;
  key: keyof T;
  isSelection?: boolean;
  isActions?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  selectedIds?: string[];
  rowsPerPageOptions?: number[];
  emptyIllustration?: React.ReactNode;
  bodyBackgroundIllustration?: React.ReactNode;
  isAllSelected?: boolean;
  showConfigure?: boolean;
  configureIcon?: React.ReactNode;
  configureTitle?: string;

  extraActions?: (item: T) => MenuAction[];


  onToggleSelectedId?: (id: string) => void;
  onToggleAllSelected?: () => void;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onConfigure?: (item: T) => void;
  onBulkDelete?: () => void;
  onClearSelection?: () => void;
}

const DataTable = <T extends { id: string|number }>({
  data,
  columns,
  isAllSelected = false,
  selectedIds = [],
  rowsPerPageOptions = [5, 10, 20],
  emptyIllustration,
  bodyBackgroundIllustration,
  showConfigure = false,        // Valeur par défaut false
  configureIcon,
  configureTitle = "Configurer",
  onToggleSelectedId,
  onToggleAllSelected,
  onView,
  onEdit,
  onDelete,
  onConfigure,
  onClearSelection,
  extraActions
}: DataTableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const pageCount = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handlePageChange = (dir: "prev" | "next") => {
    if (dir === "prev" && page > 0) setPage(p => p - 1);
    if (dir === "next" && page < pageCount - 1) setPage(p => p + 1);
  };

  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  };

  if (data.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        {emptyIllustration || <div className="text-4xl">📋</div>}
        <div className="mt-4">Aucun élément n'a été trouvé</div>
      </div>
    );
  }

  return (
    <div className="relative z-0 overflow-x-auto">
      <table className="min-w-full bg-white text-sm relative z-10 rounded-md overflow-hidden">
        <thead className="bg-indigo-50 border-b border-indigo-100">
          <tr className="text-sm font-semibold text-indigo-700 text-left">
            {columns.map(col => (
              <th key={col.key as string} className="px-4 py-3">
                {col.isSelection ? (
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleAllSelected}
                    className="form-checkbox h-4 w-4 text-indigo-500"
                  />
                ) : col.header}
              </th>
            ))}
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="relative divide-y divide-gray-200">
          {bodyBackgroundIllustration && (
            <tr className="absolute inset-0 z-0 pointer-events-none opacity-10 flex justify-center items-center">
              <td colSpan={columns.length + 1} className="text-center">
                {bodyBackgroundIllustration}
              </td>
            </tr>
          )}

          {paginatedData.map(item => (
            <tr
              key={item.id}
              className="transition hover:bg-indigo-50 relative z-10"
            >
              {columns.map(col => (
                <td key={col.key as string} className="px-4 py-3 text-gray-800">
                  {col.isSelection ? (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(String(item.id))}
                      onChange={() => onToggleSelectedId?.(String(item.id))}
                      className="form-checkbox h-4 w-4 text-indigo-500"
                    />
                  ) : col.render ? (
                    col.render(item)
                  ) : (
                    String((item as any)[col.key])
                  )}
                </td>
              ))}
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => onView?.(item)}
                    className="text-gray-400 hover:text-indigo-500 transition-all duration-200 transform hover:scale-110"
                    aria-label="Voir"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onEdit?.(item)}
                    className="text-gray-400 hover:text-green-500 transition-all duration-200 transform hover:scale-110"
                    aria-label="Éditer"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  {showConfigure && (
                    <button
                      onClick={() => onConfigure?.(item)}
                      className="text-gray-400 hover:text-blue-500 transition-all duration-200 transform hover:scale-110"
                      aria-label={configureTitle}
                    >
                      {configureIcon || <Cog6ToothIcon className="w-5 h-5" />}
                    </button>
                  )}
                  <button
                    onClick={() => onDelete?.(item)}
                    className="text-gray-400 hover:text-rose-500 transition-all duration-200 transform hover:scale-110"
                    aria-label="Supprimer"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  {extraActions?.(item).map((action: MenuAction, index: number) => (
                    <button
                      key={`extra-action-${index}`}
                      onClick={() => action.onClick?.(item)}
                      className="text-gray-400 hover:text-blue-600 transition-all duration-200 transform hover:scale-110"
                      aria-label={action.label}
                    >
                      {action.icon}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4 px-2">
        <div className="flex items-center space-x-2 text-sm">
          <span>Lignes par page :</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsChange}
            className="border rounded px-2 py-1"
          >
            {rowsPerPageOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={page === 0}
            className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <span>Page {page + 1} / {pageCount}</span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={page === pageCount - 1}
            className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
