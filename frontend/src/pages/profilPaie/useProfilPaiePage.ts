import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { roleProfilService } from "@/services/roleProfilService";
import type { RoleProfilPaie } from "./types";

export function useProfilPaiePage() {
  // État pour les modales
  const [selectedProfil, setSelectedProfil] = useState<RoleProfilPaie | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | "create" | "bulk-delete" | "duplicate" | null>(null);

  // Données depuis l'API
  const { data = [], isLoading, isError } = useQuery<RoleProfilPaie[]>({
  queryKey: ["profilsPaie"],
  queryFn: async () => {
    const response = await roleProfilService.getAll();
    return response as RoleProfilPaie[];
  }
});


  // État local
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const profilsPaie: RoleProfilPaie[] = useMemo(() => {
  if (!searchTerm.trim()) return data;
  const term = searchTerm.toLowerCase();
  return (data as RoleProfilPaie[]).filter((p:RoleProfilPaie) =>
    [p.roleName, p.categorie, p.description].some((f) => f?.toLowerCase().includes(term))
  );
}, [data, searchTerm]);


  // Modale utils
  const openModal = (profil: RoleProfilPaie | null, mode: typeof modalMode) => {
    setSelectedProfil(profil);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedProfil(null);
    setModalMode(null);
  };

  // Sélection
  const toggleSelectedId = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const clearSelection = () => setSelectedIds([]);
  const selectAll = () => setSelectedIds(profilsPaie.map(p => p.id));
  const toggleAllSelected = () => selectedIds.length === profilsPaie.length ? clearSelection() : selectAll();
  const isAllSelected = selectedIds.length === profilsPaie.length;

  const handleDeleteConfirm = (id?: string) => {
  if (modalMode === "bulk-delete") {
    // Traitement des suppressions multiples
    alert(`Suppression en masse : ${selectedIds.join(", ")}`);
    clearSelection();
    } else if (id) {
        alert(`Suppression du profil : ${id}`);
    }
    closeModal();
};


  return {
    profilsPaie,
    isLoading,
    isError,
    searchTerm,
    setSearchTerm,
    onDeleteConfirm:handleDeleteConfirm,
    selectedIds,
    selectedProfil,
    modalMode,
    openModal,
    closeModal,
    setSelectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    selectAll,
    isAllSelected,
    setSelectedProfil,
    setModalMode,
  };
}
