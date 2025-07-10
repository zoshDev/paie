// pages/rubriques/RubricsListPage.tsx
import React, { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import DataTable from "../../components/table/DataTable";
import Menu, { MenuItem } from "../../components/ui/Menu/Menu";
import EntityModals from "../../components/ui/Modal/EntityModal";
import BulkActionsBar from "../../components/ui/BulkActionsBar";
import toast from "react-hot-toast";
import AssignRubricsToProfilesForm from "../../components/form/AssignRubricsToProfilesForm";
import GenericAssignmentForm from "../../components/form/GenericAssignmentForm";
import type { PayrollProfile } from "../../models/payrollProfiles";

import {
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  TrashIcon,
  LinkIcon
} from "@heroicons/react/24/outline";

import { TagIcon } from "@heroicons/react/24/outline";
import { rubricColumns } from "./columns";
import { rubricFields } from "./rubricField";
import useRubrics from "./useRubric";
import type { Rubric } from "./types";
import { openBulkDeleteModal } from "../../utils/modal.utils";

const columns = rubricColumns;

// Simuler les profils de paie (à remplacer par des données réelles)
const MOCK_PROFILES: PayrollProfile[] = [
  { id: "profile1", name: "Profil Standard", description: "Profil de paie standard pour les employés permanents", isDefault: true, items: [] },
  { id: "profile2", name: "Profil Contractuel", description: "Profil pour employés sous contrat à durée déterminée", isDefault: false, items: [] },
  { id: "profile3", name: "Profil Direction", description: "Profil pour les membres de la direction", isDefault: false, items: [] },
  { id: "profile4", name: "Profil Stage", description: "Profil pour les stagiaires", isDefault: false, items: [] },
  { id: "profile5", name: "Profil Consultant", description: "Profil pour les consultants externes", isDefault: false, items: [] }
];

type ModalModeType = "view" | "edit" | "delete" | "create" | "bulk-delete" | "assign-to-profiles" | "assign-entities" | null;

const RubricsListPage: React.FC = () => {
  const {
    rubrics,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected
  } = useRubrics();

  const [selectedRubrique, setSelectedRubrique] = useState<Rubric | null>(null);
  const [modalMode, setModalMode] = useState<ModalModeType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (rubrique: Rubric | null, mode: ModalModeType) => {
    setSelectedRubrique(rubrique);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedRubrique(null);
    setModalMode(null);
  };

  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleActions = () => {
    setIsActionsOpen(!isActionsOpen);
  };

  const handleAddRubrique = () => {
    openModal(null, "create");
    setIsActionsOpen(false);
  };

  const handleImportRubriques = () => {
    toast("Importer des rubriques");
    setIsActionsOpen(false);
  };

  const handleExportRubriques = () => {
    toast("Exporter des rubriques");
    setIsActionsOpen(false);
  };

  const handleRubricSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    
    try {
      console.log("Données soumises:", data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`La rubrique a été ${modalMode === "edit" ? "modifiée" : "créée"} avec succès.`);
      
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement de la rubrique.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletedRubriques = (id?: string) => {
    if (modalMode === "bulk-delete") {
      toast.success(`Suppression de plusieurs rubriques : ${selectedIds.join(", ")}`);
      clearSelection();
    } else if (id) {
      toast.success(`Suppression de la rubrique : ${id}`);
    }
    setModalMode(null);
    closeModal();
  };

  // Nouvelle fonction pour gérer l'assignation des rubriques aux profils
  const handleAssignRubricsToProfiles = (rubricIds: string[], profilIds: string[]) => {
    console.log("Assignation de rubriques aux profils:", { rubricIds, profilIds });
    // Afficher un message de succès
    toast.success(`${rubricIds.length} rubrique(s) assignée(s) à ${profilIds.length} profil(s).`);
    // Désélectionner toutes les rubriques après l'assignation réussie
    clearSelection();
    // Fermer la modale
    closeModal();
  };

  // Fonction générique pour gérer l'assignation d'entités
  const handleAssignEntities = (data: Record<string, any>) => {
    const { sourceIds, targetIds } = data;
    console.log("Assignation générique d'entités:", { sourceIds, targetIds });
    // Afficher un message de succès
    toast.success(`${sourceIds.length} rubrique(s) assignée(s) à ${targetIds.length} profil(s).`);
    // Désélectionner toutes les rubriques après l'assignation réussie
    clearSelection();
    // Fermer la modale
    closeModal();
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Liste des Rubriques" description="Gérer les rubriques de paie">
        <div className="flex items-center space-x-4 w-full">
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1"
          />
          <div className="relative">
            <Button onClick={toggleActions} className="flex items-center">
              <span>Actions</span>
              <ChevronDownIcon className="w-5 h-5 ml-2" />
            </Button>
            <Menu isOpen={isActionsOpen} onClose={() => setIsActionsOpen(false)}>
              <MenuItem onClick={handleAddRubrique} icon={<PlusIcon className="w-5 h-5" />}>Ajouter une Rubrique</MenuItem>
              <MenuItem onClick={handleImportRubriques} icon={<ArrowDownTrayIcon className="w-5 h-5" />}>Importer</MenuItem>
              <MenuItem onClick={handleExportRubriques} icon={<ArrowUpTrayIcon className="w-5 h-5" />}>Exporter</MenuItem>
            </Menu>
          </div>
        </div>
      </PageHeader>

      {selectedIds.length >= 1 && (
        <div className="flex justify-end mb-4">
          <BulkActionsBar
            count={selectedIds.length}
            onClearSelection={clearSelection}
            actions={[{
              label: "Supprimer",
              icon: <TrashIcon className="w-4 h-4" />,
              onClick: () => openBulkDeleteModal<Rubric>(
                selectedIds,
                setSelectedRubrique,
                setModalMode,
                setIsActionsOpen,
                "rubriques"
              ),
              className: "text-red-600 hover:bg-red-50"
            },
            {
              label: "Assigner à profil(s)",
              icon: <LinkIcon className="w-4 h-4" />,
              onClick: () => openModal(null, "assign-entities"),
              className: "text-indigo-600 hover:bg-indigo-50"
            }
          ]}
          />
        </div>
      )}

      <DataTable
        data={rubrics}
        columns={columns}
        selectedIds={selectedIds}
        onToggleSelectedId={toggleSelectedId}
        onToggleAllSelected={toggleAllSelected}
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={
          <div className="text-[120px] text-purple-100">
            🧩
        </div>
        }
        onClearSelection={clearSelection}
        onView={(rub) => openModal(rub, "view")}
        onEdit={(rub) => openModal(rub, "edit")}
        onDelete={(rub) => openModal(rub, "delete")}
        onBulkDelete={() => openBulkDeleteModal<Rubric>(
          selectedIds,
          setSelectedRubrique,
          setModalMode,
          setIsActionsOpen,
          "rubriques"
        )}
      />

      <EntityModals
        mode={modalMode}
        entity={selectedRubrique}
        selectedIds={selectedIds}
        onClose={closeModal}
        onDeleteConfirm={handleDeletedRubriques}
        formFields={rubricFields}
        entityType="rubric"
        onSubmit={modalMode === "assign-entities" ? handleAssignEntities : handleRubricSubmit}
        isSubmitting={isSubmitting}
        renderAssignToProfiles={(ids, close, submit) => (
          <AssignRubricsToProfilesForm
            selectedRubricIds={ids}
            onClose={close}
            onSubmit={(rubricIds, profilIds) => handleAssignRubricsToProfiles(rubricIds, profilIds)}
          />
        )}
        renderAssignmentForm={(sourceIds, close, submit) => (
          <GenericAssignmentForm
            sourceItemsIds={sourceIds}
            availableTargetEntities={MOCK_PROFILES}
            onClose={close}
            onSubmit={submit}
            title="Assigner des rubriques aux profils de paie"
            description="Sélectionnez les profils de paie auxquels les rubriques choisies seront assignées."
            sourceItemsLabel="Rubrique(s)"
            targetFilterPlaceholder="Filtrer les profils de paie..."
            targetLabelKey="name"
            targetValueKey="id"
          />
        )}
      />
    </div>
  );
};

export default RubricsListPage;
