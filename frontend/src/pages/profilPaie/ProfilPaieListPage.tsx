import React from "react";
import PageHeader from "../../components/layout/PageHeader";
import ProfilPaieToolbar from "./ProfilPaieToolbar";
import ProfilPaieTable from "./ProfilPaieTable";
import ProfilPaieModals from "./ProfilPaieModals";
import { useMemo } from "react";
import { useProfilPaiePage } from "./useProfilPaiePage";

const ProfilPaieListPage: React.FC = () => {
  const {
    profilsPaie,
    searchTerm,
    setSearchTerm,
    selectedIds,
    isAllSelected,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    modalMode,
    selectedProfil,
    openModal,
    closeModal,
    onDeleteConfirm,
    isLoading
  } = useProfilPaiePage();

  const isSubmitting = false; // TODO: intégrer mutation plus tard si besoin

  const stableInitialData = useMemo(() => selectedProfil || {}, [selectedProfil?.id]);


  const handleSubmit = (data: any) => {
    console.log("Données soumises :", data);
    closeModal();
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Liste des Profils de Paie"
        description="Gérer les profils de paie"
      >
        <ProfilPaieToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAdd={() => openModal(null, "create")}
          onImport={() => alert("Importer des profils")}
          onExport={() => alert("Exporter des profils")}
        />
      </PageHeader>

      <ProfilPaieTable
        profilsPaie={profilsPaie}
        selectedIds={selectedIds}
        toggleSelectedId={toggleSelectedId}
        toggleAllSelected={toggleAllSelected}
        clearSelection={clearSelection}
        isAllSelected={isAllSelected}
        onView={(p) => openModal(p, "view")}
        onEdit={(p) => openModal(p, "edit")}
        onDelete={(p) => openModal(p, "delete")}
        onDuplicate={(p) => openModal(p, "duplicate")}
        onBulkDelete={() => openModal(null, "bulk-delete")}
      />

      <ProfilPaieModals
        modalMode={modalMode}
        selectedProfil={selectedProfil}
        selectedIds={selectedIds}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onDeleteConfirm={onDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ProfilPaieListPage;
