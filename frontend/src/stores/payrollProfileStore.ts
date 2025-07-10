import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  PayrollProfile as OriginalPayrollProfile, 
  PayrollItem as OriginalPayrollItem, 
  PayrollProfileItem,
  EmployeeCategory
} from '../interfaces/payroll';
import { v4 as uuidv4 } from 'uuid';
import type { EmployeePayrollProfile } from '../models/payrollProfiles';

// Options pour les filtres et la pagination
export const FILTER_OPTIONS = [
  { value: 'name', label: 'Nom' },
  { value: 'categoryId', label: 'Catégorie' },
];

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 0, label: 'Tous' },
];

// Données mock pour les rubriques de paie
const MOCK_PAYROLL_ITEMS: OriginalPayrollItem[] = [
  {
    id: 1,
    code: 'SALBASE',
    name: 'Salaire de base',
    type: 'gain',
    calculation: 'fixed',
    value: 0,
    taxable: true,
    active: true,
    order: 1
  },
  {
    id: 2,
    code: 'PRIME_ANC',
    name: 'Prime d\'ancienneté',
    type: 'gain',
    calculation: 'percentage(SALBASE)',
    value: 0.05,
    taxable: true,
    active: true,
    order: 2
  },
  {
    id: 3,
    code: 'TRSPRT',
    name: 'Indemnité de transport',
    type: 'gain',
    calculation: 'fixed',
    value: 50000,
    taxable: false,
    active: true,
    order: 3
  },
  {
    id: 4,
    code: 'CNPS',
    name: 'Cotisation CNPS',
    type: 'cotisation',
    calculation: 'percentage(SALBASE)',
    value: 0.035,
    taxable: false,
    active: true,
    order: 4
  },
  {
    id: 5,
    code: 'IRPP',
    name: 'Impôt sur le revenu',
    type: 'deduction',
    calculation: 'tax_table(taxable_income)',
    value: 0,
    taxable: false,
    active: true,
    order: 5
  }
];

// Données mock pour les catégories d'employés
const MOCK_CATEGORIES: EmployeeCategory[] = [
  {
    id: 1,
    code: 'CAD',
    name: 'Cadre',
    description: 'Personnel cadre',
    defaultProfileId: 1
  },
  {
    id: 2,
    code: 'AM',
    name: 'Agent de maîtrise',
    description: 'Personnel intermédiaire',
    defaultProfileId: 2
  },
  {
    id: 3,
    code: 'OUV',
    name: 'Ouvrier',
    description: 'Personnel d\'exécution',
    defaultProfileId: 3
  }
];

// Données mock pour les profils de paie
const MOCK_PROFILES: OriginalPayrollProfile[] = [
  {
    id: 1,
    name: 'Profil Cadre',
    description: 'Profil standard pour les cadres',
    categoryId: 1,
    isDefault: true,
    items: [
      { id: 1, profileId: 1, payrollItemId: 1, enabled: true },
      { id: 2, profileId: 1, payrollItemId: 2, value: 0.1, enabled: true },
      { id: 3, profileId: 1, payrollItemId: 3, enabled: true },
      { id: 4, profileId: 1, payrollItemId: 4, enabled: true },
      { id: 5, profileId: 1, payrollItemId: 5, enabled: true }
    ]
  },
  {
    id: 2,
    name: 'Profil Agent de maîtrise',
    description: 'Profil standard pour les agents de maîtrise',
    categoryId: 2,
    isDefault: true,
    items: [
      { id: 6, profileId: 2, payrollItemId: 1, enabled: true },
      { id: 7, profileId: 2, payrollItemId: 2, value: 0.07, enabled: true },
      { id: 8, profileId: 2, payrollItemId: 3, enabled: true },
      { id: 9, profileId: 2, payrollItemId: 4, enabled: true },
      { id: 10, profileId: 2, payrollItemId: 5, enabled: true }
    ]
  },
  {
    id: 3,
    name: 'Profil Ouvrier',
    description: 'Profil standard pour les ouvriers',
    categoryId: 3,
    isDefault: true,
    items: [
      { id: 11, profileId: 3, payrollItemId: 1, enabled: true },
      { id: 12, profileId: 3, payrollItemId: 2, value: 0.05, enabled: true },
      { id: 13, profileId: 3, payrollItemId: 3, enabled: true },
      { id: 14, profileId: 3, payrollItemId: 4, enabled: true },
      { id: 15, profileId: 3, payrollItemId: 5, enabled: true }
    ]
  }
];

