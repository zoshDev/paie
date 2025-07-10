/**
 * Composant TableActions
 *
 * Barre d'actions réutilisable pour le haut d'un tableau (ajout, recherche...).
 *
 * Props :
 * - onAdd    : () => void      | Callback pour le bouton d'ajout.
 * - addLabel : string?         | Label du bouton d'ajout (par défaut "Ajouter").
 * - search   : string?         | Valeur du champ de recherche.
 * - setSearch: (v: string) => void | Setter pour la recherche.
 *
 * Exemple d'utilisation :
 *
 * ```tsx
 * import { TableActions } from './TablesActions';
 * 
 * const [search, setSearch] = useState('');
 * 
 * <TableActions
 *   onAdd={() => setShowAddModal(true)}
 *   addLabel="Ajouter une catégorie"
 *   search={search}
 *   setSearch={setSearch}
 * />
 * ```
 */

import React from 'react';

type FilterOption = { label: string; value: string };
type PageSizeOption = number;

type TableActionsProps = {
  onAdd?: () => void;
  addLabel?: string;
  search: string;
  setSearch: (v: string) => void;
  filterField: string;
  setFilterField: (v: string) => void;
  filterOptions: FilterOption[];
  pageSize: number;
  setPageSize: (v: number) => void;
  pageSizeOptions: PageSizeOption[];
};

 const TableActions: React.FC<TableActionsProps> = ({
  onAdd,
  addLabel = "Ajouter",
  search,
  setSearch,
  filterField,
  setFilterField,
  filterOptions,
  pageSize,
  setPageSize,
  pageSizeOptions,
}) => (
  <div className="flex flex-wrap items-center gap-2 mb-4">
    <select
      value={filterField}
      onChange={e => setFilterField(e.target.value)}
      className="border rounded px-2 py-1"
    >
      {filterOptions.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <input
      type="text"
      placeholder="Rechercher..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      className="border rounded px-2 py-1"
    />
    <div className="flex items-center gap-1 ml-2">
      <span className="text-sm">Afficher</span>
      <select
        value={pageSize}
        onChange={e => setPageSize(Number(e.target.value))}
        className="border rounded px-2 py-1"
      >
        {pageSizeOptions.map(opt => (
          <option key={opt} value={opt}>
            {opt === 0 ? 'Tous' : opt}
          </option>
        ))}
      </select>
      <span className="text-sm">lignes</span>
    </div>
    {onAdd && (
      <button
        onClick={onAdd}
        className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
      >
        {addLabel}
      </button>
    )}
  </div>
);

export default TableActions;