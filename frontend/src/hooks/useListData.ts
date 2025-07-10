import { useState, useMemo } from 'react';

export interface UseListDataParams<T> {
  data: T[];
  initialFilterField?: string;
  initialSearch?: string;
  initialPageSize?: number;
  filterFn?: (item: T, filterField: string, search: string) => boolean;
}

export interface UseListDataResult<T> {
  // État du filtre
  filterField: string;
  setFilterField: (field: string) => void;
  search: string;
  setSearch: (search: string) => void;
  
  // État de la pagination  
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  
  // État de la sélection
  selectedIds: Array<string | number>;
  toggleItemSelection: (id: string | number) => void;
  toggleSelectAll: (ids: Array<string | number>) => void;
  clearSelection: () => void;
  
  // Résultats
  filteredData: T[];
  paginatedData: T[];
  totalPages: number;
}

// Fonction de filtrage par défaut
const defaultFilterFn = <T>(
  item: T, 
  filterField: string, 
  search: string
): boolean => {
  if (!search) return true;
  
  const value = (item as any)[filterField];
  if (value === undefined || value === null) return false;
  
  return String(value).toLowerCase().includes(search.toLowerCase());
};

export function useListData<T>({
  data,
  initialFilterField = '',
  initialSearch = '',
  initialPageSize = 20,
  filterFn = defaultFilterFn,
}: UseListDataParams<T>): UseListDataResult<T> {
  // État du filtre
  const [filterField, setFilterField] = useState(initialFilterField);
  const [search, setSearch] = useState(initialSearch);
  
  // État de la pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // État de la sélection
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
  
  // Reset page on search/filter change
  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };
  
  const handleFilterField = (newField: string) => {
    setFilterField(newField);
    setSearch('');
    setPage(1);
  };
  
  // Données filtrées
  const filteredData = useMemo(() => {
    return data.filter(item => filterFn(item, filterField, search));
  }, [data, filterField, search, filterFn]);
  
  // Données paginées
  const paginatedData = useMemo(() => {
    if (pageSize === 0) return filteredData;
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);
  
  // Nombre total de pages
  const totalPages = useMemo(() => {
    if (pageSize === 0) return 1;
    return Math.ceil(filteredData.length / pageSize) || 1;
  }, [filteredData.length, pageSize]);
  
  // Fonctions de sélection
  const toggleItemSelection = (id: string | number) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const toggleSelectAll = (ids: Array<string | number>) => {
    setSelectedIds(prev => {
      // Si tous les éléments sont déjà sélectionnés, les désélectionner
      if (ids.every(id => prev.includes(id))) {
        return prev.filter(id => !ids.includes(id));
      } 
      // Sinon, ajouter les nouveaux éléments à la sélection
      else {
        const newIds = ids.filter(id => !prev.includes(id));
        return [...prev, ...newIds];
      }
    });
  };
  
  const clearSelection = () => {
    setSelectedIds([]);
  };
  
  return {
    // État du filtre
    filterField,
    setFilterField: handleFilterField,
    search,
    setSearch: handleSearch,
    
    // État de la pagination
    page,
    setPage,
    pageSize,
    setPageSize,
    
    // État de la sélection
    selectedIds,
    toggleItemSelection,
    toggleSelectAll,
    clearSelection,
    
    // Résultats
    filteredData,
    paginatedData,
    totalPages,
  };
} 