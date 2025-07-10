import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RubriqueSelector from '../RubriqueSelector';
import type { ProfilPaieRubrique } from '../../../pages/profilPaie/types';

// Mock pour React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock pour le hook useQuery
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: vi.mock().mockReturnValue({
    data: [
      {
        id: 'RB001',
        code: 'SB',
        nom: 'Salaire de Base',
        type: 'salaire',
        description: 'Rémunération mensuelle fixe',
      },
      {
        id: 'RB002',
        code: 'PRIME',
        nom: 'Prime',
        type: 'gain',
        description: 'Prime mensuelle',
      }
    ],
    isLoading: false,
    isError: false,
  }),
}));

describe('RubriqueSelector Component', () => {
  const selectedRubriques: ProfilPaieRubrique[] = [
    {
      rubriqueId: 'RB003',
      code: 'TRANS',
      nom: 'Transport',
      type: 'gain',
      ordre: 1
    }
  ];

  const mockOnChange = vi.mock();

  const setup = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <RubriqueSelector
          selectedRubriques={selectedRubriques}
          onChange={mockOnChange}
          {...props}
        />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    setup();
    expect(screen.getByText('Rubriques sélectionnées')).toBeInTheDocument();
    expect(screen.getByText('Ajouter des rubriques')).toBeInTheDocument();
  });

  it('displays selected rubriques', () => {
    setup();
    expect(screen.getByText('Transport')).toBeInTheDocument();
    expect(screen.getByText('TRANS')).toBeInTheDocument();
  });

  it('displays available rubriques', () => {
    setup();
    expect(screen.getByText('Salaire de Base')).toBeInTheDocument();
    expect(screen.getByText('Prime')).toBeInTheDocument();
  });

  it('allows searching for rubriques', () => {
    setup();
    const searchInput = screen.getByPlaceholderText('Rechercher une rubrique...');
    fireEvent.change(searchInput, { target: { value: 'Salaire' } });
    
    expect(screen.getByText('Salaire de Base')).toBeInTheDocument();
    expect(screen.queryByText('Prime')).not.toBeInTheDocument();
  });

  it('calls onChange when adding a rubrique', () => {
    setup();
    const addButton = screen.getAllByText('Ajouter')[0];
    fireEvent.click(addButton);
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith([
      ...selectedRubriques,
      expect.objectContaining({
        rubriqueId: 'RB001',
        code: 'SB',
        nom: 'Salaire de Base',
        type: 'salaire',
        ordre: 2
      })
    ]);
  });

  it('calls onChange when removing a rubrique', () => {
    setup();
    const removeButton = screen.getByRole('button', { name: /trash/i });
    fireEvent.click(removeButton);
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });
}); 