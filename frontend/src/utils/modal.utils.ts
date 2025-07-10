// utils/modals.utils.ts

export type Entity = { id: string; [key: string]: any };

/**
 * Ouvre un modal de suppression groupée pour une entité générique
 * @param selectedIds Liste des identifiants sélectionnés
 * @param setSelectedEntity Fonction de mise à jour de l'entité sélectionnée
 * @param setModalMode Fonction de mise à jour du mode du modal
 * @param setIsActionsOpen Fonction optionnelle pour fermer le menu d'action
 * @param entityLabel Label affiché dans le modal (ex: "employés", "rubriques")
 */
export function openBulkDeleteModal<T extends Entity>(
  selectedIds: string[],
  setSelectedEntity: (entity: T | null) => void,
  setModalMode: (mode: "bulk-delete") => void,
  setIsActionsOpen?: (value: boolean) => void,
  entityLabel: string = "éléments"
): void {
  const mockEntity = {
    id: selectedIds.join(", "),
    label: `Supprimer ${selectedIds.length} ${entityLabel}`,
  } as unknown as T;

  setSelectedEntity(mockEntity);
  setModalMode("bulk-delete");
  if (setIsActionsOpen) setIsActionsOpen(false);
}
