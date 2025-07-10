import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  EllipsisVerticalIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import Button from '../layout/button/Button';
import GenericFilter from './GenericFilter';
import type { FilterField } from './GenericFilter';
// Action definition
export interface ActionItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  showInContextual?: boolean;
  showInDropdown?: boolean;
  requiredSelection?: 'none' | 'single' | 'multiple';
}

// Generic type for items
export interface GenericItem {
  id: string;
  [key: string]: any;
}

// Column definition
export interface ColumnDef<T extends GenericItem> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => ReactNode;
  isSortable?: boolean;
}

interface GenericListPageProps<T extends GenericItem> {
  title: string;
  description?: string;
  columns: ColumnDef<T>[];
  data: T[];
  selectedIds: string[];
  isLoading?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelect: (id: string) => void;
  onSelectAll: (items: T[]) => void;
  onAdd?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  addButtonLabel?: string;
  renderRowActions?: (item: T) => ReactNode;
  renderContextualActions?: (selectedItems: T[]) => ReactNode;
  
  // New props for actions
  actions?: ActionItem[];
  
  // Filter props
  filterFields?: FilterField[];
  filter?: Record<string, any>;
  onFilterChange?: (filter: Record<string, any>) => void;
  
  // Pagination props
  page?: number;
  setPage?: (page: number) => void;
  pageSize?: number;
  setPageSize?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

function GenericListPage<T extends GenericItem>({
  title,
  description,
  columns,
  data,
  selectedIds,
  isLoading = false,
  searchQuery,
  onSearchChange,
  onSelect,
  onSelectAll,
  onAdd,
  onImport,
  onExport,
  addButtonLabel = 'Ajouter',
  renderRowActions,
  renderContextualActions,
  actions = [],
  filterFields = [],
  filter = {},
  onFilterChange,
  page = 1,
  setPage,
  pageSize = 10,
  setPageSize,
  pageSizeOptions = [10, 25, 50, 100]
}: GenericListPageProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Apply sorting and filtering
  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    
    // Search in all string fields
    return Object.values(item).some(
      (value) => 
        typeof value === 'string' && 
        value.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Check if all items are selected
  const areAllSelected = sortedData.length > 0 && sortedData.every(item => selectedIds.includes(item.id));
  
  // Get selected items
  const selectedItems = data.filter(item => selectedIds.includes(item.id));
  
  // Check if contextual actions should be displayed
  const showContextualActions = selectedItems.length > 0;

  // Pagination
  const totalPages = pageSize > 0 ? Math.ceil(sortedData.length / pageSize) : 1;
  const currentPage = page < 1 ? 1 : page > totalPages ? totalPages : page;
  const paginatedData = pageSize > 0 
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize) 
    : sortedData;

  const handlePageChange = (newPage: number) => {
    if (setPage && newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (setPageSize) {
      setPageSize(newSize);
      // Reset to first page when changing page size
      if (setPage) setPage(1);
    }
  };
  
  // Get filtered actions based on current selection
  const getFilteredActions = (where: 'contextual' | 'dropdown') => {
    return actions.filter(action => {
      // Filter by location
      if (where === 'contextual' && action.showInContextual === false) return false;
      if (where === 'dropdown' && action.showInDropdown === false) return false;
      
      // Filter by selection requirements
      if (action.requiredSelection === 'single' && selectedIds.length !== 1) return false;
      if (action.requiredSelection === 'multiple' && selectedIds.length < 1) return false;
      
      return true;
    });
  };
  
  // Count active filters
  const activeFilterCount = filterFields.length > 0 && onFilterChange
    ? Object.keys(filter).length
    : 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
        )}
      </div>
      
