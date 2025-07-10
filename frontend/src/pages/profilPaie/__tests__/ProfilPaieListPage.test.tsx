import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProfilPaieListPage from '../ProfilPaieListPage';

// Mock le hook useProfilPaie
jest.mock('../useProfilPaie', () => ({
  __esModule: true,
  default: () => ({
    profilsPaie: [
      {
        id: 'PP001',
        code: 'CADRE_STD',
        nom: 'Profil Standard Cadre',
        description: 'Profil pour cadres',
        categorie: 'cadre',
        rubriques: [
          {
            rubriqueId: 'RB001',
            code: 'SB',
            nom: 'Salaire de Base',
            type: 'salaire',
            ordre: 1
          }
        ]
      },
      {
        id: 'PP002',
        code: 'NCADRE_STD',
        nom: 'Profil Standard Non-Cadre',
        description: 'Profil pour non-cadres',
        categorie: 'non-cadre',
        rubriques: []
      }
    ],
    searchTerm: '',
    setSearchTerm: vi.mock(),
    selectedIds: [],
    toggleSelectedId: vi.mock(),
    toggleAllSelected: vi.mock(),
    clearSelection: vi.mock(),
    isAllSelected: false
  })
}));

// Mock le composant EntityModals
jest.mock('../../../components/ui/Modal/EntityModal', () => {
  return {
    __esModule: true,
    default: ({ mode, entity, onClose }: any) => (
      <div data-testid="entity-modal" data-mode={mode} data-entity-id={entity?.id}>
        {mode && (
          <>
            <div>Mode: {mode}</div>
            <button onClick={onClose}>Fermer</button>
          </>
        )}
      </div>
    )
  };
});

// Mock pour React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('ProfilPaieListPage Component', () => {
  const setup = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ProfilPaieListPage />
      </QueryClientProvider>
    );
  };

  it('renders the page with title and search input', () => {
    setup();
    expect(screen.getByText('Liste des Profils de Paie')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Rechercher...')).toBeInTheDocument();
  });

  it('renders the data table with profils', () => {
    setup();
    expect(screen.getByText('CADRE_STD')).toBeInTheDocument();
    expect(screen.getByText('NCADRE_STD')).toBeInTheDocument();
    expect(screen.getByText('Profil Standard Cadre')).toBeInTheDocument();
    expect(screen.getByText('Profil Standard Non-Cadre')).toBeInTheDocument();
  });

  it('opens the action menu when clicking on Actions button', () => {
    setup();
    const actionsButton = screen.getByText('Actions');
    fireEvent.click(actionsButton);
    
    expect(screen.getByText('Ajouter un Profil')).toBeInTheDocument();
    expect(screen.getByText('Importer')).toBeInTheDocument();
    expect(screen.getByText('Exporter')).toBeInTheDocument();
  });

  it('opens create modal when clicking on Ajouter un Profil', () => {
    setup();
    
    // Ouvrir le menu d'actions
    fireEvent.click(screen.getByText('Actions'));
    
    // Cliquer sur Ajouter un Profil
    fireEvent.click(screen.getByText('Ajouter un Profil'));
    
    // Vérifier que la modale est ouverte en mode création
    const modal = screen.getByTestId('entity-modal');
    expect(modal.getAttribute('data-mode')).toBe('create');
  });

  it('opens view modal when clicking on view icon', () => {
    setup();
    
    // Cliquer sur l'icône de visualisation (première ligne)
    const viewButtons = screen.getAllByRole('button');
    const viewButton = viewButtons.find(btn => btn.innerHTML.includes('EyeIcon'));
    fireEvent.click(viewButton!);
    
    // Vérifier que la modale est ouverte en mode visualisation
    const modal = screen.getByTestId('entity-modal');
    expect(modal.getAttribute('data-mode')).toBe('view');
    expect(modal.getAttribute('data-entity-id')).toBe('PP001');
  });
}); 