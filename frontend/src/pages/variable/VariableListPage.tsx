import React, { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DataTable from "@/components/table/DataTable";
import Menu, { MenuItem } from "@/components/ui/Menu/Menu";
import BulkActionsBar from "@/components/ui/BulkActionsBar";
import EntityModals from "@/components/ui/Modal/EntityModal";
import GenericForm from "@/components/form/GenericForm";

import { variableColumns } from "./variable.columns";
import { variableFormSections } from "./variableFormSections";
import { variableService } from "./variableService";
import useVariables from "./useVariables";
import parseJsonSafely from "@/utils/parseJsonSafety";

import {
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";

import type { Variable } from "./variableService";

const VariableListPage: React.FC = () => {
  const {
    variables,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected,
  } = useVariables();

  const variablesWithId = variables.map((v) => ({ ...v, id: String(v.id) }));

  const [selectedVariable, setSelectedVariable] = useState<Variable | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | "create" | "bulk-delete" | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const openModal = (variable: Variable | null, mode: typeof modalMode) => {
    setSelectedVariable(variable);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedVariable(null);
    setModalMode(null);
  };

  const handleAddVariable = () => {
    openModal(null, "create");
    setIsActionsOpen(false);
  };

  const actions = [
    {
      label: "Supprimer",
      icon: <TrashIcon className="w-4 h-4" />,
      onClick: () => openModal(null, "bulk-delete"),
      className: "text-red-600 hover:text-white hover:bg-red-600 px-2 py-1 rounded transition",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Variables de Calcul"
        description="Gérez les règles de paie dynamiques et constantes"
      >
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Rechercher une variable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="relative">
            <Button onClick={() => setIsActionsOpen(!isActionsOpen)}>
              <span>Actions</span>
              <ChevronDownIcon className="w-5 h-5 ml-2" />
            </Button>
            <Menu isOpen={isActionsOpen} onClose={() => setIsActionsOpen(false)}>
              <MenuItem onClick={handleAddVariable} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter une Variable
              </MenuItem>
            </Menu>
          </div>
        </div>
      </PageHeader>

      {selectedIds.length >= 2 && (
        <BulkActionsBar
          count={selectedIds.length}
          actions={actions}
          onClearSelection={clearSelection}
        />
      )}

      <DataTable
        data={variablesWithId}
        columns={variableColumns}
        selectedIds={selectedIds.map(String)}
        onToggleSelectedId={(id) => toggleSelectedId(Number(id))}
        onToggleAllSelected={() => toggleAllSelected(variables)}
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={<CircleStackIcon className="text-gray-100 w-40 h-40" />}
        onClearSelection={clearSelection}
        onView={(v) => openModal(v, "view")}
        onEdit={(v) => openModal(v, "edit")}
        onDelete={(v) => openModal(v, "delete")}
        onBulkDelete={() => openModal(null, "bulk-delete")}
      />

      <EntityModals
        selectedIds={selectedIds.map(String)}
        mode={modalMode}
        entity={selectedVariable ? { ...selectedVariable, id: String(selectedVariable.id) } : null}
        onClose={closeModal}
        onDeleteConfirm={(id) => {
          alert(`Variable supprimée : ${id}`);
          clearSelection();
          closeModal();
        }}
        renderEditForm={(variable) => (
          <GenericForm
            sections={variableFormSections}
            initialData={variable ?? {}}
            onSubmit={async (values) => {
              try {
                const payload = {
                    ...values,
                    condition: parseJsonSafely(values.condition),
                    intervalle:parseJsonSafely(values.intervalle),
                }
                if (modalMode === "create") {
                  await variableService.create(payload);
                  alert("Variable créée ✅");
                } else if (variable) {
                  await variableService.update(Number(variable.id), payload);
                  alert("Variable mise à jour ✨");
                }
                closeModal();
              } catch (err) {
                alert("Erreur ❌");
                console.error(err);
              }
            }}
            backgroundIllustration={<CircleStackIcon className="w-40 h-40 text-gray-100" />}
            submitLabel={modalMode === "create" ? "Créer" : "Mettre à jour"}
          />
        )}
        renderView={(v) =>
          modalMode === "bulk-delete" ? (
            <div>
              <p>Suppression de <strong>{selectedIds.length}</strong> variables.</p>
              <p className="text-sm text-red-600">Action irréversible.</p>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p><strong>Nom :</strong> {v?.nom}</p>
              <p><strong>Valeur :</strong> {v?.valeur}</p>
              <p><strong>Type :</strong> {v?.typeVariable}</p>
              <p><strong>Formule :</strong> <code>{v?.formule}</code></p>
              <p><strong>Description :</strong> {v?.description}</p>
              <p><strong>Code :</strong> {v?.code}</p>
              <p><strong>Société :</strong> {v?.societeId}</p>
            </div>
          )
        }
      />
    </div>
  );
};

export default VariableListPage;
