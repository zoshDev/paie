import React from "react";
import EntityModals from "@/components/ui/Modal/EntityModal";
import ProfilPaieViewDetails from "./ProfilPaieViewDetails";
import GenericDuplicateForm from "@/components/form/GenericDuplicateForm";
import ProfilPaieForm from "./ProfilPaieForm";
import type { RoleProfilPaie } from "./types";

interface ProfilPaieModalsProps {
  modalMode: "view" | "edit" | "delete" | "create" | "bulk-delete" | "duplicate" | null;
  selectedProfil: RoleProfilPaie | null;
  selectedIds: string[];
  onClose: () => void;
  onSubmit: (data: Partial<RoleProfilPaie>) => void;
  onDeleteConfirm: (id?: string) => void;
  isSubmitting: boolean;
}

const ProfilPaieModals: React.FC<ProfilPaieModalsProps> = ({
  modalMode,
  selectedProfil,
  selectedIds,
  onClose,
  onSubmit,
  onDeleteConfirm,
  isSubmitting,
}) => {
  return (
    <EntityModals
      mode={modalMode}
      entity={selectedProfil}
      selectedIds={selectedIds}
      onClose={onClose}
      onDeleteConfirm={onDeleteConfirm}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      renderEditForm={() => (
        <ProfilPaieForm
          initialData={selectedProfil || {}}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      )}
      renderView={() => (
        <ProfilPaieViewDetails profil={selectedProfil} />
      )}
      renderDuplicateForm={(entity, close, submit) =>
        entity ? (
          <GenericDuplicateForm<RoleProfilPaie>
            key={entity.id}
            entityToDuplicate={entity}
            onClose={close}
            onDuplicateSubmit={submit}
            isSubmitting={isSubmitting}
            renderEntityForm={(initialData, handleFormSubmit, formSubmitting) => (
              <ProfilPaieForm
                initialData={initialData}
                onSubmit={handleFormSubmit}
                isSubmitting={formSubmitting}
              />
            )}
            generateNewName={(originalName) =>
              originalName ? `Copie de ${originalName}` : "Nouveau Profil Copié"
            }
            modalTitle="Dupliquer le Profil de Paie"
            introText="Modifiez le nom avant de créer la copie."
          />
        ) : null
      }
    />
  );
};

export default ProfilPaieModals;
