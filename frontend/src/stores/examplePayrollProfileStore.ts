import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { PayrollProfile, PayrollItem, EmployeePayrollProfile } from '../models/payrollProfiles';

interface PayrollProfileState {
  profiles: PayrollProfile[];
  categories: { id: string; name: string }[];
  employeeProfiles: EmployeePayrollProfile[];
  selectedIds: string[];
  searchQuery: string;
  isLoading: boolean;
  showDeleteModal: boolean;
  currentProfileId: string | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  handleSelect: (id: string) => void;
  handleSelectAll: () => void;
  toggleDeleteModal: (show?: boolean) => void;
  setCurrentProfileId: (id: string | null) => void;
  
  // CRUD operations
  addProfile: (profile: Omit<PayrollProfile, 'id'>) => string;
  updateProfile: (id: string, updates: Partial<Omit<PayrollProfile, 'id'>>) => void;
  deleteProfile: (id: string) => void;
  
  // Item management
  addItemToProfile: (profileId: string, item: Omit<PayrollItem, 'id'>) => string;
  updateProfileItem: (profileId: string, itemId: string, updates: Partial<Omit<PayrollItem, 'id'>>) => void;
  removeItemFromProfile: (profileId: string, itemId: string) => void;
  
  // Employee profile management
  assignProfileToEmployee: (employeeId: string, profileId: string) => void;
  customizeEmployeeProfile: (employeeId: string, profileId: string, customizations: EmployeePayrollProfile['customizations']) => void;
}

// Mock data
const initialCategories = [
  { id: 'cat1', name: 'Cadres' },
  { id: 'cat2', name: 'Agents de maîtrise' },
  { id: 'cat3', name: 'Employés' },
];

const initialProfiles: PayrollProfile[] = [
  {
    id: 'prof1',
    name: 'Profil standard',
    description: 'Profil de paie par défaut pour tous les employés',
    isDefault: true,
    items: [
      {
        id: 'item1',
        name: 'Salaire de base',
        code: 'BASSAL',
        amount: 300000,
        type: 'earning',
        isDefault: true,
      },
      {
        id: 'item2',
        name: 'Indemnité de transport',
        code: 'TRANS',
        amount: 25000,
        type: 'earning',
        isDefault: true,
      },
      {
        id: 'item3',
        name: 'CNPS',
        code: 'CNPS',
        amount: -8400,
        type: 'deduction',
        isDefault: true,
      }
    ]
  },
  {
    id: 'prof2',
    name: 'Profil cadres',
    description: 'Profil de paie pour les employés cadres',
    isDefault: false,
    categoryId: 'cat1',
    items: [
      {
        id: 'item1',
        name: 'Salaire de base',
        code: 'BASSAL',
        amount: 500000,
        type: 'earning',
        isDefault: true,
      },
      {
        id: 'item2',
        name: 'Indemnité de transport',
        code: 'TRANS',
        amount: 35000,
        type: 'earning',
        isDefault: true,
      },
      {
        id: 'item3',
        name: 'Prime de responsabilité',
        code: 'RESP',
        amount: 50000,
        type: 'earning',
        isDefault: false,
      },
      {
        id: 'item4',
        name: 'CNPS',
        code: 'CNPS',
        amount: -14000,
        type: 'deduction',
        isDefault: true,
      }
    ]
  }
];

const initialEmployeeProfiles: EmployeePayrollProfile[] = [
  {
    employeeId: 'emp1',
    profileId: 'prof1',
  },
  {
    employeeId: 'emp2',
    profileId: 'prof2',
    customizations: [
      {
        itemId: 'item3',
        amount: 75000,
      }
    ]
  }
];

