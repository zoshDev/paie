import { useState, useEffect } from 'react';
import { usePayrollItemStore } from '../../stores/payrollItemStore';
import { useExamplePayrollProfileStore } from '../../stores/examplePayrollProfileStore';
import GenericListPage from '../../components/ui/GenericListPage';
import type { ColumnDef } from '../../components/ui/GenericListPage';
import type { PayrollItem } from '../../models/payrollItems';
import Button from '../../components/layout/button/Button';
import ItemRowActions from './components/ItemRowActions';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import AddEditItemModal from './components/AddEditItemModal';

export default function PayrollItemListPage() {
  const {
    items,
    selectedIds,
    filter,
    isLoading,
    error,
    currentItemId,
    showDeleteModal,
    
    setFilter,
    handleSelect,
    handleSelectAll,
    setCurrentItemId,
    toggleDeleteModal,
    fetchItems,
  } = usePayrollItemStore();

  // État local pour les modales
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<PayrollItem | null>(null);

  // Profils pour l'assignation
  const { profiles } = useExamplePayrollProfileStore();

  // Charger les rubriques au montage du composant
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Élément sélectionné pour les modales
  const selectedItem = currentItemId 
    ? items.find(i => i.id === currentItemId) || null
    : null;

  // Définition des colonnes
  const columns: ColumnDef<PayrollItem>[] = [
    {
      header: 'Code',
      accessorKey: 'code',
      isSortable: true,
    },
    {
      header: 'Nom',
      accessorKey: 'name',
      isSortable: true,
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.type === 'earning' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {item.type === 'earning' ? 'Gain' : 'Déduction'}
        </span>
      ),
      isSortable: true,
    },
    {
      header: 'Payeur',
      accessorKey: 'payer',
      cell: (item) => {
        let badge;
        switch (item.payer) {
          case 'employee':
            badge = <span className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Employé</span>;
            break;
          case 'employer':
            badge = <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Employeur</span>;
            break;
          case 'both':
            badge = <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Les deux</span>;
            break;
          default:
            badge = <span>-</span>;
        }
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
            {badge}
          </span>
        );
      },
    },
    {
      header: 'Montant',
      accessorKey: 'amount',
      cell: (item) => {
        if (item.calculationMethod === 'fixed') {
          return new Intl.NumberFormat('fr-FR').format(item.amount);
        } else if (item.calculationMethod === 'percentage') {
          return `${item.percentage}% de ${item.referenceValue || 'base'}`;
        } else {
          return 'Formule';
        }
      },
    },
    {
      header: 'Statut',
      accessorKey: 'isActive',
      cell: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.isActive 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}>
          {item.isActive ? 'Actif' : 'Inactif'}
        </span>
      ),
    },
  ];

  // Actions sur les lignes
  const handleAdd = () => {
    setCurrentItem(null);
    setIsEditing(false);
    setShowFormModal(true);
  };
  
  const handleEdit = (item: PayrollItem) => {
    setCurrentItem(item);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleDelete = (item: PayrollItem) => {
    setCurrentItemId(item.id);
    toggleDeleteModal(true);
  };
  
  const handleAssignToProfile = (item: PayrollItem) => {
    setCurrentItem(item);
    setShowAssignModal(true);
  };

  // Actions contextuelles (en cas de sélection multiple)
  const renderContextualActions = (selectedItems: PayrollItem[]) => {
    return (
      <div className="flex space-x-2">
        <Button
          variant="danger"
          onClick={() => {
            selectedIds.forEach(id => {
              setCurrentItemId(id);
              toggleDeleteModal(true);
            });
          }}
          disabled={selectedItems.some(p => p.isDefault)}
        >
          Supprimer ({selectedItems.length})
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setShowAssignModal(true);
          }}
        >
          Assigner à un profil
        </Button>
      </div>
    );
  };

  // État d'erreur
  if (error) {
    return <div className="p-4 text-red-500">Erreur: {error}</div>;
  }

  return (
    <>
      <GenericListPage
        title="Gestion des rubriques de paie"
        description="Créez et gérez les rubriques qui composent les fiches de paie"
        columns={columns}
        data={items}
        selectedIds={selectedIds}
        isLoading={isLoading}
        searchQuery={filter.searchQuery || ''}
        onSearchChange={(query) => setFilter({ searchQuery: query })}
        onSelect={handleSelect}
        onSelectAll={() => handleSelectAll(items)}
        onAdd={handleAdd}
        addButtonLabel="Ajouter une rubrique"
        renderRowActions={(item) => (
          <ItemRowActions
            item={item}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
            onAssignToProfile={() => handleAssignToProfile(item)}
          />
        )}
        renderContextualActions={renderContextualActions}
      />

      {/* Modal pour la confirmation de suppression */}
      {showDeleteModal && selectedItem && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          item={selectedItem}
          onClose={() => toggleDeleteModal(false)}
          onConfirm={() => {
            if (currentItemId) {
              usePayrollItemStore.getState().deleteItem(currentItemId);
              toggleDeleteModal(false);
            }
          }}
        />
      )}

      {/* Modal pour ajouter/éditer une rubrique */}
      {showFormModal && (
        <AddEditItemModal
          isOpen={showFormModal}
          isEdit={isEditing}
          item={currentItem}
          items={items}
          onClose={() => setShowFormModal(false)}
        />
      )}

      {/* Le modal d'assignation à un profil sera ajouté plus tard
      {showAssignModal && (
        <AssignToProfileModal
          isOpen={showAssignModal}
          items={currentItem ? [currentItem] : items.filter(item => selectedIds.includes(item.id))}
          profiles={profiles}
          onClose={() => setShowAssignModal(false)}
        />
      )} */}
    </>
  );
} 