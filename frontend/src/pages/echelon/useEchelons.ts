import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { echelonService } from '@/services/echelonService';
import type { Echelon } from '@/types/echelon';

export default function useEchelons() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data = [], isLoading, isError, refetch } = useQuery<Echelon[]>({
    queryKey: ['echelons'],
    queryFn: echelonService.list,
  });

  const filteredEchelons = data.filter((e) =>
    e.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectedId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllSelected = () => {
    setSelectedIds(
      selectedIds.length === filteredEchelons.length
        ? []
        : filteredEchelons.map((e) => e.id)
    );
  };

  const clearSelection = () => setSelectedIds([]);
  const isAllSelected = selectedIds.length === filteredEchelons.length;

  return {
    echelons: filteredEchelons,
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