// Interface du store
interface PayrollProfileState {
  profiles: OriginalPayrollProfile[];
  employeeProfiles: EmployeePayrollProfile[];
  categories: { id: string; name: string }[];
  
  // État de la page de liste
  filterField: string;
  setFilterField: (field: string) => void;
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  
  // Sélection
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  
  // Modales
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  currentProfileId: number | null;
  setCurrentProfileId: (id: number | null) => void;
  
  // Actions
  addProfile: (profile: Omit<OriginalPayrollProfile, 'id'>) => number;
  updateProfile: (id: number, updates: Partial<Omit<OriginalPayrollProfile, 'id'>>) => void;
  deleteProfile: (id: number) => void;
  getProfileById: (id: number) => OriginalPayrollProfile | undefined;
  getProfilesByCategory: (categoryId: number) => OriginalPayrollProfile[];
  getCategoryById: (id: number) => EmployeeCategory | undefined;
  
  // Item management
  addItemToProfile: (profileId: number, item: Omit<PayrollProfileItem, 'id' | 'profileId'>) => number;
  updateItemInProfile: (profileId: number, itemId: number, updates: Partial<PayrollProfileItem>) => void;
  removeItemFromProfile: (profileId: number, itemId: number) => void;
  
  // Employee profile management
  assignProfileToEmployees: (profileId: string, employeeIds: string[]) => void;
  customizeEmployeeProfile: (employeeId: string, profileId: string, customizations: EmployeePayrollProfile['customizations']) => void;
  
  // Gestion de l'état de la sélection
  handleSelect: (id: number) => void;
  handleSelectAll: (profiles: OriginalPayrollProfile[]) => void;
  
  // Constantes
  PAGE_SIZE_OPTIONS: typeof PAGE_SIZE_OPTIONS;
  FILTER_OPTIONS: typeof FILTER_OPTIONS;
}

