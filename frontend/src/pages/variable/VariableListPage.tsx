import React, { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DataTable from "@/components/table/DataTable";
import Menu, { MenuItem } from "@/components/ui/Menu/Menu";
import BulkActionsBar from "@/components/ui/BulkActionsBar";
import EntityModals from "@/components/ui/Modal/EntityModal";
import { toast } from "react-hot-toast";

import { variableColumns } from "./variable.columns";
//import { variableFormSections } from "./variableFormSections";
import { variableService } from "./variableService";
import useVariables from "./useVariables";
import parseJsonSafely from "@/utils/parseJsonSafety";
import VariableForm from "./VariableForm";

import {
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";

import type { Variable } from "./variableService";
import GenericForm from "@/components/form/GenericForm";
import { variableFormSections } from "./variableFormSections";

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

  const variablesWithId = variables//variables.map((v) => ({ ...v, id: String(v.id) }));

  const [selectedVariable, setSelectedVariable] = useState<Variable | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete" | "create" | "bulk-delete" | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  //const [isModalOpen, setIsModalOpen] = useState(false);
  /*const handleCreateVariable = () => {
    setSelectedVariable(null); // création vierge
    //setIsModalOpen(true);
  };

  const handleEditVariable = (variable: any) => {
    setSelectedVariable(variable); // édition
    //setIsModalOpen(true);
  };*/

  //Nettoyage de la payload Variable
  function buildVariablePayloadd(values: any): any {
  const payload = { ...values };

  // 🔁 Parsing JSON si le champ vient d’un formulaire textuel
  const parsedCondition = parseJsonSafely(values.condition);
  const parsedIntervalle = parseJsonSafely(values.intervalle);

  // 🔎 Type: TEST → injecte condition structurée
  if (values.typeVariable === "Test") {
    payload.condition = {
      expression: parsedCondition?.expression ?? "",
      valeur: values.valeurTestConfig ?? { True: "", False: "" },
    };
  }

  // 🔎 Type: INTERVALLE → structure intacte
  if (values.typeVariable === "Intervalle") {
    payload.intervalle = parsedIntervalle;
  }

  return payload;
}

function buildVariablePayload(values: any): any {
  const payload: any = { ...values };

  // 🔎 TypeVariable — transformation ciblée
  switch (values.typeVariable) {
    case "Test": {
      const conditionRaw = parseJsonSafely(values.condition);
      const testValues = values.valeurTestConfig ?? { True: "", False: "" };

      payload.condition = {
        expression: conditionRaw?.expression ?? "",
        valeur: {
          True: testValues.True,
          False: testValues.False,
        },
      };

      // Optionnel : injecter aussi 'formule' si ton moteur en a besoin
      // payload.formule = `SI ${conditionRaw?.expression} ALORS ${testValues.True} SINON ${testValues.False}`;
      break;
    }

    case "Intervalle": {
      const intervalleRaw = parseJsonSafely(values.intervalle);

      payload.intervalle = {
        base: intervalleRaw?.base ?? "",
        tranches: Array.isArray(intervalleRaw?.tranches)
          ? intervalleRaw.tranches
          : [],
      };

      break;
    }

    // Les autres types comme Calcul, Valeur peuvent rester inchangés
  }

  return payload;
}



  const availableVariables =  [
  { code: "1000", libelle: "Taux IR" },
  { code: "3000", libelle: "Salaire brut" },
  { code: "2000", libelle: "Prime taxi" },
];



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
                const payload = buildVariablePayload(values)
                if (modalMode === "create") {
                  await variableService.create(payload);
                  toast.success("✅ Variable créée !");
                } else if (variable) {
                  await variableService.update(Number(variable.id), payload);
                  toast.success("✨ Variable mise à jour !");
                }
                closeModal();
              } catch (err) {
                toast.error("❌ Erreur lors de la soumission");
                console.error(err);
              }
            }}
            modalTitle={modalMode === "create" ? "Créer une variable" : "Modifier la variable"}
            backgroundIllustration={<CircleStackIcon className="w-40 h-40 text-indigo-100" />}
            submitLabel={modalMode === "create" ? "Créer" : "Mettre à jour"}
            onCancel={closeModal}
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
