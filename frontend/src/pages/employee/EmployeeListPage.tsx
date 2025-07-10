import React, { useMemo } from 'react';
import { useEmployeeStore } from '../../stores/employeeStore';
import { useAppStore } from '../../stores/appStore';
import EmployeeFilterBar from './components/EmployeeFilterBar';
import EmployeeTable from './components/EmployeeTable';
import EmployeePagination from './components/EmployeePagination';
import RubriqueModal from './components/RubriqueModal';
import ConfirmModal from '../../components/ui/ConfirmModal/ConfirmModal';
import AddEmployeeModal from './components/AddEmployeeModal';

export const EmployeeListPage: React.FC = () => {
  const {
    employees,
    setEmployees,
    filterField,
    setFilterField,
    search,
    setSearch,
    echelonFilter,
    setEchelonFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    selectedIds,
    showRubriqueModal,
    setShowRubriqueModal,
    rubrique,
    setRubrique,
    handleSelect,
    handleSelectAll,
    handleDelete,
    handleEdit,
    handleApplyRubrique,
    PAGE_SIZE_OPTIONS,
    FILTER_OPTIONS,
    showAddModal,
    setShowAddModal,
    addEmployee,
  } = useEmployeeStore();

  const { confirmModal, closeConfirmModal } = useAppStore();

  const filtered = useMemo(() => {
    let list = employees;
    if (filterField === 'categorie') {
      list = list.filter((emp) =>
        emp.categorie.toLowerCase().includes(search.toLowerCase())
      );
      if (echelonFilter) {
        list = list.filter((emp) =>
          emp.echelon.toLowerCase().includes(echelonFilter.toLowerCase())
        );
      }
    } else {
      list = list.filter((emp) => {
        const value = (emp as any)[filterField]?.toLowerCase() ?? '';
        return value.includes(search.toLowerCase());
      });
    }
    return list;
  }, [employees, filterField, search, echelonFilter]);

  const paginated = useMemo(() => {
    if (pageSize === 0) return filtered;
    return filtered.slice((page - 1) * pageSize, page * pageSize);
  }, [filtered, page, pageSize]);

  const totalPages = useMemo(() => {
    if (pageSize === 0) return 1;
    return Math.ceil(filtered.length / pageSize) || 1;
  }, [filtered, pageSize]);

  React.useEffect(() => {
    if (employees.length === 0) setEmployees(employees);
  }, [employees, setEmployees]);

  // Handlers pour import/export (à compléter selon ta logique)
  const handleImport = () => {
    alert('Import Excel non implémenté');
  };

  const handleExport = () => {
    alert('Export Excel non implémenté');
  };

  return (
    <div className="flex flex-col gap-4">
      <EmployeeFilterBar
        filterField={filterField}
        setFilterField={setFilterField}
        search={search}
        setSearch={setSearch}
        echelonFilter={echelonFilter}
        setEchelonFilter={setEchelonFilter}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setPage={setPage}
        selectedIds={selectedIds}
        setShowRubriqueModal={setShowRubriqueModal}
        PAGE_SIZE_OPTIONS={PAGE_SIZE_OPTIONS}
        FILTER_OPTIONS={FILTER_OPTIONS}
        onAdd={() => setShowAddModal(true)}
        onImport={handleImport}
        onExport={handleExport}
      />

      <hr className="border-t border-gray-300 dark:border-gray-700 my-2" />

      {showRubriqueModal && (
        <RubriqueModal
          rubrique={rubrique}
          setRubrique={setRubrique}
          setShowRubriqueModal={setShowRubriqueModal}
          handleApplyRubrique={handleApplyRubrique}
        />
      )}

      <EmployeeTable
        paginated={paginated}
        selectedIds={selectedIds}
        handleSelect={handleSelect}
        handleSelectAll={() => handleSelectAll(paginated)}
        handleEdit={handleEdit}
        handleDelete={(id) => {
          useAppStore.getState().showConfirmModal({
            title: 'Confirmer la suppression',
            message: 'Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.',
            confirmLabel: 'Supprimer',
            cancelLabel: 'Annuler',
            confirmColor: 'bg-red-600 hover:bg-red-700',
            onConfirm: () => handleDelete(id),
          });
        }}
      />

      {pageSize !== 0 && (
        <EmployeePagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}

      <AddEmployeeModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(data : any) => {
          addEmployee({
            id: employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1,
            ...data,
          });
          setShowAddModal(false);
        }}
      />

      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        cancelLabel={confirmModal.cancelLabel}
        confirmColor={confirmModal.confirmColor}
        onClose={closeConfirmModal}
        onConfirm={() => {
          if (confirmModal.onConfirm) confirmModal.onConfirm();
          closeConfirmModal();
        }}
      />
    </div>
  );
};

export default EmployeeListPage;