export const useExamplePayrollProfileStore = create<PayrollProfileState>((set, get) => ({
  // State
  profiles: initialProfiles,
  categories: initialCategories,
  employeeProfiles: initialEmployeeProfiles,
  selectedIds: [],
  searchQuery: '',
  isLoading: false,
  showDeleteModal: false,
  currentProfileId: null,
  
  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  handleSelect: (id) => {
    set((state) => {
      const selectedIds = [...state.selectedIds];
      if (selectedIds.includes(id)) {
        return { selectedIds: selectedIds.filter(i => i !== id) };
      } else {
        return { selectedIds: [...selectedIds, id] };
      }
    });
  },
  
  handleSelectAll: () => {
    set((state) => {
      if (state.selectedIds.length === state.profiles.length) {
        return { selectedIds: [] };
      } else {
        return { selectedIds: state.profiles.map(p => p.id) };
      }
    });
  },
  
  toggleDeleteModal: (show) => set({ 
    showDeleteModal: show !== undefined ? show : !get().showDeleteModal 
  }),
  
  setCurrentProfileId: (id) => set({ currentProfileId: id }),
  
  // CRUD operations
  addProfile: (profileData) => {
    const id = uuidv4();
    const newProfile: PayrollProfile = {
      id,
      ...profileData,
      items: profileData.items || []
    };
    
    set((state) => ({
      profiles: [...state.profiles, newProfile]
    }));
    
    return id;
  },
  
  updateProfile: (id, updates) => {
    set((state) => ({
      profiles: state.profiles.map(profile => 
        profile.id === id 
          ? { ...profile, ...updates } 
          : profile
      )
    }));
  },
  
  deleteProfile: (id) => {
    set((state) => {
      // Don't allow deletion of default profiles
      const profileToDelete = state.profiles.find(p => p.id === id);
      if (profileToDelete?.isDefault) {
        return state;
      }
      
      return {
        profiles: state.profiles.filter(p => p.id !== id),
        // Also remove any employee associations with this profile
        employeeProfiles: state.employeeProfiles.filter(ep => ep.profileId !== id),
        selectedIds: state.selectedIds.filter(selectedId => selectedId !== id)
      };
    });
  },
  
  // Item management
  addItemToProfile: (profileId, itemData) => {
    const itemId = uuidv4();
    
    set((state) => ({
      profiles: state.profiles.map(profile => 
        profile.id === profileId 
          ? {
              ...profile,
              items: [...profile.items, { id: itemId, ...itemData }]
            }
          : profile
      )
    }));
    
    return itemId;
  },
  
  updateProfileItem: (profileId, itemId, updates) => {
    set((state) => ({
      profiles: state.profiles.map(profile => 
        profile.id === profileId 
          ? {
              ...profile,
              items: profile.items.map(item => 
                item.id === itemId 
                  ? { ...item, ...updates }
                  : item
              )
            }
          : profile
      )
    }));
  },
  
  removeItemFromProfile: (profileId, itemId) => {
    set((state) => ({
      profiles: state.profiles.map(profile => 
        profile.id === profileId 
          ? {
              ...profile,
              items: profile.items.filter(item => item.id !== itemId)
            }
          : profile
      )
    }));
  },
  
  // Employee profile management
  assignProfileToEmployee: (employeeId, profileId) => {
    set((state) => {
      const existingIndex = state.employeeProfiles.findIndex(
        ep => ep.employeeId === employeeId
      );
      
      if (existingIndex !== -1) {
        // Update existing association
        const newEmployeeProfiles = [...state.employeeProfiles];
        newEmployeeProfiles[existingIndex] = {
          ...newEmployeeProfiles[existingIndex],
          profileId
        };
        return { employeeProfiles: newEmployeeProfiles };
      } else {
        // Create new association
        return {
          employeeProfiles: [
            ...state.employeeProfiles,
            { employeeId, profileId }
          ]
        };
      }
    });
  },
  
  customizeEmployeeProfile: (employeeId, profileId, customizations) => {
    set((state) => {
      const existingIndex = state.employeeProfiles.findIndex(
        ep => ep.employeeId === employeeId && ep.profileId === profileId
      );
      
      if (existingIndex !== -1) {
        // Update existing customization
        const newEmployeeProfiles = [...state.employeeProfiles];
        newEmployeeProfiles[existingIndex] = {
          ...newEmployeeProfiles[existingIndex],
          customizations
        };
        return { employeeProfiles: newEmployeeProfiles };
      }
      
      return state;
    });
  }
})); 