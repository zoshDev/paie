import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import DataTable from '../../components/table/DataTable';
import Menu, { MenuItem } from '../../components/ui/Menu/Menu';
import EntityModals from '../../components/ui/Modal/EntityModal';
import BulkActionsBar from '../../components/ui/BulkActionsBar';
import GenericForm from '../../components/form/GenericForm';

import { societeColumns } from './column';
import { companyFormSections } from './companyFormSections';
import { companyService } from '@/services/companyService';
import useCompanies from './useCompanies';


import {
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  TrashIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';

import type { Societe } from './types';

const CompaniesListPage: React.FC = () => {
  const {
    companies,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected
  } = useCompanies();

  const [selectedCompany, setSelectedCompany] = useState<Societe | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | 'create' | 'bulk-delete' | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const openModal = (company: Societe | null, mode: typeof modalMode) => {
    setSelectedCompany(company);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setModalMode(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleActions = () => setIsActionsOpen((prev) => !prev);

  const handleAddCompany = () => {
    openModal(null, 'create');
    setIsActionsOpen(false);
  };

  const openBulkDeleteModal = () => {
    setModalMode('bulk-delete');
    setIsActionsOpen(false);
  };

  const handleImportCompanies = () => {
    alert('Importer des sociétés');
    setIsActionsOpen(false);
  };

  const handleExportCompanies = () => {
    alert('Exporter des sociétés');
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
      <PageHeader title="Liste des Sociétés" description="Gérer les entités légales de l’entreprise">
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
              <MenuItem onClick={handleAddCompany} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter une Société
              </MenuItem>
              <MenuItem onClick={handleImportCompanies} icon={<ArrowDownTrayIcon className="w-5 h-5" />}>
                Importer des Sociétés
              </MenuItem>
              <MenuItem onClick={handleExportCompanies} icon={<ArrowUpTrayIcon className="w-5 h-5" />}>
                Exporter des Sociétés
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
        data={companies}
        columns={societeColumns}
        selectedIds={selectedIds}
        onToggleSelectedId={toggleSelectedId}
        onToggleAllSelected={toggleAllSelected}
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={<div className="text-[120px] text-indigo-100">🏢</div>}
        onClearSelection={clearSelection}
        onView={(soc) => openModal(soc, 'view')}
        onEdit={(soc) => openModal(soc, 'edit')}
        onDelete={(soc) => openModal(soc, 'delete')}
        onBulkDelete={openBulkDeleteModal}
      />

      <EntityModals
        selectedIds={selectedIds}
        mode={modalMode}
        entity={selectedCompany}
        onClose={closeModal}  
        onDeleteConfirm={(id) => {
          console.log('Suppression de la société :', id);
          closeModal();
        }}
        renderEditForm={(soc) => (
          <GenericForm
            sections={companyFormSections}
            initialData={soc ?? {}}
            onSubmit={async (values) => {
              if (modalMode === 'create') { 
                await companyService.create(values);
              } else if (soc) {
                await companyService.update({...values}, soc.id);
              }
              closeModal();
            }}
            backgroundIllustration={<BuildingOffice2Icon className="w-40 h-40 text-indigo-100" />}
            submitLabel={modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
          />
        )}
        renderView={(soc) =>
          modalMode === 'bulk-delete' ? (
            <div>
              <p>Vous êtes sur le point de supprimer <strong>{selectedIds.length}</strong> sociétés.</p>
              <p className="text-sm text-red-600">Cette action est irréversible.</p>
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              <p><strong>Nom :</strong> {typeof soc?.nom === 'object' ? JSON.stringify(soc?.nom) : soc?.nom}</p>
              <p><strong>Localisation :</strong> {typeof soc?.localisation === 'object' ? JSON.stringify(soc?.localisation) : soc?.localisation}</p>
              <p><strong>Régime Fiscal :</strong> {typeof soc?.regime_fiscal === 'object' ? JSON.stringify(soc?.regime_fiscal) : soc?.regime_fiscal}</p>
            </div>
          )
        }
      />
    </div>
  );
};

export default CompaniesListPage;
