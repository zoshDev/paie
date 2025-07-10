import { useState } from 'react';
import { useExampleEmployeeStore } from '../../stores/exampleEmployeeStore';
import GenericListPage from '../../components/ui/GenericListPage';
import type { ColumnDef, ActionItem } from '../../components/ui/GenericListPage';
import type { Employee } from '../../stores/exampleEmployeeStore';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/layout/button/Button';

export default function EmployeeListPage() {
  const { 
    employees, 
    handleSelect, 
    handleSelectAll, 
    searchQuery,
    setSearchQuery,
  } = useExampleEmployeeStore();
  
  // Local state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  // Define columns
  const columns: ColumnDef<Employee>[] = [
    {
      header: 'Prénom',
      accessorKey: 'firstName',
      isSortable: true,
    },
    {
      header: 'Nom',
      accessorKey: 'lastName',
      isSortable: true,
    },
    {
      header: 'Email',
      accessorKey: 'email',
      isSortable: true,
    },
    {
      header: 'Poste',
      accessorKey: 'position',
      isSortable: true,
    },
    {
      header: 'Département',
      accessorKey: 'department',
      isSortable: true,
    },
    {
      header: 'Date d\'embauche',
      accessorKey: 'hireDate',
      cell: (employee) => new Date(employee.hireDate).toLocaleDateString(),
      isSortable: true,
    },
  ];

  // Handle actions
  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee);
    setShowEditModal(true);
  };

  const handleDelete = (employee: Employee) => {
    setCurrentEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleView = (employee: Employee) => {
    alert(`Afficher les détails de ${employee.firstName} ${employee.lastName}`);
  };

  // Row actions
  const renderRowActions = (employee: Employee) => (
    <div className="flex justify-end items-center space-x-2">
      <button
        onClick={() => handleView(employee)}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        title="Voir détails"
      >
        <EyeIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleEdit(employee)}
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        title="Modifier"
      >
        <PencilIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleDelete(employee)}
        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
        title="Supprimer"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );

  // Define actions
  const actions: ActionItem[] = [
    {
      id: 'add',
      label: 'Ajouter un employé',
      icon: <PlusIcon className="h-4 w-4" />,
      onClick: () => setShowAddModal(true),
      showInDropdown: true,
    },
    {
      id: 'delete-selected',
      label: 'Supprimer sélection',
      icon: <TrashIcon className="h-4 w-4" />,
      onClick: () => {
        if (confirm(`Voulez-vous supprimer les ${selectedIds.length} employés sélectionnés ?`)) {
          // Handle bulk delete here
          setSelectedIds([]);
        }
      },
      requiredSelection: 'multiple',
      variant: 'danger',
      showInContextual: true,
    }
  ];

  return (
    <>
      <GenericListPage
        title="Gestion des employés"
        description="Liste des employés de l'entreprise"
        columns={columns}
        data={employees}
        selectedIds={selectedIds}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelect={(id) => {
          handleSelect(id);
          setSelectedIds(
            selectedIds.includes(id)
              ? selectedIds.filter(selectedId => selectedId !== id)
              : [...selectedIds, id]
          );
        }}
        onSelectAll={(items) => {
          handleSelectAll(items);
          const allSelected = items.every(item => selectedIds.includes(item.id));
          setSelectedIds(allSelected ? [] : items.map(item => item.id));
        }}
        actions={actions}
        renderRowActions={renderRowActions}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />

      {/* Add modals here when needed */}
    </>
  );
} 