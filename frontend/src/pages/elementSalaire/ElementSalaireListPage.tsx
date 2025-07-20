import React, { useState, useEffect } from "react";

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
import { elementSalaireColumns } from "./elementSalaire.columns";
import { elementSalaireFormSections } from "./elementSalaireFormSections";
import { elementSalaireService } from "./elementSalaireService";
import useElementsSalaire from "./useElementSalaire";

import type{ Variable } from "../variable/variableService";
import { companyService } from "@/services/companyService";
import { variableService } from "../variable/variableService";

// ✅ Icônes
import {
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

// 🧠 Type backend
import type { ElementSalaire } from "./elementSalaire";

const ElementSalaireListPage: React.FC = () => {
  // 🧠 Hook personnalisé qui gère données et état
  const {
    elements,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected
  } = useElementsSalaire();

  const elementsWithId = elements.map((el) => ({
  ...el,
  id: String(el.id), // ✅ compatibilité avec DataTable
}));





//FONCTION APPEL SERVICE
function chargerOptionsMétier(): Promise<{
  societeOptions: { label: string; value: number }[];
  variableOptions: { label: string; value: number }[];
}> {
  return Promise.all([
    companyService.list(),
    variableService.getAll()
  ]).then(([societes, variables]) => ({
    societeOptions: societes.map((s) => ({ label: s.nom, value: s.id })),
    variableOptions: (variables as Variable[]).map((v) => ({ label: v.nom, value: v.id })),
  }));
}
//STOCKAGE DANS UN HOOK
const [formOptions, setFormOptions] = useState<{
  societeOptions: { label: string; value: number }[];
  variableOptions: { label: string; value: number }[];
}>({ societeOptions: [], variableOptions: [] });

useEffect(() => {
  chargerOptionsMétier().then(setFormOptions);
}, []);

const sectionAvecOptions = elementSalaireFormSections.map((section) => ({
  ...section,
  fields: section.fields.map((field) => {
    if (field.name === "societeId") {
      return { ...field, options: formOptions.societeOptions };
    }
    if (field.name === "variableId") {
      return { ...field, options: formOptions.variableOptions };
    }
    return field;
  })
}));





  
  // 🧠 Modale active (create, edit, delete, view…)
  const [selectedElement, setSelectedElement] = useState<ElementSalaire | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | 'create' | 'bulk-delete' | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  // 🔄 Ouvrir une modale avec un élément
  const openModal = (element: ElementSalaire | null, mode: typeof modalMode) => {
    setSelectedElement(element);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedElement(null);
    setModalMode(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleActions = () => setIsActionsOpen((prev) => !prev);

  const handleAddElement = () => {
    openModal(null, "create");
    setIsActionsOpen(false);
  };

  const handleImport = () => {
    alert("Import Excel non disponible");
    setIsActionsOpen(false);
  };

  const handleExport = () => {
    alert("Export Excel non disponible");
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
      {/* 🧱 En-tête de la page */}
      <PageHeader
        title="Éléments de Salaire"
        description="Gérez les primes, retenues et paramètres calculés"
      >
        <div className="flex items-center space-x-4">
          {/* 🔍 Champ de recherche */}
          <Input
            type="text"
            placeholder="Rechercher un élément..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:flex-1"
          />
          {/* ⚙️ Bouton Actions */}
          <div className="relative">
            <Button onClick={toggleActions} className="flex items-center whitespace-nowrap">
              <span>Actions</span>
              <ChevronDownIcon className="w-5 h-5 ml-2" />
            </Button>
            <Menu isOpen={isActionsOpen} onClose={() => setIsActionsOpen(false)}>
              <MenuItem onClick={handleAddElement} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter un Élément
              </MenuItem>
              <MenuItem onClick={handleImport} icon={<ArrowDownTrayIcon className="w-5 h-5" />}>
                Importer
              </MenuItem>
              <MenuItem onClick={handleExport} icon={<ArrowUpTrayIcon className="w-5 h-5" />}>
                Exporter
              </MenuItem>
            </Menu>
          </div>
        </div>
      </PageHeader>

      {/* 🔁 Barre d’actions groupées si sélection multiple */}
      {selectedIds.length >= 2 && (
        <div className="flex justify-end mb-2">
          <BulkActionsBar
            count={selectedIds.length}
            actions={actions}
            onClearSelection={clearSelection}
          />
        </div>
      )}

      {/* 📊 Tableau des éléments */}
      
      <DataTable
        data={elements}//{elementsWithId}
        columns={elementSalaireColumns}
        //Ligne cle
        //selectedIds={selectedIds.map((id) => String(id))} // ✅ conversion ici
        selectedIds={selectedIds.map((id) => String(id))} // ✅ conversion ici
        onToggleSelectedId={(id) => toggleSelectedId(Number(id))}

        //onToggleAllSelected={toggleAllSelected}
        onToggleAllSelected={() => toggleAllSelected(elements)}
        
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={<div className="text-[120px] text-yellow-100">💰</div>}
        onClearSelection={clearSelection}
        onView={(element) => openModal(element, "view")}
        onEdit={(element) => openModal(element, "edit")}
        onDelete={(element) => openModal(element, "delete")}
        onBulkDelete={() => openModal(null, "bulk-delete")}
      />

      {/* 🧾 Modale Générique */}
      <EntityModals
        //selectedIds={selectedIds}
        selectedIds={selectedIds.map((id) => String(id))} // ✅ conversion en string[]
        mode={modalMode}
        //entity={selectedElement}
        entity={selectedElement ? { ...selectedElement, id: String(selectedElement.variableId) } : null}
        //formFields={elementSalaireFormSections}
        onClose={closeModal}
        onDeleteConfirm={(id) => {
          alert(`Élément supprimé : ${id}`);
          clearSelection();
          closeModal();
        }}
        renderEditForm={(element) => (
          <GenericForm
            sections={sectionAvecOptions}//{elementSalaireFormSections}
            initialData={element ?? {}}
            onSubmit={async (values) => {
              try {
                if (modalMode === "create") {
                  await elementSalaireService.create(values);
                  alert("Élément créé ✅");
                } else if (element) {
                  await elementSalaireService.update(Number(element.id), values);
                  alert("Élément mis à jour ✨");
                }
                closeModal();
              } catch (err) {
                alert("Erreur ❌");
                console.error(err);
              }
            }}
            backgroundIllustration={<CurrencyDollarIcon className="w-40 h-40 text-yellow-100" />}
            submitLabel={modalMode === "create" ? "Créer" : "Mettre à jour"}
          />
        )}
        renderView={(element) =>
  modalMode === "bulk-delete" ? (
    <div>
      <p>Suppression de <strong>{selectedIds.length}</strong> éléments.</p>
      <p className="text-sm text-red-600">Action irréversible.</p>
    </div>
  ) : (
    <div className="space-y-3 text-sm text-gray-800">
      <p>
        <strong>Libellé :</strong> {element?.libelle}
      </p>
      <p>
        <strong>Code :</strong>{" "}
        <span className="text-blue-700 font-mono">{element?.libelle}</span>
      </p>
      <p>
        <strong>Type :</strong>{" "}
        {element?.type_element === "prime" ? "Prime" : "Retenue"}
      </p>
      <p>
        <strong>Nature :</strong>{" "}
        {element?.nature === "fixe" ? "Fixe" : "Variable"}
      </p>
      <div className="flex flex-wrap gap-3 text-xs text-gray-700 mt-2">
        <span
          className={`px-2 py-1 rounded ${
            element?.imposable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          Imposable : {element?.imposable ? "Oui" : "Non"}
        </span>
        <span
          className={`px-2 py-1 rounded ${
            element?.soumisCnps ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          CNPS : {element?.soumisCnps ? "Oui" : "Non"}
        </span>
        <span
          className={`px-2 py-1 rounded ${
            element?.partEmploye ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          Part Employé
        </span>
        <span
          className={`px-2 py-1 rounded ${
            element?.partEmployeur ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          Part Employeur
        </span>
        <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">
          Prorata base : {element?.prorataBase}%
        </span>
      </div>

      <div>
        <p className="font-medium text-gray-700">Processus de calcul :</p>
        <pre className="bg-gray-50 p-3 rounded border border-gray-200 text-[11px] text-gray-600 overflow-x-auto">
          {JSON.stringify(element?.processCalculJson, null, 2)}
        </pre>
      </div>
    </div>
  )
}

      />
    </div>
  );
};

export default ElementSalaireListPage;
