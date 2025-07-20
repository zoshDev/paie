import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import DataTable from '../../components/table/DataTable';
import Menu, { MenuItem } from '../../components/ui/Menu/Menu';
import EntityModals from '../../components/ui/Modal/EntityModal';
import BulkActionsBar from '../../components/ui/BulkActionsBar';
import GenericForm from '../../components/form/GenericForm';

import { employeeColumns } from './columns';
import { employeeFormSections } from '@/schemas/employee/employee.schema';
import {employeService} from '@/services/employeeService';
import useEmployees from './useEmployees';
import toast from 'react-hot-toast';
import type { RawEmployee } from '@/pages/employee/rawEmployee';

import PayrollModal from '@/components/payroll/PayrollModal';
import { BulkLinkerPanel } from '@/utils/BulkLinkerPanel';
import AssignmentModal from '../roleProfilPaie/AssignmentModal';

import {
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChevronDownIcon,
  UserIcon,
  EnvelopeIcon,
  TrashIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon 
} from '@heroicons/react/24/outline';

//import type { Employee } from './types';
import type { FormField } from '../../components/form/types';
//import useCategorieEchelons from '../categorieEchelon/useCategorieEchelons';
import  {contractService } from './contract/contractService';
import { contractFormSections } from './contract/contractFormSections';
import { toEntity } from '@/utils/transformers';

