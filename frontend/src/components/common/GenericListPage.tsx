import React from 'react';
import type { ReactNode } from 'react';
import FilterBar from '../ui/FilterBar';
import GenericDataTable from '../ui/GenericDataTable';
import type { Column } from '../ui/GenericDataTable';
import Pagination from '../ui/Pagination';

export interface GenericListPageProps<T> {
  // Données et colonnes
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  
  // État de la pagination et du filtre
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  filterField: string;
  setFilterField: (field: string) => void;
  search: string;
  setSearch: (search: string) => void;
  
  // Options
  pageSizeOptions: Array<{ value: number; label: string }>;
  filterOptions: Array<{ value: string; label: string }>;
  
  // Sélection
  selectedIds: Array<string | number>;
  onSelectRow?: (id: string | number) => void;
  onSelectAll?: () => void;
  
  // Actions
  onAdd?: () => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onImport?: () => void;
  onExport?: () => void;
  
  // Personnalisation
  addLabel?: string;
  emptyMessage?: string;
  headerActions?: ReactNode;
  extraFilterInputs?: ReactNode;
  tableActions?: (item: T) => ReactNode;
  maxHeight?: string;
  tableClassName?: string;
  
  // Total des pages calculé
  totalPages: number;
}

function GenericListPage<T>({
  // Données et colonnes
  data,
  columns,
  keyExtractor,
  
  // État de la pagination et du filtre
  page,
  setPage,
  pageSize,
  setPageSize,
  filterField,
  setFilterField,
  search,
  setSearch,
  
  // Options
  pageSizeOptions,
  filterOptions,
  
  // Sélection  
  selectedIds,
  onSelectRow,
  onSelectAll,
  
  // Actions
  onAdd,
  onEdit,
  onDelete,
  onImport,
  onExport,
  
  // Personnalisation
  addLabel = "Ajouter",
  emptyMessage = "Aucun élément trouvé.",
  headerActions,
  extraFilterInputs,
  tableActions,
  maxHeight = "70vh",
  tableClassName = "",
  
  // Total des pages calculé
  totalPages,
}: GenericListPageProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        filterField={filterField}
        setFilterField={setFilterField}
        search={search}
        setSearch={setSearch}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setPage={setPage}
        filterOptions={filterOptions}
        pageSizeOptions={pageSizeOptions}
        onAdd={onAdd}
        addLabel={addLabel}
        onImport={onImport}
        onExport={onExport}
        actionButtons={headerActions}
        extraFilterInputs={extraFilterInputs}
      />

      <hr className="border-t border-gray-300 dark:border-gray-700 my-2" />

      <GenericDataTable
        data={data}
        columns={columns}
        keyExtractor={keyExtractor}
        selectedIds={selectedIds}
        onSelectRow={onSelectRow}
        onSelectAll={onSelectAll}
        onEdit={onEdit}
        onDelete={onDelete}
        actions={tableActions}
        emptyMessage={emptyMessage}
        maxHeight={maxHeight}
      />

      {pageSize !== 0 && totalPages > 1 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          className="mt-4"
        />
      )}
    </div>
  );
}

export default GenericListPage; 