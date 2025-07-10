import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Categorie } from "./categoryType";

const fakeCategories: Categorie[] = [
  { id: "1", code: "CAT001", nom: "Cadre", description: "Cadres supérieurs" },
  { id: "2", code: "CAT002", nom: "Technicien", description: "Techniciens spécialisés" },
  { id: "3", code: "CAT003", nom: "Ouvrier", description: "Ouvriers qualifiés" },
];

const useCategories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => Promise.resolve(fakeCategories),
  });

  const filtered = useMemo(() => {
    return categories.filter((cat) =>
      cat.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const toggleSelectedId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllSelected = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((cat) => cat.id));
    }
  };

  const clearSelection = () => setSelectedIds([]);

  const isAllSelected = selectedIds.length === filtered.length;

  return {
    categories: filtered,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected,
  };
};

export default useCategories;
