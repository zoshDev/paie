import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { PayrollItem, PayrollItemFilter } from '../models/payrollItems';

interface PayrollItemState {
  items: PayrollItem[];
  selectedIds: string[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  filter: PayrollItemFilter;
  
  // Pagination and sorting
  page: number;
  pageSize: number;
  sortField: keyof PayrollItem | '';
  sortDirection: 'asc' | 'desc';
  
  // Modal states
  showDeleteModal: boolean;
  currentItemId: string | null;
  
  // Actions
  setSelectedIds: (ids: string[]) => void;
  setFilter: (filter: Partial<PayrollItemFilter>) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSorting: (field: keyof PayrollItem | '', direction: 'asc' | 'desc') => void;
  toggleDeleteModal: (show?: boolean) => void;
  setCurrentItemId: (id: string | null) => void;
  
  // CRUD operations
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<PayrollItem, 'id'>) => Promise<string>;
  updateItem: (id: string, updates: Partial<Omit<PayrollItem, 'id'>>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  
  // Selection helpers
  handleSelect: (id: string) => void;
  handleSelectAll: (items: PayrollItem[]) => void;
  
  // Profile operations
  assignItemsToProfile: (profileId: string, itemIds: string[]) => Promise<void>;
}

// Mock data - will be replaced by API calls
const initialItems: PayrollItem[] = [
  {
    id: '1',
    name: 'Salaire de base',
    description: 'Salaire de base mensuel',
    code: 'BASSAL',
    type: 'earning',
    payer: 'employer',
    calculationMethod: 'fixed',
    amount: 300000,
    isActive: true,
    isDefault: true,
  },
  {
    id: '2',
    name: 'Indemnité de transport',
    description: 'Indemnité de transport mensuelle',
    code: 'TRANS',
    type: 'earning',
    payer: 'employer',
    calculationMethod: 'fixed',
    amount: 25000,
    isActive: true,
    isDefault: true,
  },
  {
    id: '3',
    name: 'Prime de responsabilité',
    description: 'Prime de responsabilité pour les postes à responsabilité',
    code: 'RESP',
    type: 'earning',
    payer: 'employer',
    calculationMethod: 'percentage',
    amount: 0,
    referenceValue: 'BASSAL',
    isActive: true,
    isDefault: false,
  },
  {
    id: '4',
    name: 'CNPS',
    description: 'Cotisation à la Caisse Nationale de Prévoyance Sociale',
    code: 'CNPS',
    type: 'deduction',
    payer: 'both',
    calculationMethod: 'percentage',
    amount: 0,
    referenceValue: 'BASSAL',
    isActive: true,
    isDefault: true,
  },
  {
    id: '5',
    name: 'IRPP',
    description: 'Impôt sur le Revenu des Personnes Physiques',
    code: 'IRPP',
    type: 'deduction',
    payer: 'employee',
    calculationMethod: 'formula',
    amount: 0,
    formula: 'progressive_tax(net_income)',
    isActive: true,
    isDefault: true,
  },
];

export const usePayrollItemStore = create<PayrollItemState>((set, get) => ({
  // State
  items: initialItems,
  selectedIds: [],
  isLoading: false,
  error: null,
  filter: {
    searchQuery: '',
    type: 'all',
    payer: 'all',
    isActive: 'all',
  },
  page: 1,
  pageSize: 10,
  sortField: 'code',
  sortDirection: 'asc',
  showDeleteModal: false,
  currentItemId: null,
  
  // UI actions
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  setFilter: (filter) => set({ 
    filter: { ...get().filter, ...filter },
    page: 1 // Reset to first page when changing filters
  }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  setSorting: (sortField, sortDirection) => set({ sortField, sortDirection }),
  toggleDeleteModal: (show) => set({ 
    showDeleteModal: show !== undefined ? show : !get().showDeleteModal 
  }),
  setCurrentItemId: (id) => set({ currentItemId: id }),
  
  // API and CRUD operations
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      // API endpoint would be defined here
      // const response = await fetch('/api/payroll-items');
      // const data = await response.json();
      // set({ items: data });
      
      // Using mock data for now
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ items: initialItems });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  
  addItem: async (item) => {
    set({ isLoading: true, error: null });
    try {
      // API endpoint would be:
      // const response = await fetch('/api/payroll-items', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(item)
      // });
      // const data = await response.json();
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      const id = uuidv4();
      set((state) => ({
        items: [...state.items, { ...item, id }]
      }));
      return id;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateItem: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // API endpoint would be:
      // await fetch(`/api/payroll-items/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      set((state) => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // API endpoint would be:
      // await fetch(`/api/payroll-items/${id}`, {
      //   method: 'DELETE'
      // });
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      set((state) => ({
        items: state.items.filter(item => item.id !== id),
        selectedIds: state.selectedIds.filter(sid => sid !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Selection helpers
  handleSelect: (id) => {
    const { selectedIds } = get();
    set({
      selectedIds: selectedIds.includes(id)
        ? selectedIds.filter(sid => sid !== id)
        : [...selectedIds, id]
    });
  },
  
  handleSelectAll: (items) => {
    const { selectedIds } = get();
    const allSelected = items.every(item => selectedIds.includes(item.id));
    
    if (allSelected) {
      set({ selectedIds: [] });
    } else {
      const newSelectedIds = items.map(item => item.id);
      set({ selectedIds: newSelectedIds });
    }
  },
  
  // Profile operations
  assignItemsToProfile: async (profileId, itemIds) => {
    set({ isLoading: true, error: null });
    try {
      // API endpoint would be:
      // await fetch(`/api/profiles/${profileId}/items`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ itemIds })
      // });
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`Assigning items ${itemIds.join(', ')} to profile ${profileId}`);
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
})); 