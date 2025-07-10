import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import DataTable from '@/components/table/DataTable';
import Menu, { MenuItem } from '@/components/ui/Menu/Menu';
import BulkActionsBar from '@/components/ui/BulkActionsBar';
import EntityModals from '@/components/ui/Modal/EntityModal';
import GenericForm from '@/components/form/GenericForm';

import { echelonColumns } from './columns';
import { echelonFormSections } from '@/schemas/echelon.schema';
import { echelonService } from '@/services/echelonService';
import useEchelons from './useEchelons';
import toast from 'react-hot-toast';

import {
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  Bars3Icon,
  TrashIcon
} from '@heroicons/react/24/outline';

import type { Echelon } from '@/types/echelon';

const EchelonListPage: React.FC = () => {
  const {
    echelons,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected
  } = useEchelons();

  const [selectedEchelon, setSelectedEchelon] = useState<Echelon | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | 'create' | 'bulk-delete' | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const openModal = (echelon: Echelon | null, mode: typeof modalMode) => {
    setSelectedEchelon(echelon);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedEchelon(null);
    setModalMode(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleActions = () => setIsActionsOpen((prev) => !prev);

  const handleAddEchelon = () => {
    openModal(null, 'create');
    setIsActionsOpen(false);
  };

  const openBulkDeleteModal = () => {
    setModalMode('bulk-delete');
    setIsActionsOpen(false);
  };

  const handleImportEchelons = () => {
    alert('Importer des échelons');
    setIsActionsOpen(false);
  };

  const handleExportEchelons = () => {
    alert('Exporter des échelons');
    setIsActionsOpen(false);
  };

  const actions = [
    {
      label: 'Supprimer',
      icon: <TrashIcon className="w-4 h-4" />,
      onClick: openBulkDeleteModal,
      className: 'flex items-center gap-1 px-2 py-1 text-rose-600 hover:text-white hover:bg-rose-600 rounded transition'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Échelons" description="Gérer les échelons disponibles par catégorie">
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Rechercher un échelon..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:flex-1"
          />
          <div className="relative">
            <Button onClick={toggleActions} className="flex items-center whitespace-nowrap">
              <span>Actions</span>
              <ChevronDownIcon className="w-5 h-5 ml-2" />
            </Button>
            <Menu isOpen={isActionsOpen} onClose={() => setIsActionsOpen(false)}>
              <MenuItem onClick={handleAddEchelon} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter un Échelon
              </MenuItem>
              <MenuItem onClick={handleImportEchelons} icon={<ArrowDownTrayIcon className="w-5 h-5" />}>
                Importer des Échelons
              </MenuItem>
              <MenuItem onClick={handleExportEchelons} icon={<ArrowUpTrayIcon className="w-5 h-5" />}>
                Exporter des Échelons
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
        data={echelons}
        columns={echelonColumns}
        selectedIds={selectedIds}
        onToggleSelectedId={toggleSelectedId}
        onToggleAllSelected={toggleAllSelected}
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={<div className="text-[120px] text-indigo-100">📊</div>}
        onClearSelection={clearSelection}
        onView={(ech) => openModal(ech, 'view')}
        onEdit={(ech) => openModal(ech, 'edit')}
        onDelete={(ech) => openModal(ech, 'delete')}
        onBulkDelete={openBulkDeleteModal}
      />

      <EntityModals
        selectedIds={selectedIds}
        mode={modalMode}
        entity={selectedEchelon}
        formFields={echelonFormSections}
        onClose={closeModal}
        onDeleteConfirm={(id) => {
          toast.success(`Échelon supprimé : ${id} ✅`);
          clearSelection();
          closeModal();
        }}
        renderEditForm={(ech) => (
          <GenericForm
            sections={echelonFormSections}
            initialData={ech ?? {}}
            onSubmit={async (values) => {
              try {
                if (modalMode === 'create') {
                  await echelonService.create(values);
                  toast.success('Échelon créé ✅');
                } else if (ech) {
                  await echelonService.update({ ...ech, ...values });
                  toast.success('Échelon mis à jour ✨');
                }
                closeModal();
              } catch (err) {
                toast.error('Erreur lors de la soumission ❌');
                console.error(err);
              }
            }}
            backgroundIllustration={<Bars3Icon className="w-40 h-40 text-indigo-100" />}
            submitLabel={modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
          />
        )}
        renderView={(ech) =>
          modalMode === 'bulk-delete' ? (
            <div>
              <p>Suppression de <strong>{selectedIds.length}</strong> échelons.</p>
              <p className="text-sm text-red-600">Action irréversible.</p>
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              <p><strong>Libellé :</strong> {ech?.libelle}</p>
            </div>
          )
        }
      />
    </div>
  );
};

export default EchelonListPage;
