import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { categorieEchelonService } from '@/services/categorieEchelonService';
import type { CategorieEchelon } from '@/types/categorieEchelon';

export default function useCategorieEchelons() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data = [], isLoading, isError, refetch } = useQuery<CategorieEchelon[]>({
    queryKey: ['categorieEchelons'],
    queryFn: categorieEchelonService.list,
  });

  const filtered = data.filter((item) => {
    const label = `${item.categorieId} ${item.echelonId}`;
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const toggleSelectedId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllSelected = () => {
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((e) => e.id));
  };

  const clearSelection = () => setSelectedIds([]);
  const isAllSelected = selectedIds.length === filtered.length;

  return {
    categorieEchelons: filtered,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected,
    refetch,
    isLoading,
    isError
  };
}
