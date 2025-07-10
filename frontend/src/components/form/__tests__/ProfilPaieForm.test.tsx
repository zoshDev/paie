import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProfilPaieForm from '../ProfilPaieForm';
import type { ProfilPaie } from '../../../pages/profilPaie/types';

// Mock pour RubriqueSelector
jest.mock('../RubriqueSelector', () => {
  return {
    __esModule: true,
    default: ({ selectedRubriques, onChange }: any) => (
      <div data-testid="rubrique-selector">
        <div>Rubriques: {selectedRubriques.length}</div>
        <button 
          onClick={() => onChange([...selectedRubriques, { 
            rubriqueId: 'RB-TEST', 
            code: 'TEST', 
            nom: 'Test Rubrique', 
            type: 'gain',
            ordre: 1 
          }])}
        >
          Ajouter une rubrique de test
        </button>
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

describe('ProfilPaieForm Component', () => {
  const mockInitialData: Partial<ProfilPaie> = {
    code: 'PP-TEST',
    nom: 'Test Profil',
    categorie: 'cadre',
    description: 'Description du profil de test',
    rubriques: [
      {
        rubriqueId: 'RB001',
        code: 'SB',
        nom: 'Salaire de Base',
        type: 'salaire',
        ordre: 1
      }
    ]
  };

  const mockOnSubmit = vi.mock();

  const setup = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ProfilPaieForm
          initialData={mockInitialData}
          onSubmit={mockOnSubmit}
          {...props}
        />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with initial values', () => {
    setup();
    
    // Vérifier les valeurs initiales des champs
    expect(screen.getByDisplayValue('PP-TEST')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Profil')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Description du profil de test')).toBeInTheDocument();
    
    // Vérifier la présence du sélecteur de rubriques
    expect(screen.getByTestId('rubrique-selector')).toBeInTheDocument();
  });

  it('submits the form with correct data', async () => {
    setup();
    
    const submitButton = screen.getByRole('button', { name: /enregistrer/i });
    
    // Ajouter une rubrique via le mock
    fireEvent.click(screen.getByText('Ajouter une rubrique de test'));
    
    // Soumettre le formulaire
    fireEvent.click(submitButton);
    
    // Vérifier que onSubmit a été appelé avec les bonnes données
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        code: 'PP-TEST',
        nom: 'Test Profil',
        categorie: 'cadre',
        description: 'Description du profil de test',
        rubriques: [
          mockInitialData.rubriques![0],
          expect.objectContaining({
            rubriqueId: 'RB-TEST',
            code: 'TEST',
            nom: 'Test Rubrique',
            type: 'gain'
          })
        ]
      }));
    });
  });

  it('shows validation errors for required fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProfilPaieForm
          initialData={{}}
          onSubmit={mockOnSubmit}
        />
      </QueryClientProvider>
    );
    
    // Soumettre le formulaire sans remplir les champs requis
    fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));
    
    // Vérifier les messages d'erreur
    await waitFor(() => {
      expect(screen.getByText('Le code est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('Le nom est obligatoire')).toBeInTheDocument();
      expect(screen.getByText('La catégorie est obligatoire')).toBeInTheDocument();
    });
    
    // Vérifier que onSubmit n'a pas été appelé
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
}); 