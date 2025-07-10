import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenericDuplicateForm from './GenericDuplicateForm';
import { toast } from 'react-hot-toast';

// Mock de react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: vi.mock(),
  error: vi.mock()
}));

// Type de test
interface TestEntity {
  id: string;
  code: string;
  nom: string;
  description?: string;
}

describe('GenericDuplicateForm', () => {
  // Entity à dupliquer pour les tests
  const testEntity: TestEntity = {
    id: 'test-123',
    code: 'TEST001',
    nom: 'Test Entity',
    description: 'Test description'
  };

  // Props par défaut pour le composant
  const defaultProps = {
    entityToDuplicate: testEntity,
    onClose: vi.mock(),
    onDuplicateSubmit: vi.mock(),
    isSubmitting: false,
    renderEntityForm: jest.fn(
      (initialData: Partial<TestEntity>, onSubmit: (data: Partial<TestEntity>) => void, isSubmitting: boolean, onClose: () => void) => (
        <div data-testid="test-entity-form">
          <p>Formulaire de test pour {initialData.nom}</p>
          <button 
            data-testid="entity-form-submit"
            onClick={() => onSubmit(initialData)}
          >
            Soumettre le formulaire de l'entité
          </button>
        </div>
      )
    ),
    generateNewCode: (code: string | undefined) => `${code}_COPY`,
    generateNewName: (name: string | undefined) => `Copie de ${name}`,
    modalTitle: "Test de duplication",
    introText: "Texte d'introduction de test"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rend correctement le composant avec les titres et champs', () => {
    render(<GenericDuplicateForm {...defaultProps} />);
    
    // Vérifier le titre et l'intro
    expect(screen.getByText('Test de duplication')).toBeInTheDocument();
    expect(screen.getByText("Texte d'introduction de test")).toBeInTheDocument();
    
    // Vérifier les champs de formulaire
    expect(screen.getByLabelText('Code')).toHaveValue('TEST001_COPY');
    expect(screen.getByLabelText('Nom')).toHaveValue('Copie de Test Entity');
    
    // Vérifier que le formulaire spécifique est rendu
    expect(screen.getByTestId('test-entity-form')).toBeInTheDocument();
    expect(screen.getByText('Formulaire de test pour Copie de Test Entity')).toBeInTheDocument();
  });

  it('appelle onClose quand le bouton Annuler est cliqué', () => {
    render(<GenericDuplicateForm {...defaultProps} />);
    
    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('met à jour les champs lorsque l\'utilisateur les modifie', () => {
    render(<GenericDuplicateForm {...defaultProps} />);
    
    // Modifier le champ Code
    const codeInput = screen.getByLabelText('Code');
    fireEvent.change(codeInput, { target: { value: 'NOUVEAU_CODE' } });
    
    // Modifier le champ Nom
    const nameInput = screen.getByLabelText('Nom');
    fireEvent.change(nameInput, { target: { value: 'Nouveau Nom' } });
    
    // Vérifier que les valeurs ont été mises à jour
    expect(codeInput).toHaveValue('NOUVEAU_CODE');
    expect(nameInput).toHaveValue('Nouveau Nom');
    
    // Vérifier que le formulaire spécifique est mis à jour avec les nouvelles valeurs
    expect(screen.getByText('Formulaire de test pour Nouveau Nom')).toBeInTheDocument();
  });

  it('soumet le formulaire avec les données correctes', () => {
    render(<GenericDuplicateForm {...defaultProps} />);
    
    // Modifier les champs
    const codeInput = screen.getByLabelText('Code');
    const nameInput = screen.getByLabelText('Nom');
    
    fireEvent.change(codeInput, { target: { value: 'CUSTOM_CODE' } });
    fireEvent.change(nameInput, { target: { value: 'Custom Name' } });
    
    // Soumettre le formulaire spécifique
    const submitEntityButton = screen.getByTestId('entity-form-submit');
    fireEvent.click(submitEntityButton);
    
    // Vérifier que onDuplicateSubmit a été appelé avec les données correctes
    expect(defaultProps.onDuplicateSubmit).toHaveBeenCalledWith({
      code: 'CUSTOM_CODE',
      nom: 'Custom Name',
      description: 'Test description'
    });
    
    // Vérifier que le toast de succès a été affiché
    expect(toast.success).toHaveBeenCalledWith('Duplication réussie !');
  });

  it('désactive les boutons et champs quand isSubmitting est true', () => {
    render(<GenericDuplicateForm {...defaultProps} isSubmitting={true} />);
    
    // Vérifier que les champs sont désactivés
    expect(screen.getByLabelText('Code')).toBeDisabled();
    expect(screen.getByLabelText('Nom')).toBeDisabled();
    
    // Vérifier que les boutons sont désactivés
    expect(screen.getByText('Annuler')).toBeDisabled();
    expect(screen.getByText('Créer la copie')).toBeDisabled();
  });

  it('utilise les valeurs par défaut pour codeFieldName et nameFieldName', () => {
    // Tester les valeurs par défaut sans spécifier explicitement codeFieldName et nameFieldName
    render(<GenericDuplicateForm {...defaultProps} />);
    
    // Vérifier que les champs utilisent toujours 'code' et 'nom' par défaut
    expect(screen.getByLabelText('Code')).toHaveValue('TEST001_COPY');
    expect(screen.getByLabelText('Nom')).toHaveValue('Copie de Test Entity');
  });
}); 