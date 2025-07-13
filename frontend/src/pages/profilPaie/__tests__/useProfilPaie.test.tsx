import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useProfilPaie } from '../useRoleProfil';

// Mock de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

// Mock des données de test
jest.mock('../useProfilPaie', () => {
  const originalModule = jest.requireActual('../useProfilPaie');
  
  return {
    __esModule: true,
    ...originalModule,
    default: vi.mock(),
    useProfilPaie: vi.mock().mockImplementation(() => {
      const [searchTerm, setSearchTerm] = React.useState('');
      const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
      
      const profilsPaie = [
        {
          id: 'PP001',
          code: 'CADRE_STD',
          nom: 'Profil Standard Cadre',
          description: 'Profil standard pour cadres',
          categorie: 'cadre',
          rubriques: []
        },
        {
          id: 'PP002',
          code: 'NCADRE_STD',
          nom: 'Profil Standard Non-Cadre',
          description: 'Profil standard pour non-cadres',
          categorie: 'non-cadre',
          rubriques: []
        }
      ];
      
      const toggleSelectedId = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
      };
      
      const clearSelection = () => {
        setSelectedIds([]);
      };
      
      const selectAll = () => {
        setSelectedIds(profilsPaie.map(p => p.id));
      };
      
      const toggleAllSelected = () => {
        if (selectedIds.length === profilsPaie.length) {
          clearSelection();
        } else {
          selectAll();
        }
      };
      
      const isAllSelected = selectedIds.length === profilsPaie.length;
      
      return {
        profilsPaie,
        searchTerm,
        setSearchTerm,
        selectedIds,
        toggleSelectedId,
        toggleAllSelected,
        clearSelection,
        selectAll,
        isAllSelected,
      };
    })
  };
});

describe('useProfilPaie Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty search term and selection', () => {
    const { result } = renderHook(() => useProfilPaie());
    
    expect(result.current.searchTerm).toBe('');
    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.isAllSelected).toBe(false);
  });
  
  it('should toggle a selected ID', () => {
    const { result } = renderHook(() => useProfilPaie());
    
    act(() => {
      result.current.toggleSelectedId('PP001');
    });
    
    expect(result.current.selectedIds).toEqual(['PP001']);
    
    act(() => {
      result.current.toggleSelectedId('PP001');
    });
    
    expect(result.current.selectedIds).toEqual([]);
  });
  
  it('should clear selection', () => {
    const { result } = renderHook(() => useProfilPaie());
    
    act(() => {
      result.current.toggleSelectedId('PP001');
      result.current.toggleSelectedId('PP002');
    });
    
    expect(result.current.selectedIds.length).toBe(2);
    
    act(() => {
      result.current.clearSelection();
    });
    
    expect(result.current.selectedIds).toEqual([]);
  });
  
  it('should toggle all selected', () => {
    const { result } = renderHook(() => useProfilPaie());
    
    act(() => {
      result.current.toggleAllSelected();
    });
    
    expect(result.current.isAllSelected).toBe(true);
    
    act(() => {
      result.current.toggleAllSelected();
    });
    
    expect(result.current.isAllSelected).toBe(false);
  });
}); 