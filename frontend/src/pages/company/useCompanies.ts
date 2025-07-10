import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '@/services/companyService';
import type { Societe } from './types';

function useCompanies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['companies'],
    queryFn: companyService.list,
  });

  const sanitizedCompanies: Societe[] = useMemo(() => {
    const isString = (val: unknown): val is string => typeof val === 'string';

    return data.map((soc: Societe): Societe => ({
      ...soc,
      nom: isString(soc.nom) ? soc.nom : '',
      localisation: isString(soc.localisation) ? soc.localisation : '',
      regime_fiscal: isString(soc.regime_fiscal) ? soc.regime_fiscal : ''
    }));
  }, [data]);

  const companies = useMemo(() => {
    if (!searchTerm.trim()) return sanitizedCompanies;
    const term = searchTerm.toLowerCase();
    return sanitizedCompanies.filter((soc) =>
      [soc.nom, soc.localisation, soc.regime_fiscal].some((f) =>
        f?.toLowerCase()?.includes(term)
      )
    );
  }, [searchTerm, sanitizedCompanies]);

  const toggleSelectedId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedIds([]);
  const selectAll = () =>
    setSelectedIds(companies.map((c) => String(c.id)));
  const toggleAllSelected = () =>
    selectedIds.length === companies.length ? clearSelection() : selectAll();
  const isAllSelected = selectedIds.length === companies.length;

  return {
    companies,
    searchTerm,
    setSearchTerm,
    isLoading,
    isError,
    selectedIds,
    setSelectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    selectAll,
    isAllSelected
  };
}

export default useCompanies;
