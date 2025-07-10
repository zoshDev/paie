import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import DataTable from '@/components/table/DataTable';
import Menu, { MenuItem } from '@/components/ui/Menu/Menu';
import BulkActionsBar from '@/components/ui/BulkActionsBar';
import EntityModals from '@/components/ui/Modal/EntityModal';
import GenericForm from '@/components/form/GenericForm';

import { categorieColumns } from './columns';
import { categorieFormSections } from '@/pages/categoriess/categorie.schema';
import { categorieService } from '@/services/categorieService';
import useCategories from './useCategories';
import toast from 'react-hot-toast';

import {
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  TagIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

import type { Categorie } from '@/types/categorie';

const CategorieListPage: React.FC = () => {
  const {
    categories,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected
  } = useCategories();

  const [selectedCategorie, setSelectedCategorie] = useState<Categorie | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | 'create' | 'bulk-delete' | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const openModal = (cat: Categorie | null, mode: typeof modalMode) => {
    setSelectedCategorie(cat);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedCategorie(null);
    setModalMode(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleActions = () => setIsActionsOpen((prev) => !prev);

  const handleAddCategorie = () => {
    openModal(null, 'create');
    setIsActionsOpen(false);
  };

  const openBulkDeleteModal = () => {
    setModalMode('bulk-delete');
    setIsActionsOpen(false);
  };

  const handleImportCategories = () => {
    alert('Importer des catégories');
    setIsActionsOpen(false);
  };

  const handleExportCategories = () => {
    alert('Exporter des catégories');
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
      <PageHeader title="Catégories" description="Gérer les catégories de barème">
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Rechercher une catégorie..."
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
              <MenuItem onClick={handleAddCategorie} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter une Catégorie
              </MenuItem>
              <MenuItem onClick={handleImportCategories} icon={<ArrowDownTrayIcon className="w-5 h-5" />}>
                Importer des Catégories
              </MenuItem>
              <MenuItem onClick={handleExportCategories} icon={<ArrowUpTrayIcon className="w-5 h-5" />}>
                Exporter des Catégories
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
        data={categories}
        columns={categorieColumns}
        selectedIds={selectedIds}
        onToggleSelectedId={toggleSelectedId}
        onToggleAllSelected={toggleAllSelected}
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={<div className="text-[120px] text-green-100">🏷️</div>}
        onClearSelection={clearSelection}
        onView={(cat) => openModal(cat, 'view')}
        onEdit={(cat) => openModal(cat, 'edit')}
        onDelete={(cat) => openModal(cat, 'delete')}
        onBulkDelete={openBulkDeleteModal}
      />

      <EntityModals
        selectedIds={selectedIds}
        mode={modalMode}
        entity={selectedCategorie}
        formFields={categorieFormSections}
        onClose={closeModal}
        onDeleteConfirm={(id) => {
          toast.success(`Catégorie supprimée : ${id} ✅`);
          clearSelection();
          closeModal();
        }}
        renderEditForm={(cat) => (
          <GenericForm
            sections={categorieFormSections}
            initialData={cat ?? {}}
            onSubmit={async (values) => {
              try {
                if (modalMode === 'create') {
                  await categorieService.create(values);
                  toast.success('Catégorie créée ✅');
                } else if (cat) {
                  await categorieService.update({ ...cat, ...values });
                  toast.success('Catégorie mise à jour ✨');
                }
                closeModal();
              } catch (err) {
                toast.error('Erreur lors de la soumission ❌');
                console.error(err);
              }
            }}
            backgroundIllustration={<TagIcon className="w-40 h-40 text-green-100" />}
            submitLabel={modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
          />
        )}
        renderView={(cat) =>
          modalMode === 'bulk-delete' ? (
            <div>
              <p>Suppression de <strong>{selectedIds.length}</strong> catégories.</p>
              <p className="text-sm text-red-600">Action irréversible.</p>
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              <p><strong>Libellé :</strong> {cat?.libelle}</p>
            </div>
          )
        }
      />
    </div>
  );
};

export default CategorieListPage;
