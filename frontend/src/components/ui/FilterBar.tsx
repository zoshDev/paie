import React from 'react';
import type { ReactNode } from 'react';
import ActionMenu from './ActionMenu';

interface FilterOption {
  value: string;
  label: string;
}

interface PageSizeOption {
  value: number;
  label: string;
}

export interface FilterBarProps {
  filterField: string;
  setFilterField: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  pageSize: number;
  setPageSize: (v: number) => void;
  setPage: (v: number) => void;
  filterOptions: FilterOption[];
  pageSizeOptions: PageSizeOption[];
  actionButtons?: ReactNode;
  extraFilterInputs?: ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  onImport?: () => void;
  onExport?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterField,
  setFilterField,
  search,
  setSearch,
  pageSize,
  setPageSize,
  setPage,
  filterOptions,
  pageSizeOptions,
  actionButtons,
  extraFilterInputs,
  onAdd,
  addLabel = "Ajouter",
  onImport,
  onExport
}) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 pb-1 px-2 shadow-sm rounded-md">
    <div className="flex flex-col gap-2 w-full sm:flex-row sm:gap-1 sm:w-auto items-center">
      <select
        value={filterField}
        onChange={e => {
          setFilterField(e.target.value);
          setSearch('');
        }}
        className="border rounded px-1 py-1 text-xs dark:bg-gray-900 dark:text-white w-full sm:w-auto"
        style={{ minWidth: 90 }}
      >
        {filterOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder={`Rechercher par ${filterOptions.find(opt => opt.value === filterField)?.label.toLowerCase()}...`}
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border rounded px-2 py-1 text-xs w-full sm:w-48 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 outline-none"
      />
      {extraFilterInputs}
      <label className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-200 ml-2">
        Afficher
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          className="border rounded px-1 py-1 text-xs dark:bg-gray-900 dark:text-white"
          style={{ minWidth: 70 }}
        >
          {pageSizeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        lignes
      </label>
    </div>
    <div className="flex items-center gap-2 ml-auto">
      {(onAdd || onImport || onExport) && (
        <ActionMenu
          onAdd={onAdd}
          addLabel={addLabel}
          onImport={onImport}
          onExport={onExport}
        />
      )}
      {actionButtons}
    </div>
  </div>
);

export default FilterBar; 