      {/* Filter Panel */}
      {showFilterPanel && filterFields.length > 0 && onFilterChange && (
        <GenericFilter
          fields={filterFields}
          filter={filter}
          onFilterChange={onFilterChange}
          onClose={() => setShowFilterPanel(false)}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        {/* Search and filter row */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
              placeholder="Rechercher..."
            />
          </div>
          
          {/* Filter button - only show if filterFields are provided */}
          {filterFields.length > 0 && onFilterChange && (
            <Button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              variant="secondary"
              className="whitespace-nowrap flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-1" />
              Filtres
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Contextual actions when items are selected */}
          {showContextualActions && (
            <div className="flex-1 sm:flex-none space-x-2">
              {renderContextualActions && renderContextualActions(selectedItems)}
              
              {/* Display contextual actions from actions prop */}
              {getFilteredActions('contextual').map(action => (
                <Button
                  key={action.id}
                  onClick={action.onClick}
                  variant={action.variant || 'primary'}
                  disabled={action.disabled}
                  className="whitespace-nowrap flex items-center"
                >
                  {action.icon && <span className="mr-1">{action.icon}</span>}
                  {action.label} {selectedIds.length > 0 && `(${selectedIds.length})`}
                </Button>
              ))}
            </div>
          )}
          
          {/* Actions dropdown */}
          <div className="relative">
            <Button
              onClick={() => setShowActionsDropdown(!showActionsDropdown)}
              variant="primary"
              className="w-full sm:w-auto whitespace-nowrap flex items-center"
            >
              Actions
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </Button>
            
            {showActionsDropdown && (
              <div 
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800"
                onBlur={() => setShowActionsDropdown(false)}
              >
                <div className="py-1" role="none">
                  {onAdd && (
                    <button
                      onClick={() => {
                        onAdd();
                        setShowActionsDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      {addButtonLabel}
                    </button>
                  )}
                  
                  {onImport && (
                    <button
                      onClick={() => {
                        onImport();
                        setShowActionsDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Importer (Excel)
                    </button>
                  )}
                  
                  {onExport && (
                    <button
                      onClick={() => {
                        onExport();
                        setShowActionsDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                      Exporter (Excel)
                    </button>
                  )}
                  
                  {/* Dynamic actions from actions prop */}
                  {getFilteredActions('dropdown').map(action => (
                    <button
                      key={action.id}
                      onClick={() => {
                        action.onClick();
                        setShowActionsDropdown(false);
                      }}
                      disabled={action.disabled}
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        action.disabled 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {/* Selection column */}
              <th scope="col" className="w-12 px-3 py-3.5">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    checked={areAllSelected}
                    onChange={() => onSelectAll(sortedData)}
                  />
                </div>
              </th>
              
              {/* Data columns */}
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                >
                  {column.isSortable ? (
                    <button
                      className="group inline-flex items-center"
                      onClick={() => handleSort(column.accessorKey as string)}
                    >
                      {column.header}
                      <span className="ml-2 flex-none rounded">
                        {sortColumn === column.accessorKey ? (
                          sortDirection === 'asc' ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronDownIcon className="invisible group-hover:visible h-4 w-4" />
                        )}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
              
              {/* Actions column */}
              {renderRowActions && (
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (renderRowActions ? 2 : 1)} className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Chargement...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (renderRowActions ? 2 : 1)} className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Aucun résultat trouvé
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr 
                  key={item.id}
                  className={selectedIds.includes(item.id) ? 'bg-blue-50 dark:bg-blue-900/20' : undefined}
                >
                  {/* Selection cell */}
                  <td className="relative px-3 py-4">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => onSelect(item.id)}
                      />
                      {selectedIds.includes(item.id) && (
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-blue-600" />
                      )}
                    </div>
                  </td>
                  
                  {/* Data cells */}
                  {columns.map((column, index) => (
                    <td
                      key={index}
                      className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400"
                    >
                      {column.cell
                        ? column.cell(item)
                        : typeof column.accessorKey === 'string'
                          ? String(item[column.accessorKey] || '')
                          : ''}
                    </td>
                  ))}
                  
                  {/* Actions cell */}
                  {renderRowActions && (
                    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {renderRowActions(item)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Afficher
              <select
                className="mx-2 rounded-md border-gray-300 py-1 text-base focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
                <option value={0}>Tous</option>
              </select>
              par page
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-1 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-1 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenericListPage; 