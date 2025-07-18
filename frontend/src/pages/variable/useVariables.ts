import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { variableService,  } from "./variableService";
import type { Variable } from "./variableService";

export default function useVariables() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data = [], isLoading } = useQuery({
  queryKey: ["variables"],
  queryFn: variableService.getAll,
});

  const variables: Variable[] = data.filter((v:Variable) =>
    v.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectedId = (id: number) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  };

  const toggleAllSelected = (list: Variable[]) => {
    if (selectedIds.length === list.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(list.map((v) => v.id));
    }
  };

  const clearSelection = () => setSelectedIds([]);

  return {
    variables,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected: selectedIds.length > 0 && selectedIds.length === variables.length,
  };
}
