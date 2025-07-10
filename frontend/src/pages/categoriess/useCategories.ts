import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { categorieService } from '@/services/categorieService';
import type { Categorie } from '@/types/categorie';

export default function useCategories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data = [], isLoading, isError, refetch } = useQuery<Categorie[]>({
    queryKey: ['categories'],
    queryFn: categorieService.list,
  });

  const filteredCategories = data.filter((cat) =>
    cat.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectedId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllSelected = () => {
    setSelectedIds(
      selectedIds.length === filteredCategories.length
        ? []
        : filteredCategories.map((cat) => cat.id)
    );
  };

  const clearSelection = () => setSelectedIds([]);
  const isAllSelected = selectedIds.length === filteredCategories.length;

  return {
    categories: filteredCategories,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected,
    refetch,
    isLoading,
    isError,
  };
}
