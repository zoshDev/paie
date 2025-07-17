import React, { useState } from "react";

// 📦 Composants génériques
import PageHeader from "@/components/layout/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DataTable from "@/components/table/DataTable";
import Menu, { MenuItem } from "@/components/ui/Menu/Menu";
import BulkActionsBar from "@/components/ui/BulkActionsBar";
import EntityModals from "@/components/ui/Modal/EntityModal";
import GenericForm from "@/components/form/GenericForm";

// 🔧 Imports liés au module
import { profilPaieColumns } from "./profilPaie.columns";
import { profilPaieFormSections } from "./profilPaieFormSections";
import { profilPaieService } from "./profilPaieService";
import useProfilsPaie from "./useProfilsPaie";

// ✅ Icônes
import {
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";

// 🧠 Type backend
import type { ProfilPaie } from "./ProfilPaie";

const ProfilPaieListPage: React.FC = () => {
  const {
    profils,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected
  } = useProfilsPaie();

  const profilsWithId = profils.map((p: ProfilPaie) => ({
    ...p,
    id: String(p.id),
  }));

  const [selectedProfil, setSelectedProfil] = useState<ProfilPaie | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | "create" | "bulk-delete" | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const openModal = (profil: ProfilPaie | null, mode: typeof modalMode) => {
    setSelectedProfil(profil);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedProfil(null);
    setModalMode(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProfil = () => {
    openModal(null, "create");
    setIsActionsOpen(false);
  };

  const actions = [
    {
      label: "Supprimer",
      icon: <TrashIcon className="w-4 h-4" />,
      onClick: () => openModal(null, "bulk-delete"),
      className: "flex items-center gap-1 px-2 py-1 text-red-600 hover:text-white hover:bg-red-600 rounded transition"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      
      <PageHeader
        title="Liste des Profils de Paie"
        description="Gérez les structures de paie prédéfinies"
      >
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Rechercher un profil..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:flex-1"
          />
          <div className="relative">
            <Button onClick={() => setIsActionsOpen(!isActionsOpen)} className="flex items-center whitespace-nowrap">
              <span>Actions</span>
              <ChevronDownIcon className="w-5 h-5 ml-2" />
            </Button>
            <Menu isOpen={isActionsOpen} onClose={() => setIsActionsOpen(false)}>
              <MenuItem onClick={handleAddProfil} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter un Profil
              </MenuItem>
            </Menu>
          </div>
        </div>
      </PageHeader>

      {selectedIds.length >= 2 && (
        <div className="flex justify-end mb-2">
          <BulkActionsBar
            count={selectedIds.length}
            actions={actions}
            onClearSelection={clearSelection}
          />
        </div>
      )}

      <DataTable
        data={profilsWithId}
        columns={profilPaieColumns}
        selectedIds={selectedIds.map((id) => String(id))}
        onToggleSelectedId={(id) => toggleSelectedId(Number(id))}
        onToggleAllSelected={() => toggleAllSelected(profils)}
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={<ClipboardDocumentListIcon className="text-gray-100 w-40 h-40" />}
        onClearSelection={clearSelection}
        onView={(profil) => openModal(profil, "view")}
        onEdit={(profil) => openModal(profil, "edit")}
        onDelete={(profil) => openModal(profil, "delete")}
        onBulkDelete={() => openModal(null, "bulk-delete")}
      />

      <EntityModals
        selectedIds={selectedIds.map((id) => String(id))}
        mode={modalMode}
        entity={selectedProfil ? { ...selectedProfil, id: String(selectedProfil.id) } : null}
        //formFields={profilPaieFormSections}
        //sections={profilPaieFormSections}
        onClose={closeModal}
        onDeleteConfirm={(id) => {
          alert(`Profil supprimé : ${id}`);
          clearSelection();
          closeModal();
        }}
        renderEditForm={(profil) => (
          <GenericForm
            sections={profilPaieFormSections}
            initialData={profil ?? {}}
            onSubmit={async (values) => {
              try {
                if (modalMode === "create") {
                  await profilPaieService.create(values);
                  alert("Profil créé ✅");
                } else if (profil) {
                  await profilPaieService.update(Number(profil.id), values);
                  alert("Profil mis à jour ✨");
                }
                closeModal();
              } catch (err) {
                alert("Erreur ❌");
                console.error(err);
              }
            }}
            backgroundIllustration={<ClipboardDocumentListIcon className="w-40 h-40 text-gray-100" />}
            submitLabel={modalMode === "create" ? "Créer" : "Mettre à jour"}
          />
        )}
        renderView={(profil) =>
          modalMode === "bulk-delete" ? (
            <div>
              <p>Suppression de <strong>{selectedIds.length}</strong> profils.</p>
              <p className="text-sm text-red-600">Action irréversible.</p>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <p><strong>Nom du Profil :</strong> {profil?.nom}</p>
              <p><strong>Nombre d'Éléments :</strong> {profil?.elements?.length ?? 0}</p>

              {profil?.elements?.length ? (
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Détails des Éléments :</h3>
                  <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                    {profil.elements.map((el) => (
                      <li key={el.id} className="p-2">
                        <div className="font-semibold text-gray-800">{el.libelle}</div>
                        <div className="text-xs text-gray-500">
                          Code: <span className="font-mono">{el.libelle}</span> • Type: {el.type_element} • Nature: {el.nature}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-x-3">
                          <span>Imposable: {el.imposable ? "✅" : "❌"}</span>
                          <span>CNPS: {el.soumisCnps ? "✅" : "❌"}</span>
                          <span>Part Employé: {el.partEmploye ? "✅" : "❌"}</span>
                          <span>Part Employeur: {el.partEmployeur ? "✅" : "❌"}</span>
                          <span>Prorata: {el.prorataBase}%</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="italic text-gray-400">Ce profil ne contient aucun élément de salaire.</p>
              )}
            </div>
          )
        }
      />
    </div>
  );
};

export default ProfilPaieListPage;
