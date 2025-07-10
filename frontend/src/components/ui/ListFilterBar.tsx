import React from 'react';
import TableActions from './TablesActions';

interface ListFilterBarProps {
  filterField: string;
  setFilterField: (field: string) => void;
  search: string;
  setSearch: (search: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  setPage: (page: number) => void;
  selectedIds: number[];
  PAGE_SIZE_OPTIONS: number[];
  FILTER_OPTIONS: { label: string; value: string }[];
  addLabel: string;
  onAdd: () => void;
  onImport?: () => void;
  onExport?: () => void;
  extraFilters?: React.ReactNode;
}

const ListFilterBar: React.FC<ListFilterBarProps> = ({
  filterField,
  setFilterField,
  search,
  setSearch,
  pageSize,
  setPageSize,
  PAGE_SIZE_OPTIONS,
  FILTER_OPTIONS,
  addLabel,
  onAdd,
  onImport,
  onExport,
  extraFilters
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
      <TableActions
        onAdd={onAdd}
        addLabel={addLabel}
        search={search}
        setSearch={setSearch}
        filterField={filterField}
        setFilterField={setFilterField}
        filterOptions={FILTER_OPTIONS}
        pageSize={pageSize}
        setPageSize={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onImport={onImport}
        onExport={onExport}
      />
      {extraFilters}
    </div>
  );
};

export default ListFilterBar;