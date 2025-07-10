import { create } from 'zustand';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  categoryId?: string;
  hireDate: string;
}

interface EmployeeState {
  employees: Employee[];
  selectedIds: string[];
  isLoading: boolean;
  searchQuery: string;
  
  // Actions
  setSearchQuery: (query: string) => void;
  handleSelect: (id: string) => void;
  handleSelectAll: (employees: Employee[]) => void;
}

// Mock data
const initialEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    position: 'Directeur Financier',
    department: 'Finance',
    categoryId: 'cat1',
    hireDate: '2018-03-15'
  },
  {
    id: '2',
    firstName: 'Marie',
    lastName: 'Laurent',
    email: 'marie.laurent@example.com',
    position: 'Responsable RH',
    department: 'Ressources Humaines',
    categoryId: 'cat1',
    hireDate: '2019-06-22'
  },
  {
    id: '3',
    firstName: 'Pierre',
    lastName: 'Martin',
    email: 'pierre.martin@example.com',
    position: 'Comptable',
    department: 'Finance',
    categoryId: 'cat2',
    hireDate: '2020-01-10'
  },
  {
    id: '4',
    firstName: 'Sophie',
    lastName: 'Dubois',
    email: 'sophie.dubois@example.com',
    position: 'Assistante administrative',
    department: 'Administration',
    categoryId: 'cat3',
    hireDate: '2021-04-05'
  },
  {
    id: '5',
    firstName: 'Thomas',
    lastName: 'Bernard',
    email: 'thomas.bernard@example.com',
    position: 'Développeur',
    department: 'IT',
    categoryId: 'cat2',
    hireDate: '2019-11-18'
  },
  {
    id: '6',
    firstName: 'Léa',
    lastName: 'Moreau',
    email: 'lea.moreau@example.com',
    position: 'Designer UI/UX',
    department: 'IT',
    categoryId: 'cat2',
    hireDate: '2020-08-03'
  },
  {
    id: '7',
    firstName: 'Antoine',
    lastName: 'Richard',
    email: 'antoine.richard@example.com',
    position: 'Chef de projet',
    department: 'IT',
    categoryId: 'cat1',
    hireDate: '2017-05-12'
  },
  {
    id: '8',
    firstName: 'Camille',
    lastName: 'Robert',
    email: 'camille.robert@example.com',
    position: 'Responsable Marketing',
    department: 'Marketing',
    categoryId: 'cat1',
    hireDate: '2018-09-23'
  },
  {
    id: '9',
    firstName: 'Lucas',
    lastName: 'Petit',
    email: 'lucas.petit@example.com',
    position: 'Technicien Support',
    department: 'IT',
    categoryId: 'cat3',
    hireDate: '2021-02-15'
  },
  {
    id: '10',
    firstName: 'Emma',
    lastName: 'Simon',
    email: 'emma.simon@example.com',
    position: 'Chargée de Communication',
    department: 'Marketing',
    categoryId: 'cat2',
    hireDate: '2019-10-08'
  },
  {
    id: '11',
    firstName: 'Hugo',
    lastName: 'Lefebvre',
    email: 'hugo.lefebvre@example.com',
    position: 'Analyste Financier',
    department: 'Finance',
    categoryId: 'cat2',
    hireDate: '2020-06-17'
  },
  {
    id: '12',
    firstName: 'Chloé',
    lastName: 'Michel',
    email: 'chloe.michel@example.com',
    position: 'Assistante RH',
    department: 'Ressources Humaines',
    categoryId: 'cat3',
    hireDate: '2021-07-20'
  },
  {
    id: '13',
    firstName: 'Louis',
    lastName: 'Garcia',
    email: 'louis.garcia@example.com',
    position: 'Ingénieur Logiciel',
    department: 'IT',
    categoryId: 'cat2',
    hireDate: '2018-11-05'
  },
  {
    id: '14',
    firstName: 'Inès',
    lastName: 'Roux',
    email: 'ines.roux@example.com',
    position: 'Responsable Commercial',
    department: 'Ventes',
    categoryId: 'cat1',
    hireDate: '2017-12-11'
  },
  {
    id: '15',
    firstName: 'Gabriel',
    lastName: 'Fournier',
    email: 'gabriel.fournier@example.com',
    position: 'Stagiaire Marketing',
    department: 'Marketing',
    categoryId: 'cat3',
    hireDate: '2022-01-05'
  }
];

export const useExampleEmployeeStore = create<EmployeeState>((set, get) => ({
  // State
  employees: initialEmployees,
  selectedIds: [],
  isLoading: false,
  searchQuery: '',
  
  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  handleSelect: (id) => {
    const { selectedIds } = get();
    set({
      selectedIds: selectedIds.includes(id)
        ? selectedIds.filter(sid => sid !== id)
        : [...selectedIds, id]
    });
  },
  
  handleSelectAll: (employees) => {
    const { selectedIds } = get();
    const allSelected = employees.every(e => selectedIds.includes(e.id));
    
    if (allSelected) {
      set({ selectedIds: [] });
    } else {
      const newSelectedIds = employees.map(e => e.id);
      set({ selectedIds: newSelectedIds });
    }
  }
})); 