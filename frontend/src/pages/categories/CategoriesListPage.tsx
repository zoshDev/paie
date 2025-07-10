import React, { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import DataTable from "../../components/table/DataTable";
import Menu, { MenuItem } from "../../components/ui/Menu/Menu";
import EntityModals from "../../components/ui/Modal/EntityModal";
import BulkActionsBar from "../../components/ui/BulkActionsBar";
import CategorieForm from "../../components/form/CategorieForm";

import {
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  TrashIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

import { categorieColumns } from "./column";
import useCategories from "./useCategories";
import type { Categorie } from "./categoryType";
import { openBulkDeleteModal } from "../../utils/modal.utils";

const columns = categorieColumns;

const CategorieListPage: React.FC = () => {
  const {
    categories,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected,
  } = useCategories();

  const [selectedCategorie, setSelectedCategorie] = useState<Categorie | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | "create" | "bulk-delete" | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const openModal = (categorie: Categorie | null, mode: typeof modalMode) => {
    setSelectedCategorie(categorie);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedCategorie(null);
    setModalMode(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleActions = () => {
    setIsActionsOpen(!isActionsOpen);
  };

  const handleAddCategorie = () => {
    openModal(null, "create");
    setIsActionsOpen(false);
  };

  const handleImportCategories = () => {
    alert("Importer des catégories");
    setIsActionsOpen(false);
  };

  const handleExportCategories = () => {
    alert("Exporter des catégories");
    setIsActionsOpen(false);
  };

  const handleDeletedCategories = (id?: string) => {
    if (modalMode === "bulk-delete") {
      alert(`Suppression de plusieurs catégories : ${selectedIds.join(", ")}`);
      clearSelection();
    } else if (id) {
      alert(`Suppression de la catégorie : ${id}`);
    }
    closeModal();
  };

  const renderEditForm = (categorie: Categorie | null) => (
    <CategorieForm
      initialData={categorie || {}}
      onSubmit={(data) => {
        console.log("Soumission de la catégorie:", data);
        closeModal();
      }}
    />
  );

  const renderViewDetails = (categorie: Categorie | null) => {
    if (!categorie) return null;
    return (
      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <p className="font-semibold">Nom</p>
          <p>{categorie.nom}</p>
        </div>
        <div>
          <p className="font-semibold">Description</p>
          <p>{categorie.description || "-"}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Liste des Catégories" description="Gérer les catégories">
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
              <MenuItem onClick={handleAddCategorie} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter une Catégorie
              </MenuItem>
              <MenuItem onClick={handleImportCategories} icon={<ArrowDownTrayIcon className="w-5 h-5" />}>
                Importer
              </MenuItem>
              <MenuItem onClick={handleExportCategories} icon={<ArrowUpTrayIcon className="w-5 h-5" />}>
                Exporter
              </MenuItem>
            </Menu>
          </div>
        </div>
      </PageHeader>

      {selectedIds.length >= 1 && (
        <div className="flex justify-end mb-4">
          <BulkActionsBar
            count={selectedIds.length}
            onClearSelection={clearSelection}
            actions={[
              {
                label: "Supprimer",
                icon: <TrashIcon className="w-4 h-4" />,
                onClick: () =>
                  openBulkDeleteModal<Categorie>(
                    selectedIds,
                    setSelectedCategorie,
                    setModalMode,
                    setIsActionsOpen,
                    "catégories"
                  ),
                className: "text-red-600 hover:bg-red-50",
              },
            ]}
          />
        </div>
      )}

      <DataTable
        data={categories}
        columns={columns}
        selectedIds={selectedIds}
        onToggleSelectedId={toggleSelectedId}
        onToggleAllSelected={toggleAllSelected}
        isAllSelected={isAllSelected}
        onClearSelection={clearSelection}
        bodyBackgroundIllustration={<div className="text-[120px] text-yellow-100">
          🗂️
        </div>}
        onView={(categorie) => openModal(categorie, "view")}
        onEdit={(categorie) => openModal(categorie, "edit")}
        onDelete={(categorie) => openModal(categorie, "delete")}
        onBulkDelete={() =>
          openBulkDeleteModal<Categorie>(
            selectedIds,
            setSelectedCategorie,
            setModalMode,
            setIsActionsOpen,
            "catégories"
          )
        }
      />

      <EntityModals
        mode={modalMode}
        entity={selectedCategorie}
        selectedIds={selectedIds}
        onClose={closeModal}
        onDeleteConfirm={handleDeletedCategories}
        renderEditForm={renderEditForm}
        renderView={renderViewDetails}
      />
    </div>
  );
};

export default CategorieListPage;
