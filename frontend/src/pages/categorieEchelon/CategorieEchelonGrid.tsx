import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import DataTable from '@/components/table/DataTable';
import Menu, { MenuItem } from '@/components/ui/Menu/Menu';
import BulkActionsBar from '@/components/ui/BulkActionsBar';
import EntityModals from '@/components/ui/Modal/EntityModal';
import GenericForm from '@/components/form/GenericForm';
import type { Column } from '@/components/table/types';


import { categorieEchelonColumns } from './columns';
import { categorieEchelonFormSections } from '@/schemas/categorieEchelon/categorieEchelon.schema';
import { categorieEchelonService } from '@/services/categorieEchelonService';
import useCategorieEchelons from './useCategorieEchelons';
import toast from 'react-hot-toast';

import {
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  SquaresPlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import type { CategorieEchelon } from '@/types/categorieEchelon';
import useCategories from '../categoriess/useCategories';
import useEchelons from '../echelon/useEchelons';

const CategorieEchelonGrid: React.FC = () => {
  const {
    categorieEchelons,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected
  } = useCategorieEchelons();

  const [selectedEntry, setSelectedEntry] = useState<CategorieEchelon | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | 'create' | 'bulk-delete' | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const { categories } = useCategories();
  const { echelons } = useEchelons();

  const openModal = (entry: CategorieEchelon | null, mode: typeof modalMode) => {
    setSelectedEntry(entry);
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedEntry(null);
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

  const handleImport = () => {
    alert('Importer des associations');
    setIsActionsOpen(false);
  };

  const handleExport = () => {
    alert('Exporter les associations');
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
      <PageHeader title="Associations Catégorie ↔ Échelon" description="Définir les combinaisons disponibles pour les employés">
        <div className="w-full flex flex-col md:flex-row md:items-center gap-4">
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
              <MenuItem onClick={handleImport} icon={<ArrowDownTrayIcon className="w-5 h-5" />}>
                Importer des Associations
              </MenuItem>
              <MenuItem onClick={handleExport} icon={<ArrowUpTrayIcon className="w-5 h-5" />}>
                Exporter les Associations
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
        data={categorieEchelons}
        columns={categorieEchelonColumns.map((col): Column<CategorieEchelon> => ({
        key: col.key,
        header: col.header,
        renderCell: (item: CategorieEchelon) => {
            if (col.key === 'categorieId') {
            const libelle = categories.find((c) => c.id === item.categorieId)?.libelle;
                return libelle ?? 'Catégorie inconnue';
            }
            if (col.key === 'echelonId') {
            const libelle = echelons.find((e) => e.id === item.echelonId)?.libelle;
                return libelle ?? 'Échelon inconnu';
            }
            return '';
        }
        }))}
        selectedIds={selectedIds}
        onToggleSelectedId={toggleSelectedId}
        onToggleAllSelected={toggleAllSelected}
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={<SquaresPlusIcon className="w-40 h-40 text-lime-100" />}
        onClearSelection={clearSelection}
        onView={(entry) => openModal(entry, 'view')}
        onEdit={(entry) => openModal(entry, 'edit')}
        onDelete={(entry) => openModal(entry, 'delete')}
        onBulkDelete={openBulkDeleteModal}
      />

      <EntityModals
        selectedIds={selectedIds}
        mode={modalMode}
        entity={selectedEntry}
        formFields={categorieEchelonFormSections.map(section => ({
          ...section,
          fields: section.fields.map(field => {
            if (field.name === 'categorieId') {
              return { ...field, options: categories.map(cat => ({ label: cat.libelle, value: cat.id })) };
            }
            if (field.name === 'echelonId') {
              return { ...field, options: echelons.map(ech => ({ label: ech.libelle, value: ech.id })) };
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
            sections={categorieEchelonFormSections.map(section => ({
              ...section,
              fields: section.fields.map(field => {
                if (field.name === 'categorieId') {
                  return { ...field, options: categories.map(cat => ({ label: cat.libelle, value: cat.id })) };
                }
                if (field.name === 'echelonId') {
                  return { ...field, options: echelons.map(ech => ({ label: ech.libelle, value: ech.id })) };
                }
                return field;
              })
            }))}
            initialData={entry ?? {}}
            onSubmit={async (values) => {
              try {
                if (modalMode === 'create') {
                  await categorieEchelonService.create(values);
                  toast.success('Association créée ✅');
                } else if (entry) {
                  await categorieEchelonService.update({ ...entry, ...values });
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
        renderView={(entry) =>
          modalMode === 'bulk-delete' ? (
            <div>
              <p>Vous êtes sur le point de supprimer <strong>{selectedIds.length}</strong> associations.</p>
              <p className="text-sm text-red-600">Cette action est irréversible.</p>
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              <p>
                <strong>Catégorie :</strong>{' '}
                {categories.find(c => c.id === entry?.categorieId)?.libelle ?? 'Catégorie inconnue'}
              </p>
              <p>
                <strong>Échelon :</strong>{' '}
                {echelons.find(e => e.id === entry?.echelonId)?.libelle ?? 'Échelon inconnu'}
              </p>
            </div>
          )
        }
      />
    </div>
  );
};

export default CategorieEchelonGrid;