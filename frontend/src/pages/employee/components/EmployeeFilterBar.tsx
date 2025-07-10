import React from 'react';
import EmployeeActionsMenu from './EmployeeActionsMenu';

// Icône plus pour le bouton rubrique
const PlusIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

interface Props {
  filterField: string;
  setFilterField: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  echelonFilter: string;
  setEchelonFilter: (v: string) => void;
  pageSize: number;
  setPageSize: (v: number) => void;
  setPage: (v: number) => void;
  selectedIds: number[];
  setShowRubriqueModal: (v: boolean) => void;
  PAGE_SIZE_OPTIONS: { value: number; label: string }[];
  FILTER_OPTIONS: { value: string; label: string }[];
  onAdd: () => void;
  onImport: () => void;
  onExport: () => void;
}

const EmployeeFilterBar: React.FC<Props> = ({
  filterField, setFilterField, search, setSearch, echelonFilter, setEchelonFilter,
  pageSize, setPageSize, setPage, selectedIds, setShowRubriqueModal, PAGE_SIZE_OPTIONS, FILTER_OPTIONS,
  onAdd, onImport, onExport
}) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 pb-1 px-2 shadow-sm rounded-md">
    <div className="flex flex-col gap-2 w-full sm:flex-row sm:gap-1 sm:w-auto items-center">
      <select
        value={filterField}
        onChange={e => {
          setFilterField(e.target.value);
          setSearch('');
          setEchelonFilter('');
        }}
        className="border rounded px-1 py-1 text-xs dark:bg-gray-900 dark:text-white w-full sm:w-auto"
        style={{ minWidth: 90 }}
      >
        {FILTER_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder={`Rechercher par ${FILTER_OPTIONS.find(opt => opt.value === filterField)?.label.toLowerCase()}...`}
        value={search}
        onChange={e => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border rounded px-2 py-1 text-xs w-full sm:w-48 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 outline-none"
      />
      {filterField === 'categorie' && (
        <input
          type="text"
          placeholder="Filtrer par échelon..."
          value={echelonFilter}
          onChange={e => setEchelonFilter(e.target.value)}
          className="border rounded px-1 py-1 text-xs w-full sm:w-auto dark:bg-gray-900 dark:text-white"
          style={{ minWidth: 90 }}
        />
      )}
      <label className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-200 ml-2">
        Afficher
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          className="border rounded px-1 py-1 text-xs dark:bg-gray-900 dark:text-white"
          style={{ minWidth: 70 }}
        >
          {PAGE_SIZE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        lignes
      </label>
    </div>
    <div className="flex items-center gap-2 ml-auto">
      <EmployeeActionsMenu
        onAdd={onAdd}
        onImport={onImport}
        onExport={onExport}
      />
      <button
        type="button"
        onClick={() => setShowRubriqueModal(true)}
        className="px-3 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-xs disabled:opacity-50 flex items-center"
        disabled={selectedIds.length === 0}
      >
        <PlusIcon />
        Joindre rubrique(s)
      </button>
    </div>
  </div>
);

export default EmployeeFilterBar;