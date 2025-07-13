import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import DataTable from '@/components/table/DataTable';
import BulkActionsBar from '@/components/ui/BulkActionsBar';
import EntityModals from '@/components/ui/Modal/EntityModal';
import GenericForm from '@/components/form/GenericForm';
import Menu, { MenuItem } from '@/components/ui/Menu/Menu';
import toast from 'react-hot-toast';

import useCategorieEchelons from './useCategorieEchelons';
import useCategories from '../categoriess/useCategories';
import useEchelons from '../echelon/useEchelons';

import { categorieEchelonFormSections } from '@/schemas/categorieEchelon/categorieEchelon.schema';
import { categorieEchelonService } from '@/services/categorieEchelonService';
import type { CategorieEchelon } from '@/types/categorieEchelon';

import {
  TrashIcon,
  ChevronDownIcon,
  SquaresPlusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const CategorieEchelonGrid: React.FC = () => {
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

  const formattedData = associations.map((assoc) => ({
    ...assoc,
    categorieLabel: categories.find((c) => c.id === assoc.categorieId)?.libelle ?? '—',
    echelonLabel: echelons.find((e) => e.id === assoc.echelonId)?.libelle ?? '—'
  }));

  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete' | 'bulk-delete' | null>(null);
  const [selectedAssociation, setSelectedAssociation] = useState<CategorieEchelon | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const toggleActions = () => setIsActionsOpen(prev => !prev);

  const handleAddAssociation = () => {
    setSelectedAssociation(null);
    setModalMode('create');
    setIsActionsOpen(false);
  };

  const handleEdit = (entry: CategorieEchelon) => {
    setSelectedAssociation(entry);
    setModalMode('edit');
  };

  const handleDelete = (entry: CategorieEchelon) => {
    setSelectedAssociation(entry);
    setModalMode('delete');
  };

  const openBulkDeleteModal = () => {
    setModalMode('bulk-delete');
    setIsActionsOpen(false);
  };

  const closeModal = () => {
    setSelectedAssociation(null);
    setModalMode(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const actions = [
    {
      label: 'Supprimer',
      icon: <TrashIcon className="w-4 h-4" />,
      onClick: openBulkDeleteModal,
      className: 'flex items-center gap-1 px-2 py-1 text-rose-600 hover:text-white hover:bg-rose-600 rounded transition'
    }
  ];

  const formSections = categorieEchelonFormSections.map(section => ({
  ...section,
  fields: section.fields.map(field => {
    if (field.name === 'categorieId') {
      return {
        ...field,
        type: 'select' as const,
        options: categories.map(c => ({ label: c.libelle, value: c.id }))
      };
    }
    if (field.name === 'echelonId') {
      return {
        ...field,
        type: 'select'as const,
        options: echelons.map(e => ({ label: e.libelle, value: e.id }))
      };
    }
    return field;
  })
}));


  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Associations Catégorie ↔ Échelon" description="Gérer les combinaisons disponibles">
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Rechercher une association..."
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
              <MenuItem onClick={handleAddAssociation} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter une Association
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
        data={formattedData}
        columns={[
          { key: 'categorieLabel', header: 'Catégorie' },
          { key: 'echelonLabel', header: 'Échelon' }
        ]}
        selectedIds={selectedIds}
        onToggleSelectedId={toggleSelectedId}
        onToggleAllSelected={toggleAllSelected}
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={<SquaresPlusIcon className="text-[120px] text-lime-100" />}
        onClearSelection={clearSelection}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onBulkDelete={openBulkDeleteModal}
      />

      <EntityModals
        selectedIds={selectedIds}
        mode={modalMode}
        entity={selectedAssociation}
        formFields={categorieEchelonFormSections.map(section => ({
          ...section,
          fields: section.fields.map(field => {
            if (field.name === 'categorieId') {
              return { ...field, type:'select', options: categories.map(c => ({ label: c.libelle, value: c.id })) };
            }
            if (field.name === 'echelonId') {
              return { ...field, type:'select', options: echelons.map(e => ({ label: e.libelle, value: e.id })) };
            }
            return field;
          })
        }))}
        onClose={closeModal}
        onDeleteConfirm={(id) => {
          toast.success(`Association supprimée : ${id} ✅`);
          clearSelection();
          closeModal();
        }}
        renderEditForm={(entry) => (
    <GenericForm
      sections = {formSections}
      initialData={entry ?? {}}
      onSubmit={async (values) => {
        try {
          if (modalMode === 'create') {
            await categorieEchelonService.create(values);
            toast.success('Association créée ✅');
          } else if (entry) {
            await categorieEchelonService.update({ ...values, id: entry.id });
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

export default CategorieEchelonGrid;
