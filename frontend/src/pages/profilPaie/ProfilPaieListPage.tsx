import React, { useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import DataTable from "../../components/table/DataTable";
import Menu, { MenuItem } from "../../components/ui/Menu/Menu";
import EntityModals from "../../components/ui/Modal/EntityModal";
import BulkActionsBar from "../../components/ui/BulkActionsBar";
import ProfilPaieForm from "../../components/form/ProfilPaieForm";
import GenericDuplicateForm from "../../components/form/GenericDuplicateForm";

import {
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  TrashIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

import { profilPaieColumns } from "./columns";
import { profilPaieFields } from "./profilPaieField";
import useProfilPaie from "./useProfilPaie";
import type { ProfilPaie } from "./types";
import { openBulkDeleteModal } from "../../utils/modal.utils";

const columns = profilPaieColumns;

const ProfilPaieListPage: React.FC = () => {
  const {
    profilsPaie,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected
  } = useProfilPaie();

  const [selectedProfil, setSelectedProfil] = useState<ProfilPaie | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | "create" | "bulk-delete" | "duplicate" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = (profil: ProfilPaie | null, mode: typeof modalMode) => {
    setSelectedProfil(profil);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedProfil(null);
    setModalMode(null);
  };

  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleActions = () => {
    setIsActionsOpen(!isActionsOpen);
  };

  const handleAddProfil = () => {
    openModal(null, "create");
    setIsActionsOpen(false);
  };

  const handleImportProfils = () => {
    alert("Importer des profils de paie");
    setIsActionsOpen(false);
  };

  const handleExportProfils = () => {
    alert("Exporter des profils de paie");
    setIsActionsOpen(false);
  };

  const handleDeletedProfils = (id?: string) => {
    if (modalMode === "bulk-delete") {
      alert(`Suppression de plusieurs profils de paie : ${selectedIds.join(", ")}`);
      clearSelection();
    } else if (id) {
      alert(`Suppression du profil de paie : ${id}`);
    }
    setModalMode(null);
    closeModal();
  };

  const handleProfilPaieSubmit = (data: Partial<ProfilPaie>) => {
    setIsSubmitting(true);
    try {
      // Simuler un appel API avec un délai
      setTimeout(() => {
        // Dans un cas réel, on aurait un appel API ici
        console.log("Soumission du profil de paie:", data);
        
        // Générer un ID factice pour la démo
        const newProfil = {
          id: `new-${Date.now()}`,
          ...data
        } as ProfilPaie;
        
        // Ajouter le nouveau profil à la liste (dans un cas réel, cela serait fait après réponse API)
        // setProfilsPaie(prev => [...prev, newProfil]);
        
        // Si c'était une duplication, ouvrir immédiatement en mode édition
        if (modalMode === "duplicate") {
          // D'abord fermer la modale de duplication
          closeModal();
          // Puis ouvrir le profil nouvellement créé en édition
          openModal(newProfil, "edit");
        } else {
          // Sinon, fermer simplement la modale
          closeModal();
        }
        
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setIsSubmitting(false);
    }
  };

  // Rendu personnalisé pour les modales de formulaire
  const renderEditForm = (profil: ProfilPaie | null) => (
    <ProfilPaieForm
      initialData={profil || {}}
      onSubmit={handleProfilPaieSubmit}
      isSubmitting={isSubmitting}
    />
  );
  
  // Rendu personnalisé pour le formulaire de duplication
  const renderDuplicateForm = (profil: ProfilPaie | null, onClose: () => void, onSubmit: (data: Partial<ProfilPaie>) => void) => {
    if (!profil) return null;
    
    return (
      <GenericDuplicateForm<ProfilPaie>
        entityToDuplicate={profil}
        onClose={onClose}
        onDuplicateSubmit={onSubmit}
        isSubmitting={isSubmitting}
        renderEntityForm={(initialData, formSubmit, formSubmitting, formClose) => (
          <ProfilPaieForm
            initialData={initialData}
            onSubmit={formSubmit}
            isSubmitting={formSubmitting}
          />
        )}
        generateNewCode={(originalCode) => 
          originalCode ? `${originalCode}_C_${Date.now().toString().slice(-4)}` : `NEW_PROF_C_${Date.now().toString().slice(-4)}`
        }
        generateNewName={(originalName) => 
          originalName ? `Copie de ${originalName}` : `Nouveau Profil Copié`
        }
        modalTitle="Dupliquer le Profil de Paie"
        introText="Modifiez le code et le nom de la copie avant de la créer."
      />
    );
  };

  // Rendu personnalisé pour la vue détaillée d'un profil
  const renderViewDetails = (profil: ProfilPaie | null) => {
    if (!profil) return null;

    return (
      <div className="space-y-6 text-sm text-gray-700">
        {/* Infos principales */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Code</p>
            <p>{profil.code}</p>
          </div>
          <div>
            <p className="font-semibold">Nom</p>
            <p>{profil.nom}</p>
          </div>
          <div>
            <p className="font-semibold">Catégorie</p>
            <p>{profil.categorie}</p>
          </div>
          <div>
            <p className="font-semibold">Description</p>
            <p>{profil.description || "-"}</p>
          </div>
        </div>

        {/* Rubriques associées */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Rubriques associées ({profil.rubriques.length})
          </h3>

          {profil.rubriques.length > 0 ? (
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase font-medium">
                  <tr>
                    <th className="px-4 py-2">Ordre</th>
                    <th className="px-4 py-2">Code</th>
                    <th className="px-4 py-2">Nom</th>
                    <th className="px-4 py-2">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {profil.rubriques.map((rubrique) => (
                    <tr key={rubrique.rubriqueId} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{rubrique.ordre}</td>
                      <td className="px-4 py-2 font-medium">{rubrique.code}</td>
                      <td className="px-4 py-2">{rubrique.nom}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            rubrique.type === "salaire"
                              ? "bg-blue-100 text-blue-800"
                              : rubrique.type === "gain"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {rubrique.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm italic text-gray-500">
              Aucune rubrique associée
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Liste des Profils de Paie" description="Gérer les profils de paie">
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
              <MenuItem onClick={handleAddProfil} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter un Profil
              </MenuItem>
              <MenuItem onClick={handleImportProfils} icon={<ArrowDownTrayIcon className="w-5 h-5" />}>
                Importer
              </MenuItem>
              <MenuItem onClick={handleExportProfils} icon={<ArrowUpTrayIcon className="w-5 h-5" />}>
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
                  openBulkDeleteModal<ProfilPaie>(
                    selectedIds,
                    setSelectedProfil,
                    setModalMode,
                    setIsActionsOpen,
                    "profils de paie"
                  ),
                className: "text-red-600 hover:bg-red-50"
              }
            ]}
          />
        </div>
      )}

      <DataTable
        data={profilsPaie}
        columns={columns}
        selectedIds={selectedIds}
        onToggleSelectedId={toggleSelectedId}
        onToggleAllSelected={toggleAllSelected}
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={
          <div className="text-[120px] text-yellow-100">
            🧾
        </div>
        }
        onClearSelection={clearSelection}
        onView={(profil) => openModal(profil, "view")}
        onEdit={(profil) => openModal(profil, "edit")}
        onDelete={(profil) => openModal(profil, "delete")}
        onConfigure={(profil) => openModal(profil, "duplicate")}
        configureIcon={<DocumentDuplicateIcon className="w-5 h-5" />}
        configureTitle="Dupliquer le profil"
        showConfigure={true}
        onBulkDelete={() =>
          openBulkDeleteModal<ProfilPaie>(
            selectedIds,
            setSelectedProfil,
            setModalMode,
            setIsActionsOpen,
            "profils de paie"
          )
        }
      />

      <EntityModals
        mode={modalMode}
        entity={selectedProfil}
        selectedIds={selectedIds}
        onClose={closeModal}
        onDeleteConfirm={handleDeletedProfils}
        renderEditForm={renderEditForm}
        renderView={renderViewDetails}
        renderDuplicateForm={renderDuplicateForm}
        onSubmit={handleProfilPaieSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ProfilPaieListPage; 