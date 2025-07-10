import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Societe } from './types';

// Stub de votre fonction d'API pour les sociétés
async function fetchSocietes(): Promise<Societe[]> {
  // TODO: Importer et utiliser votre fonction pour récupérer les sociétés
  return [
    { id: '1', Nom: 'Entreprise A', Adresse: '1 Rue Principale', Ville: 'Paris', Pays: 'France' },
    { id: '2', Nom: 'Société B', Adresse: '10 Avenue des Champs', Ville: 'Lyon', Pays: 'France' },
    // ... plus de données de sociétés
  ];
}

function useSocietes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: allSocietes = [], isLoading, isError } = useQuery<Societe[]>({
    queryKey: ['societes'],
    queryFn: fetchSocietes,
  });

  const societes = useMemo(() => {
    if (!searchTerm.trim()) return allSocietes;
    const term = searchTerm.toLowerCase();
    return allSocietes.filter((soc) =>
      [soc.Nom, soc.Adresse, soc.Ville, soc.Pays].some((f) =>
        f?.toLowerCase().includes(term)
      )
    );
  }, [allSocietes, searchTerm]);

  const toggleSelectedId = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const selectAll = () => {
    const allIds = societes.map((soc) => soc.id);
    setSelectedIds(allIds);
  };

  const toggleAllSelected = () => {
    if (selectedIds.length === societes.length) {
      clearSelection();
    } else {
      selectAll();
    }
  };

  const isAllSelected = selectedIds.length === societes.length;

  return {
    societes,
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
    isAllSelected,
  };
}

export default useSocietes;