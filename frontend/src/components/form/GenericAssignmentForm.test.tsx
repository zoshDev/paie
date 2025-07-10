import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import GenericAssignmentForm from './GenericAssignmentForm';
import toast from "react-hot-toast";

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: vi.mock(),
  error: vi.mock()
}));

// Types de test
interface TestEntity {
  id: string;
  name: string;
  description?: string;
}

// Données de test
const testSourceIds = ['source1', 'source2'];

const testTargetEntities: TestEntity[] = [
  { id: 'target1', name: 'Target 1', description: 'Description 1' },
  { id: 'target2', name: 'Target 2', description: 'Description 2' },
  { id: 'target3', name: 'Target 3', description: 'Description 3' },
  { id: 'target4', name: 'Target 4' }
];

describe('GenericAssignmentForm', () => {
  const onCloseMock = vi.mock();
  const onSubmitMock = vi.mock();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders correctly with default props', () => {
    render(
      <GenericAssignmentForm
        sourceItemsIds={testSourceIds}
        availableTargetEntities={testTargetEntities}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
      />
    );
    
    // Vérifier le titre et la description par défaut
    expect(screen.getByText('Assignation d\'entités')).toBeInTheDocument();
    expect(screen.getByText(/sélectionnez les cibles auxquelles/i)).toBeInTheDocument();
    
    // Vérifier le message d'opération
    expect(screen.getByText(/vous êtes sur le point d'assigner/i)).toBeInTheDocument();
    expect(screen.getByText(/2 élément\(s\) à assigner/i)).toBeInTheDocument();
    
    // Vérifier la présence des entités disponibles
    expect(screen.getByText('Target 1')).toBeInTheDocument();
    expect(screen.getByText('Target 2')).toBeInTheDocument();
    expect(screen.getByText('Target 3')).toBeInTheDocument();
    expect(screen.getByText('Target 4')).toBeInTheDocument();
    
    // Vérifier la présence des descriptions
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    expect(screen.getByText('Description 3')).toBeInTheDocument();
    
    // Vérifier les boutons
    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /assigner/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /assigner/i })).toBeDisabled();
  });
  
  it('renders with custom props', () => {
    render(
      <GenericAssignmentForm
        sourceItemsIds={testSourceIds}
        availableTargetEntities={testTargetEntities}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        title="Titre personnalisé"
        description="Description personnalisée"
        sourceItemsLabel="Rubrique"
        targetFilterPlaceholder="Rechercher des profils..."
      />
    );
    
    // Vérifier le titre et la description personnalisés
    expect(screen.getByText('Titre personnalisé')).toBeInTheDocument();
    expect(screen.getByText('Description personnalisée')).toBeInTheDocument();
    
    // Vérifier le libellé personnalisé
    expect(screen.getByText(/2 rubrique/i)).toBeInTheDocument();
    
    // Vérifier le placeholder personnalisé
    const searchInput = screen.getByPlaceholderText('Rechercher des profils...');
    expect(searchInput).toBeInTheDocument();
  });
  
  it('allows adding targets to selection', async () => {
    render(
      <GenericAssignmentForm
        sourceItemsIds={testSourceIds}
        availableTargetEntities={testTargetEntities}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
      />
    );
    
    // Cliquer sur la première cible pour l'ajouter
    fireEvent.click(screen.getByText('Target 1'));
    
    // Vérifier que la cible est ajoutée à la sélection
    await waitFor(() => {
      expect(screen.getByText(/cibles sélectionnées/i)).toBeInTheDocument();
    });
    
    // Vérifier qu'aucune notification n'est affichée lors de l'ajout
    expect(toast.success).not.toHaveBeenCalled();
    
    // Vérifier que le bouton d'assignation est activé
    expect(screen.getByRole('button', { name: /assigner/i })).toBeEnabled();
    
    // Ajouter une autre cible
    fireEvent.click(screen.getByText('Target 2'));
    
    // Vérifier que les deux cibles sont sélectionnées
    await waitFor(() => {
      expect(screen.getByText(/cibles sélectionnées \(2\)/i)).toBeInTheDocument();
    });
  });
  
  it('allows removing targets from selection', async () => {
    render(
      <GenericAssignmentForm
        sourceItemsIds={testSourceIds}
        availableTargetEntities={testTargetEntities}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
      />
    );
    
    // Ajouter deux cibles
    fireEvent.click(screen.getByText('Target 1'));
    fireEvent.click(screen.getByText('Target 2'));
    
    // Attendre que les cibles soient ajoutées
    await waitFor(() => {
      expect(screen.getByText(/cibles sélectionnées \(2\)/i)).toBeInTheDocument();
    });
    
    // Trouver le bouton de suppression de la première cible
    const removeButtons = screen.getAllByRole('button', { name: /retirer/i });
    expect(removeButtons.length).toBe(2);
    
    // Cliquer sur le premier bouton de suppression
    fireEvent.click(removeButtons[0]);
    
    // Vérifier qu'il ne reste qu'une cible
    await waitFor(() => {
      expect(screen.getByText(/cibles sélectionnées \(1\)/i)).toBeInTheDocument();
    });
    
    // Vérifier qu'aucune notification n'est affichée lors de la suppression
    expect(toast.success).not.toHaveBeenCalled();
  });
  
  it('allows resetting the selection', async () => {
    render(
      <GenericAssignmentForm
        sourceItemsIds={testSourceIds}
        availableTargetEntities={testTargetEntities}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
      />
    );
    
    // Ajouter deux cibles
    fireEvent.click(screen.getByText('Target 1'));
    fireEvent.click(screen.getByText('Target 2'));
    
    // Attendre que les cibles soient ajoutées
    await waitFor(() => {
      expect(screen.getByText(/cibles sélectionnées \(2\)/i)).toBeInTheDocument();
    });
    
    // Cliquer sur le bouton de réinitialisation
    const resetButton = screen.getByText(/réinitialiser la sélection/i);
    fireEvent.click(resetButton);
    
    // Vérifier que la section de cibles sélectionnées n'est plus affichée
    await waitFor(() => {
      expect(screen.queryByText(/cibles sélectionnées/i)).not.toBeInTheDocument();
    });
    
    // Vérifier qu'aucune notification n'est affichée lors de la réinitialisation
    expect(toast.success).not.toHaveBeenCalled();
  });
  
  it('allows filtering targets by search term', async () => {
    render(
      <GenericAssignmentForm
        sourceItemsIds={testSourceIds}
        availableTargetEntities={testTargetEntities}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
      />
    );
    
    // Entrer un terme de recherche
    const searchInput = screen.getByPlaceholderText('Rechercher...');
    fireEvent.change(searchInput, { target: { value: 'Target 1' } });
    
    // Vérifier que seule la cible correspondante est affichée
    await waitFor(() => {
      expect(screen.getByText('Target 1')).toBeInTheDocument();
      expect(screen.queryByText('Target 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Target 3')).not.toBeInTheDocument();
    });
  });
  
  it('calls onSubmit when submitting the form', async () => {
    render(
      <GenericAssignmentForm
        sourceItemsIds={testSourceIds}
        availableTargetEntities={testTargetEntities}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
      />
    );
    
    // Ajouter une cible
    fireEvent.click(screen.getByText('Target 1'));
    
    // Attendre que la cible soit ajoutée
    await waitFor(() => {
      expect(screen.getByText(/cibles sélectionnées \(1\)/i)).toBeInTheDocument();
    });
    
    // Cliquer sur le bouton d'assignation
    fireEvent.click(screen.getByRole('button', { name: /assigner/i }));
    
    // Vérifier que toast.success a été appelé pour la soumission
    expect(toast.success).toHaveBeenCalledWith("1 cible(s) sélectionnée(s) avec succès");
    
    // Vérifier que onSubmit a été appelé avec les bons arguments
    expect(onSubmitMock).toHaveBeenCalledWith(
      testSourceIds,
      ['target1']
    );
  });
  
  it('displays error when trying to submit without selecting targets', async () => {
    render(
      <GenericAssignmentForm
        sourceItemsIds={testSourceIds}
        availableTargetEntities={testTargetEntities}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
      />
    );
    
    // Le bouton doit être désactivé
    expect(screen.getByRole('button', { name: /assigner/i })).toBeDisabled();
    
    // Forcer un clic sur le bouton désactivé (cas impossible en UI réel)
    fireEvent.click(screen.getByRole('button', { name: /assigner/i }));
    
    // Vérifier que onSubmit n'a pas été appelé
    expect(onSubmitMock).not.toHaveBeenCalled();
  });
  
  it('calls onClose when clicking the cancel button', () => {
    render(
      <GenericAssignmentForm
        sourceItemsIds={testSourceIds}
        availableTargetEntities={testTargetEntities}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
      />
    );
    
    // Cliquer sur le bouton d'annulation
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));
    
    // Vérifier que onClose a été appelé
    expect(onCloseMock).toHaveBeenCalled();
  });
}); 