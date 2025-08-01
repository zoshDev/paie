import { useQuery } from "@tanstack/react-query";
import { elementSalaireService } from "./elementSalaireService";
import type { ElementSalaire } from "./elementSalaire";
import { useMemo, useState } from "react";

const useElementsSalaire = () => {
  // ✅ Chargement des données via React Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["elementsSalaire"],
    queryFn: elementSalaireService.getAll,
  });

  // 🔍 Recherche locale
  const [searchTerm, setSearchTerm] = useState("");

  const filteredElements = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    return list.filter((el) =>
      el.libelle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // ✅ Sélection multiple
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelectedId = (variableId: number) => {
    setSelectedIds((prev) =>
      prev.includes(variableId) ? prev.filter((id) => id !== variableId) : [...prev, variableId]
    );
  };

  const toggleAllSelected = (list: ElementSalaire[]) => {
    const allIds = list.map((el) => el.variableId);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : allIds);
  };

  const clearSelection = () => setSelectedIds([]);

  const isAllSelected = filteredElements.length > 0 &&
    filteredElements.every((el) => selectedIds.includes(el.variableId));

  return {
    elements: filteredElements,
    isLoading,
    isError,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected,
    refetch, // 🔄 pour rafraîchir manuellement si besoin
  };
};

export default useElementsSalaire;
