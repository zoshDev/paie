import { useState, useCallback } from 'react';
import { useExamplePayrollProfileStore } from '../../stores/examplePayrollProfileStore';
import GenericListPage from '../../components/ui/GenericListPage';
import type { ColumnDef } from '../../components/ui/GenericListPage';
import type { PayrollProfile } from '../../models/payrollProfiles';
import Button from '../../components/layout/button/Button';
import {
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import GenericFormModal from '../../components/ui/GenericFormModal';
import type { FormSection } from '../../components/ui/GenericForm';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import PayrollProfileRowActions from './components/PayrollProfileRowActions';

export default function PayrollProfileListPage() {
  const {
    profiles,
    categories,
    selectedIds,
    searchQuery,
    isLoading,
    showDeleteModal,
    currentProfileId,
    
    setSearchQuery,
      handleSelect,
  handleSelectAll,
  toggleDeleteModal,
    setCurrentProfileId,
    deleteProfile,
    addProfile,
    updateProfile
  } = useExamplePayrollProfileStore();

  // Local state for managing the add/edit modal
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<PayrollProfile | null>(null);

  // Prepare column definitions
  const columns: ColumnDef<PayrollProfile>[] = [
    {
      header: 'Nom',
      accessorKey: 'name',
      isSortable: true,
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Catégorie',
      accessorKey: 'categoryId',
      cell: (profile) => {
        const category = categories.find(c => c.id === profile.categoryId);
        return category ? category.name : profile.isDefault ? 'Standard' : '';
      },
    },
    {
      header: 'Rubriques',
      accessorKey: 'items',
      cell: (profile) => profile.items.length,
    },
    {
      header: 'Statut',
      accessorKey: 'isDefault',
      cell: (profile) => profile.isDefault ? 'Standard' : 'Personnalisé',
    },
  ];

  // Form sections for the modal
  const getFormSections = useCallback((): FormSection[] => [
    {
      title: "Informations générales",
      fields: [
        {
          name: "name",
          label: "Nom du profil",
          type: "text",
          required: true,
          placeholder: "Ex: Profil Standard, Profil Cadre, etc."
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Description détaillée du profil de paie"
        },
        {
          name: "categoryId",
          label: "Catégorie",
          type: "select",
          options: categories.map(category => ({
            value: category.id,
            label: category.name
          })),
          placeholder: "Sélectionner une catégorie"
        },
        {
          name: "isDefault",
          label: "Profil par défaut",
          type: "checkbox",
        }
      ]
    }
  ], [categories]);

  // Handle row actions
  const handleAdd = () => {
    setCurrentProfile(null);
    setIsEditing(false);
    setShowFormModal(true);
  };
  
  const handleEdit = (profile: PayrollProfile) => {
    setCurrentProfile(profile);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleDelete = (profile: PayrollProfile) => {
    setCurrentProfileId(profile.id);
    toggleDeleteModal(true);
  };

  const handleDuplicate = (profile: PayrollProfile) => {
    const { id, ...rest } = profile;
    useExamplePayrollProfileStore.getState().addProfile({
      ...rest,
      name: `${rest.name} (copie)`,
      isDefault: false,
    });
  };

  // Form submission handler
  const handleFormSubmit = (data: any) => {
    if (isEditing && currentProfile) {
      updateProfile(currentProfile.id, data);
    } else {
      addProfile({
        ...data,
        items: data.items || [] // Ensure items array is initialized
      });
    }
    setShowFormModal(false);
  };

  // Get the currently selected profile for the delete modal
  const selectedProfile = currentProfileId 
    ? profiles.find(p => p.id === currentProfileId) || null
    : null;

  // Contextual actions (when multiple profiles are selected)
  const renderContextualActions = (selectedProfiles: PayrollProfile[]) => {
    return (
      <div className="flex space-x-2">
        <Button
          variant="danger"
          onClick={() => {
            selectedIds.forEach(id => deleteProfile(id));
          }}
          disabled={selectedProfiles.some(p => p.isDefault)}
        >
          Supprimer ({selectedProfiles.length})
        </Button>
      </div>
    );
  };

  return (
    <>
      <GenericListPage
        title="Gestion des profils de paie"
        description="Créez et gérez les profils de paie pour les employés"
        columns={columns}
        data={profiles}
        selectedIds={selectedIds}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onAdd={handleAdd}
        addButtonLabel="Ajouter un profil"
        renderRowActions={(profile) => (
          <PayrollProfileRowActions
            profile={profile}
            onEdit={() => handleEdit(profile)}
            onDelete={() => handleDelete(profile)}
            onDuplicate={() => handleDuplicate(profile)}
          />
        )}
        renderContextualActions={renderContextualActions}
      />

      {/* Add/Edit Modal using GenericFormModal */}
      {showFormModal && (
        <GenericFormModal
          isOpen={showFormModal}
          isEdit={isEditing}
          title="profil de paie"
          entity={currentProfile}
          sections={getFormSections()}
          onClose={() => setShowFormModal(false)}
          onSubmit={handleFormSubmit}
          submitLabel={isEditing ? "Enregistrer les modifications" : "Ajouter le profil"}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProfile && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          profile={selectedProfile}
          onClose={() => toggleDeleteModal(false)}
          onConfirm={() => {
            if (currentProfileId) {
              deleteProfile(currentProfileId);
              toggleDeleteModal(false);
            }
          }}
        />
      )}
    </>
  );
} 