const EmployeesListPage: React.FC = () => {
  const {
    employees,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected
  } = useEmployees();

  // Ouvre la modal de paie
  const [isPayrollModalOpen, setPayrollModalOpen] = useState(false);
  const openPayrollModal = (employee: RawEmployee) => {
  setSelectedEmployee(employee);
  setPayrollModalOpen(true);
  };
 function closePayrollModal() {
  setPayrollModalOpen(false);
  setSelectedEmployee(null);
}


  const [selectedEmployee, setSelectedEmployee] = useState<RawEmployee | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | 'create' | 'bulk-delete' | "paie-actions" | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isAssignmentOpen, setAssignmentOpen] = useState(false);


  const openModal = (employee: RawEmployee | null, mode: typeof modalMode) => {
    setSelectedEmployee(employee);
    setModalMode(mode);
  };


  const closeModal = () => {
    setSelectedEmployee(null);
    setModalMode(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleActions = () => setIsActionsOpen((prev) => !prev);

  const handleAddEmployee = () => {
    openModal(null, 'create');
    setIsActionsOpen(false);
  };

  const openBulkDeleteModal = () => {
    setModalMode('bulk-delete');
    setIsActionsOpen(false);
  };

  const handleImportEmployees = () => {
    alert('Importer des employés');
    setIsActionsOpen(false);
  };

  const handleExportEmployees = () => {
    alert('Exporter des employés');
    setIsActionsOpen(false);
  };

  const employeeFields: FormField[] = [
    { name: 'Nom', label: 'Nom', type: 'text', required: true, icon: <UserIcon className="w-4 h-4" /> },
    { name: 'Email', label: 'Email', type: 'email', icon: <EnvelopeIcon className="w-4 h-4" /> },
    { name: 'Categorie', label: 'Catégorie', type: 'text', required: true }
  ];

  const actions = [
    {
      label: 'Supprimer',
      icon: <TrashIcon className="w-4 h-4" />,
      onClick: openBulkDeleteModal,
      className: 'flex items-center gap-1 px-2 py-1 text-rose-600 hover:text-white hover:bg-rose-600 rounded transition'
    }
  ];

  //Appels aux API externes
  //const { categorieEchelons } = useCategorieEchelons();
  //const { companies } = useCompanies();

  //GESTION ETAT MODAL CONTRAT
  const [selectedContractEmployee, setSelectedContractEmployee] = useState<RawEmployee | null>(null);
  const [contractMode, setContractMode] = useState<"create" | "view" | null>(null);

  const [isBulkLinkerOpen, setBulkLinkerOpen] = useState(false);

  const openContractModal = (emp: RawEmployee) => {
    setSelectedContractEmployee(emp);
    setContractMode("create");
  };

  const closeContractModal = () => {
    setSelectedContractEmployee(null);
    setContractMode(null);
  };

  

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Liste des Employés" 
        description="Gérer les employés de l'entreprise"
      >
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
              <MenuItem onClick={handleAddEmployee} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter un Employé
              </MenuItem>
              <MenuItem onClick={handleImportEmployees} icon={<ArrowDownTrayIcon className="w-5 h-5" />}>
                Importer des Employés
              </MenuItem>
              <MenuItem onClick={handleExportEmployees} icon={<ArrowUpTrayIcon className="w-5 h-5" />}>
                Exporter des Employés
              </MenuItem>
            </Menu>
          </div>
        </div>
      </PageHeader>

      {/* 🔗 Lien pour lier des profils de paie ou des éléments de salaire */}
      
      {selectedEmployee !== null && (
        <BulkLinkerPanel sourceId={selectedEmployee.id} />
      )}

      {selectedIds.length >= 2 && (
        <div className="flex justify-end mb-2">
          <BulkActionsBar
            count={selectedIds.length}
            actions={actions}
            onClearSelection={clearSelection}
          />
        </div>
      )}

      <DataTable<RawEmployee>
        data={employees}
        columns={employeeColumns}
        selectedIds={selectedIds.map(String)}
        onToggleSelectedId={(id) => toggleSelectedId(Number(id))} // ✅ conversion inverse
        onToggleAllSelected={toggleAllSelected}
        isAllSelected={isAllSelected}
        bodyBackgroundIllustration={<div className="text-[120px] text-blue-100">🧑‍💼</div>}
        onClearSelection={clearSelection}
        onView={(emp) => openModal(emp, 'view')}
        onEdit={(emp) => openModal(emp, 'edit')}
        onDelete={(emp) => openModal(emp, 'delete')}
        onBulkDelete={openBulkDeleteModal}
        // ✅ Ajout du bouton Contrat
        extraActions={(employee) => [
          {
            label: "Contrat",
            icon: <DocumentTextIcon className="w-5 h-5 text-blue-600" />,
            onClick: () => openContractModal(employee),
          },
          {
            label: 'Fiche de Paie',
            icon: <ClipboardDocumentListIcon  className="w-5 h-5 text-yellow-500" />,
            onClick: () => openPayrollModal(employee),
          },
          {
            label: "Lier rôles / éléments",
            icon: <DocumentTextIcon className="w-5 h-5 text-purple-600" />,
            onClick: () => {
              setSelectedEmployee(employee);
              setBulkLinkerOpen(true);
            }
          },
          {
            label: "Assignations",
            icon: <ClipboardDocumentListIcon className="w-5 h-5 text-indigo-600" />,
            onClick: () => {
              setSelectedEmployee(employee);
              setAssignmentOpen(true);
            }
          }
        ]}
      />

    {/*Ouverture conditionnelle des modales*/}
    {isPayrollModalOpen && selectedEmployee && (
        <PayrollModal
          isOpen={isPayrollModalOpen}
          onClose={closePayrollModal}
          employee={selectedEmployee}
        />
    )}
      {selectedContractEmployee && contractMode && (
      <EntityModals
        mode={contractMode}
        entity={selectedContractEmployee ? toEntity(selectedContractEmployee) : null}
        selectedIds={selectedIds.map(String)}
        onClose={closeContractModal}
        renderEditForm={(emp) => (
          <GenericForm
            sections={contractFormSections}
            initialData={{
              employeId: emp?.id,
              dateDebut: "",
              dateFin: "",
              typeContrat: "",
              salaireBase: 0,
            }}
            onSubmit={async (values) => {
              try {
                await contractService.create(values);
                const contrats = await contractService.getByEmployeId(emp!.id);
                const contrat = contrats[0]; // On suppose qu'il n'y a qu'un contrat par employé
                toast.success("Contrat enregistré ✅");
                setSelectedContractEmployee({ ...emp!, contrat });
                setContractMode("view");
              } catch (error) {
                toast.error("Erreur lors de l’enregistrement ❌");
                console.error(error);
              }
            }}
            submitLabel="Enregistrer"
          />
        )}
        renderView={(emp) => (
          <div className="space-y-2 text-sm">
            <p><strong>Type :</strong> {emp?.contrat?.typeContrat}</p>
            <p><strong>Date Début :</strong> {emp?.contrat?.dateDebut}</p>
            <p><strong>Date Fin :</strong> {emp?.contrat?.dateFin}</p>
            <p><strong>Salaire :</strong> {emp?.contrat?.salaireBase} FCFA</p>
          </div>
        )}
      />
    )}
    {selectedEmployee && (
      <PayrollModal
        isOpen={isPayrollModalOpen}
        onClose={() => setPayrollModalOpen(false)}
        employee={selectedEmployee}
      />
    )}

    {isBulkLinkerOpen && selectedEmployee && (
      <EntityModals
        mode="view"
        //entity={selectedEmployee}
        entity={selectedEmployee ? toEntity(selectedEmployee) : null}
        selectedIds={[]}
        onClose={() => {
          setSelectedEmployee(null);
          setBulkLinkerOpen(false);
        }}
        renderView={() => (
          <BulkLinkerPanel sourceId={selectedEmployee.id} />
        )}
      />
    )}

    {isAssignmentOpen && selectedEmployee && (
  <AssignmentModal
        employee={selectedEmployee}
        onClose={() => {
          setSelectedEmployee(null);
          setAssignmentOpen(false);
        }}
      />
    )}

      <EntityModals
        selectedIds={selectedIds.map((id) => String(id))}//{selectedIds}
        mode={modalMode}
        //entity={selectedEmployee}
        entity={selectedEmployee ? toEntity(selectedEmployee) : null}
        //={employeeFields}
        onClose={closeModal}
        onDeleteConfirm={(id) => {
          if (modalMode === 'bulk-delete') {
            console.log('Suppression de plusieurs employés :', selectedIds);
            clearSelection();
          } else {
            console.log('Suppression de l’employé :', id);
          }
          closeModal();
        }}
        renderEditForm={(emp) => (
          <GenericForm
            sections={employeeFormSections}
            initialData={emp ?? {}}
            onSubmit={async (values) => {
              try {
                if (modalMode === 'create') {
                  await employeService.create(values);
                  toast.success('Employé créé ✅');
                } else if (emp) {
                  await employeService.update(emp.id, values);
                  toast.success('Employé mis à jour ✨');
                }
                closeModal();
              } catch (err) {
                toast.error('Erreur lors de la soumission ❌');
                console.error(err);
              }
            }}
            backgroundIllustration={<UserIcon className="w-40 h-40 text-indigo-100" />}
            submitLabel={modalMode === 'create' ? 'Créer' : 'Mettre à jour'}
          />
        )}
        renderView={(emp) =>
          modalMode === 'bulk-delete' ? (
            <div>
              <p>Vous êtes sur le point de supprimer <strong>{selectedIds.length}</strong> employés.</p>
              <p className="text-sm text-red-600">Cette action est irréversible.</p>
            </div>
          ) : (
            <div className="space-y-1 text-sm">
              <p><strong>Nom :</strong> {emp?.name}</p>
              <p><strong>Poste :</strong> {emp?.societeId}</p>
              <p><strong>Catégorie :</strong> {emp?.categorieEchelonId}</p>
            </div>
          )
        }
      />
    </div>
  );
};

export default EmployeesListPage;
