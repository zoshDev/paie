import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Employee {
  id: number;
  name: string;
  poste: string;
  categorie: string;
  echelon: string;
}

// Options pour les filtres et la pagination
export const FILTER_OPTIONS = [
  { value: 'name', label: 'Nom' },
  { value: 'categorie', label: 'Catégorie' },
  { value: 'poste', label: 'Poste' },
];

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 0, label: 'Tous' },
];

// Mock data
const MOCK_EMPLOYEES: Employee[] = Array.from({ length: 100 }, (_, i) => {
  const noms = [
    'Alice Dupont', 'Bob Martin', 'Claire Dubois', 'David Leroy', 'Eva Morel',
    'Fabrice Petit', 'Gilles Bernard', 'Hélène Simon', 'Ismael Girard', 'Julie Lefevre'
  ];
  const postes = [
    'Développeur', 'Designer', 'RH', 'Manager', 'Comptable',
    'Chef de projet', 'Testeur', 'Support', 'Administrateur', 'Analyste'
  ];
  const categories = [
    'IT', 'Créatif', 'RH', 'Direction', 'Finance'
  ];
  const echelons = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return {
    id: i + 1,
    name: noms[i % noms.length] + ' ' + (Math.floor(i / noms.length) + 1),
    poste: postes[i % postes.length],
    categorie: categories[i % categories.length],
    echelon: echelons[i % echelons.length],
  };
});

// Store principal
interface EmployeeStore {
  employees: Employee[];
  setEmployees: (list: Employee[]) => void;

  filterField: string;
  setFilterField: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  echelonFilter: string;
  setEchelonFilter: (v: string) => void;

  page: number;
  setPage: (v: number) => void;
  pageSize: number;
  setPageSize: (v: number) => void;

  selectedIds: number[];
  setSelectedIds: (v: number[]) => void;

  showRubriqueModal: boolean;
  setShowRubriqueModal: (v: boolean) => void;
  rubrique: string;
  setRubrique: (v: string) => void;

  // Actions modales spécifiques employés
  showAddModal: boolean;
  setShowAddModal: (v: boolean) => void;

  // Ajout d'employé
  addEmployee: (employee: Employee) => void;

  // Actions
  handleSelect: (id: number) => void;
  handleSelectAll: (paginated: Employee[]) => void;
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
  handleApplyRubrique: () => void;

  // Constantes
  PAGE_SIZE_OPTIONS: typeof PAGE_SIZE_OPTIONS;
  FILTER_OPTIONS: typeof FILTER_OPTIONS;
}

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: MOCK_EMPLOYEES,
      setEmployees: (list) => set({ employees: list }),

      filterField: 'name',
      setFilterField: (v) => set({ filterField: v }),
      search: '',
      setSearch: (v) => set({ search: v }),
      echelonFilter: '',
      setEchelonFilter: (v) => set({ echelonFilter: v }),

      page: 1,
      setPage: (v) => set({ page: v }),
      pageSize: 20,
      setPageSize: (v) => set({ pageSize: v }),

      selectedIds: [],
      setSelectedIds: (v) => set({ selectedIds: v }),

      showRubriqueModal: false,
      setShowRubriqueModal: (v) => set({ showRubriqueModal: v }),
      rubrique: '',
      setRubrique: (v) => set({ rubrique: v }),

      // Modale d'ajout d'employé
      showAddModal: false,
      setShowAddModal: (v) => set({ showAddModal: v }),

      addEmployee: (employee) => {
        const { employees, setEmployees } = get();
        setEmployees([...employees, employee]);
      },

      // Actions
      handleSelect: (id) => {
        const { selectedIds, setSelectedIds } = get();
        setSelectedIds(
          selectedIds.includes(id)
            ? selectedIds.filter((sid) => sid !== id)
            : [...selectedIds, id]
        );
      },
      handleSelectAll: (paginated) => {
        const { selectedIds, setSelectedIds } = get();
        const idsOnPage = paginated.map((emp) => emp.id);
        if (idsOnPage.every((id) => selectedIds.includes(id))) {
          setSelectedIds(selectedIds.filter((id) => !idsOnPage.includes(id)));
        } else {
          setSelectedIds([...selectedIds, ...idsOnPage.filter((id) => !selectedIds.includes(id))]);
        }
      },
      handleDelete: (id) => {
        const { employees, setEmployees, selectedIds, setSelectedIds } = get();
        setEmployees(employees.filter((emp) => emp.id !== id));
        setSelectedIds(selectedIds.filter((sid) => sid !== id));
      },
      handleEdit: (id) => {
        // À personnaliser selon ta navigation (ex: navigate(`/employes/edit/${id}`))
        alert('Modifier employé id: ' + id);
      },
      handleApplyRubrique: () => {
        const { rubrique, selectedIds, setShowRubriqueModal, setRubrique } = get();
        alert(
          `Rubrique "${rubrique}" appliquée à l'ID(s): ${selectedIds.join(', ')}`
        );
        setShowRubriqueModal(false);
        setRubrique('');
      },

      PAGE_SIZE_OPTIONS,
      FILTER_OPTIONS,
    }),
    { name: 'employee-store' }
  )
);