// Création du store
export const usePayrollProfileStore = create<PayrollProfileState>()(
  persist(
    (set, get) => ({
      profiles: MOCK_PROFILES,
      employeeProfiles: [],
      categories: MOCK_CATEGORIES.map(c => ({ id: c.code, name: c.name })),
      
      // État de la page de liste
      filterField: 'name',
      setFilterField: (field) => set({ filterField: field }),
      search: '',
      setSearch: (search) => set({ search }),
      page: 1,
      setPage: (page) => set({ page }),
      pageSize: 10,
      setPageSize: (pageSize) => set({ pageSize }),
      
      // Sélection
      selectedIds: [],
      setSelectedIds: (selectedIds) => set({ selectedIds }),
      
      // Modales
      showAddModal: false,
      setShowAddModal: (showAddModal) => set({ showAddModal }),
      showEditModal: false,
      setShowEditModal: (showEditModal) => set({ showEditModal }),
      currentProfileId: null,
      setCurrentProfileId: (currentProfileId) => set({ currentProfileId }),
      
      // Actions
      addProfile: (profile) => {
        const { profiles } = get();
        const id = profiles.length > 0 ? Math.max(...profiles.map(p => p.id)) + 1 : 1;
        const newProfile: OriginalPayrollProfile = {
          ...profile,
          id,
          items: [],
        };
        set({ profiles: [...profiles, newProfile] });
        return id;
      },
      
      updateProfile: (id, updates) => {
        const { profiles } = get();
        set({
          profiles: profiles.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        });
      },
      
      deleteProfile: (id) => {
        set((state) => ({
          profiles: state.profiles.filter(profile => profile.id !== id),
          employeeProfiles: state.employeeProfiles.filter(ep => Number(ep.profileId) !== id)
        }));
      },
      
      getProfileById: (id) => {
        return get().profiles.find(p => p.id === id);
      },
      
      getProfilesByCategory: (categoryId) => {
        return get().profiles.filter(p => p.categoryId === categoryId);
      },
      
      getCategoryById: (id) => {
        return MOCK_CATEGORIES.find(c => c.id === id);
      },
      
      // Item management
      addItemToProfile: (profileId, itemData) => {
        const { profiles } = get();
        const profile = profiles.find(p => p.id === profileId);
        if (!profile) return 0;
        
        const itemId = profile.items.length > 0 
          ? Math.max(...profile.items.map(i => i.id)) + 1 
          : 1;
        
        const newItem: PayrollProfileItem = {
          id: itemId,
          profileId,
          ...itemData
        };
        
        set({
          profiles: profiles.map(p => 
            p.id === profileId 
              ? { ...p, items: [...p.items, newItem] } 
              : p
          )
        });
        
        return itemId;
      },
      
      updateItemInProfile: (profileId, itemId, updates) => {
        const { profiles } = get();
        set({
          profiles: profiles.map(p => 
            p.id === profileId 
              ? { 
                  ...p, 
                  items: p.items.map(i => 
                    i.id === itemId ? { ...i, ...updates } : i
                  ) 
                } 
              : p
          )
        });
      },
      
      removeItemFromProfile: (profileId, itemId) => {
        const { profiles } = get();
        set({
          profiles: profiles.map(p => 
            p.id === profileId 
              ? { ...p, items: p.items.filter(i => i.id !== itemId) } 
              : p
          )
        });
      },
      
      // Employee profile management
      assignProfileToEmployees: (profileId, employeeIds) => {
        set((state) => {
          // Get existing assignments
          const existingAssignments = new Set(
            state.employeeProfiles.map(ep => ep.employeeId)
          );
          
          // Create new assignments for employees that don't already have a profile
          const newAssignments = employeeIds
            .filter(id => !existingAssignments.has(id))
            .map(employeeId => ({
              employeeId,
              profileId,
              customizations: []
            }));
          
          // Update existing assignments
          const updatedAssignments = state.employeeProfiles.map(ep => 
            employeeIds.includes(ep.employeeId)
              ? { ...ep, profileId }
              : ep
          );
          
          return {
            employeeProfiles: [...updatedAssignments, ...newAssignments]
          };
        });
      },
      
      customizeEmployeeProfile: (employeeId, profileId, customizations) => {
        set((state) => {
          const existingProfile = state.employeeProfiles.find(
            ep => ep.employeeId === employeeId && ep.profileId === profileId
          );
          
          if (existingProfile) {
            // Update existing profile
            return {
              employeeProfiles: state.employeeProfiles.map(ep => 
                ep.employeeId === employeeId && ep.profileId === profileId
                  ? { ...ep, customizations }
                  : ep
              )
            };
          } else {
            // Create new profile
            return {
              employeeProfiles: [
                ...state.employeeProfiles,
                { employeeId, profileId, customizations }
              ]
            };
          }
        });
      },
      
      // Gestion de l'état de la sélection
      handleSelect: (id) => {
        const { selectedIds } = get();
        set({
          selectedIds: selectedIds.includes(id)
            ? selectedIds.filter(sid => sid !== id)
            : [...selectedIds, id]
        });
      },
      
      handleSelectAll: (profiles) => {
        const { selectedIds } = get();
        const idsOnPage = profiles.map(p => p.id);
        if (idsOnPage.every(id => selectedIds.includes(id))) {
          set({
            selectedIds: selectedIds.filter(id => !idsOnPage.includes(id))
          });
        } else {
          set({
            selectedIds: [...selectedIds, ...idsOnPage.filter(id => !selectedIds.includes(id))]
          });
        }
      },
      
      // Constantes
      PAGE_SIZE_OPTIONS,
      FILTER_OPTIONS,
    }),
    { name: 'payroll-profile-store' }
  )
); 