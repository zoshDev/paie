import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import DataTable from '@/components/table/DataTable';
import Menu, { MenuItem } from '@/components/ui/Menu/Menu';
import EntityModals from '@/components/ui/Modal/EntityModal';
import BulkActionsBar from '@/components/ui/BulkActionsBar';
import GenericForm from '@/components/form/GenericForm';

import { categorieEchelonFormSections } from '@/schemas/categorieEchelon/categorieEchelon.schema';
import { categorieEchelonService } from '@/services/categorieEchelonService';
import useCategorieEchelons from './useCategorieEchelons';
import useCategories from '../categorie/useCategories';
import useEchelons from '../echelons/useEchelons';

import {
  PlusIcon,
  ChevronDownIcon,
  TrashIcon,
  SquaresPlusIcon
} from '@heroicons/react/24/outline';

import type { CategorieEchelon } from '@/types/categorieEchelon';
import toast from 'react-hot-toast';

const CategorieEchelonListPage: React.FC = () => {
  const {
    associations,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected
  } = useCategorieEchelons();

  const { categories } = useCategories();
  const { echelons } = useEchelons();

  const [selectedAssociation, setSelectedAssociation] = useState<CategorieEchelon | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | 'create' | 'bulk-delete' | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const openModal = (assoc: CategorieEchelon | null, mode: typeof modalMode) => {
    setSelectedAssociation(assoc);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedAssociation(null);
    setModalMode(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleActions = () => setIsActionsOpen((prev) => !prev);

  const handleAddAssociation = () => {
    openModal(null, 'create');
    setIsActionsOpen(false);
  };

  const openBulkDeleteModal = () => {
    setModalMode('bulk-delete');
    setIsActionsOpen(false);
  };

  const actions = [
    {
      label: 'Supprimer',
      icon: <TrashIcon className="w-4 h-4" />,
      onClick: openBulkDeleteModal,
      className:
        'flex items-center gap-1 px-2 py-1 text-rose-600 hover:text-white hover:bg-rose-600 rounded transition'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Associations Catégorie ↔ Échelon" description="Gérer les liens entre barèmes et échelons">
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Rechercher une association..."
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
              <MenuItem onClick={handleAddAssociation} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter une Association
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
        data={associations}
        columns={[
          {
            key: 'categorieId',
            header: 'Catégorie',
            renderCell: (item) =>
              categories.find((c) => c.id === item.categorieId)?.libelle ?? 'Catégorie inconnue'
          },
          {
            key: 'echelonId',
            header: 'Échelon',
            renderCell: (item) =>
              echelons.find((e) => e.id === item.echelonId)?.libelle ?? 'Échelon inconnu'
          }
        ]}
        selectedIds={selectedIds}
        onToggleSelectedId={toggleSelectedId}
        onToggleAllSelected={toggleAllSelected}
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={<SquaresPlusIcon className="text-[120px] text-lime-100" />}
        onClearSelection={clearSelection}
        onEdit={(assoc) => openModal(assoc, 'edit')}
        onDelete={(assoc) => openModal(assoc, 'delete')}
        onBulkDelete={openBulkDeleteModal}
      />

      <EntityModals
        selectedIds={selectedIds}
        mode={modalMode}
        entity={selectedAssociation}
        onClose={closeModal}
        onDeleteConfirm={(id) => {
          toast.success(`Association supprimée : ${id} ✅`);
          clearSelection();
          closeModal();
        }}
        renderEditForm={(assoc) => (
          <GenericForm
            sections={categorieEchelonFormSections.map((section) => ({
              ...section,
              fields: section.fields.map((field) => {
                if (field.name === 'categorieId') {
                  return {
                    ...field,
                    options: categories.map((c) => ({ label: c.libelle, value: c.id }))
                  };
                }
                if (field.name === 'echelonId') {
                  return {
                    ...field,
                    options: echelons.map((e) => ({ label: e.libelle, value: e.id }))
                  };
                }
                return field;
              })
            }))}
            initialData={assoc ?? {}}
            onSubmit={async (values) => {
              try {
                if (modalMode === 'create') {
                  await categorieEchelonService.create(values);
                  toast.success('Association créée ✅');
                } else if (assoc) {
                  await categorieEchelonService.update({ ...values }, assoc.id);
                  toast.success('Association mise à jour ✨');
                }
                closeModal();
              } catch (err) {
                toast.error('Erreur lors de la soumission ❌');
                console.error(err);
              }
            }}
            backgroundIllustration={<SquaresPlusIcon className="w-40 h-40 text-lime-100" />}
            submitLabel={modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
          />
        )}
      />
    </div>
  );
};

export default CategorieEchelonListPage;
