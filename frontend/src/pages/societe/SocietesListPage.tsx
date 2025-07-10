import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import DataTable from '../../components/table/DataTable';
import Menu, { MenuItem } from '../../components/ui/Menu/Menu';
import { societeColumns } from './column'; // Importation des colonnes
import EntityModals from '../../components/ui/Modal/EntityModal';
import useSocietes from './useSocietes';
import GenericForm from '../../components/form/GenericForm';
import type { FormField } from '../../components/form/GenericForm';
import BulkActionsBar from '../../components/ui/BulkActionsBar';
import { societeFields } from './societeFields'; // Importation des champs du formulaire

import {
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { Societe } from './types';

const columns = societeColumns;

const SocietesListPage: React.FC = () => {
  const {
    societes,
    searchTerm,
    setSearchTerm,
    isLoading,
    isError,
    selectedIds,
    setSelectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected,
  } = useSocietes();

  // Gestion Modal
  const [selectedSociete, setSelectedSociete] = useState<Societe | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | 'create' | 'bulk-delete' | null>(null);
  const openModal = (societe: Societe | null, mode: typeof modalMode) => {
    setSelectedSociete(societe);
    setModalMode(mode);
  };
  const closeModal = () => {
    setSelectedSociete(null);
    setModalMode(null);
  };
  const handleDelete = (id: string) => {
    alert(`Supprimer la société avec l'ID: ${id}`);
    closeModal();
  };

  // Gestion des actions
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log('Recherche (Sociétés):', e.target.value);
  };
  const toggleActions = () => {
    setIsActionsOpen(!isActionsOpen);
  };

  // Gestion des actions Menus
  const handleAddSociete = () => {
    openModal(null, 'create');
    setIsActionsOpen(false);
  };
  const openBulkDeleteModal = () => {
    setSelectedSociete({
      id: selectedIds.join(', '),
      Nom: `Supprimer ${selectedIds.length} sociétés`,
      Adresse: '',
      CodePostal: '',
      Ville: '',
      Pays: '',
    });
    setModalMode('bulk-delete');
    setIsActionsOpen(false);
  };
  const handleImportSocietes = () => {
    alert('Importer des sociétés');
    setIsActionsOpen(false);
  };
  const handleExportSocietes = () => {
    alert('Exporter des sociétés');
    setIsActionsOpen(false);
  };

  const actions = [
    {
      label: 'Supprimer',
      icon: <TrashIcon className="w-4 h-4" />,
      onClick: openBulkDeleteModal,
      className: 'flex items-center gap-1 px-2 py-1 text-rose-600 hover:text-white hover:bg-rose-600 rounded transition',
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Liste des Sociétés" description="Gérer les sociétés">
        <div className="flex items-center space-x-4">
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
              <MenuItem onClick={handleAddSociete} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter une Société
              </MenuItem>
              <MenuItem onClick={handleImportSocietes} icon={<ArrowDownTrayIcon className="w-5 h-5" />}>
                Importer des Sociétés
              </MenuItem>
              <MenuItem onClick={handleExportSocietes} icon={<ArrowUpTrayIcon className="w-5 h-5" />}>
                Exporter des Sociétés
              </MenuItem>
            </Menu>
          </div>
        </div>
      </PageHeader>

      {selectedIds.length >= 2 && (
        <div className="flex justify-end mb-2">
          <BulkActionsBar count={selectedIds.length} actions={actions} onClearSelection={clearSelection} />
        </div>
      )}

      <DataTable
        data={societes}
        columns={columns}
        selectedIds={selectedIds}
        onToggleSelectedId={toggleSelectedId}
        onToggleAllSelected={toggleAllSelected}
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={
          <div className="text-[120px] text-blue-100">
            🏢
          </div>
        }
        onClearSelection={clearSelection}
        onView={(societe) => openModal(societe, 'view')}
        onEdit={(societe) => openModal(societe, 'edit')}
        onDelete={(societe) => openModal(societe, 'delete')}
        onBulkDelete={openBulkDeleteModal}
      />

      <EntityModals
        selectedIds={selectedIds}
        mode={modalMode}
        entity={selectedSociete}
        formFields={societeFields} // Utilisation des champs importés
        onClose={() => {
          setModalMode(null);
          setSelectedSociete(null);
        }}
        onDeleteConfirm={(id) => {
          if (modalMode === 'bulk-delete') {
            console.log('Suppression de plusieurs sociétés:', selectedIds);
            clearSelection();
          } else {
            console.log('Suppression d’une société:', id);
          }
          setModalMode(null);
          setSelectedSociete(null);
        }}
        renderEditForm={(soc) => (
          <GenericForm
            fields={societeFields} // Utilisation des champs importés
            initialValues={soc ?? {}}
            onSubmit={(values) => {
              console.log('Soumission formulaire (Société):', values);
              closeModal();
            }}
            backgroundIllustration={<BuildingOfficeIcon className="w-40 h-40 text-indigo-100" />}
            submitLabel={modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
          />
        )}
        renderView={(soc) => {
          if (modalMode === 'bulk-delete') {
            return (
              <div>
                <p>
                  Vous êtes sur le point de supprimer{' '}
                  <strong>{selectedIds.length}</strong> sociétés.
                </p>
                <p className="text-sm text-red-600">Cette action est irréversible.</p>
              </div>
            );
          }

          return (
            <div className="space-y-1 text-sm">
              <p>
                <strong>Nom :</strong> {soc?.Nom}
              </p>
              <p>
                <strong>Adresse :</strong> {soc?.Adresse}
              </p>
              <p>
                <strong>Ville :</strong> {soc?.Ville}
              </p>
              <p>
                <strong>Pays :</strong> {soc?.Pays}
              </p>
            </div>
          );
        }}
      />
    </div>
  );
};

export default SocietesListPage;