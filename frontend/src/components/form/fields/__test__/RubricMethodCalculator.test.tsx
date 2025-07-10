// components/ui/form/__tests__/RubricMethodCalculator.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import RubricMethodCalculator from '../RubricMethodCalculator';
import { rubricValidationSchema } from '../rubricValidationSchema';
import type { SelectOption } from '../RubricMethodCalculator.types';

// Mock des rubriques disponibles pour les tests
const mockRubriquesDisponibles: SelectOption[] = [
  { label: 'Prime de transport', value: 'prime_transport' },
  { label: 'Prime d\'ancienneté', value: 'prime_anciennete' },
  { label: 'Indemnité logement', value: 'indemnite_logement' },
  { label: 'Prime de rendement', value: 'prime_rendement' }
];

// Composant wrapper pour les tests avec react-hook-form
const TestWrapper: React.FC<{ 
  defaultValues?: any;
  children: (props: any) => React.ReactNode;
}> = ({ defaultValues = {}, children }) => {
  const formMethods = useForm({
    resolver: yupResolver(rubricValidationSchema),
    defaultValues: {
      code: '',
      nom: '',
      type: 'gain',
      methode_calcul: '',
      ...defaultValues
    }
  });

  return (
    <form>
      {children(formMethods)}
    </form>
  );
};

describe('RubricMethodCalculator', () => {
  const renderComponent = (defaultValues = {}) => {
    return render(
      <TestWrapper defaultValues={defaultValues}>
        {({ control, register, watch, formState: { errors } }) => (
          <RubricMethodCalculator
            control={control}
            register={register}
            watch={watch}
            errors={errors}
            rubriquesDisponibles={mockRubriquesDisponibles}
          />
        )}
      </TestWrapper>
    );
  };

  describe('Rendu initial', () => {
    test('affiche le titre du composant', () => {
      renderComponent();
      expect(screen.getByText('Configuration de la méthode de calcul')).toBeInTheDocument();
    });

    test('affiche le message par défaut quand aucune méthode n\'est sélectionnée', () => {
      renderComponent();
      expect(screen.getByText(/Sélectionnez d'abord une méthode de calcul/)).toBeInTheDocument();
    });
  });

  describe('Méthode Montant Fixe', () => {
    test('affiche la configuration montant fixe quand sélectionnée', () => {
      renderComponent({ methode_calcul: 'montant_fixe' });
      
      expect(screen.getByText('Configuration du montant fixe')).toBeInTheDocument();
      expect(screen.getByLabelText(/Montant fixe/)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ex: 50000')).toBeInTheDocument();
    });

    test('permet de saisir un montant fixe', async () => {
      renderComponent({ methode_calcul: 'montant_fixe' });
      
      const input = screen.getByLabelText(/Montant fixe/) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '75000' } });
      
      await waitFor(() => {
        expect(input.value).toBe('75000');
      });
    });
  });

  describe('Méthode Pourcentage', () => {
    test('affiche la configuration pourcentage quand sélectionnée', () => {
      renderComponent({ methode_calcul: 'pourcentage' });
      
      expect(screen.getByText('Configuration du pourcentage')).toBeInTheDocument();
      expect(screen.getByLabelText(/Taux \(%\)/)).toBeInTheDocument();
      expect(screen.getByText('Base de calcul')).toBeInTheDocument();
      expect(screen.getByText('Bases standard')).toBeInTheDocument();
      expect(screen.getByText('Rubriques spécifiques')).toBeInTheDocument();
    });

    test('affiche les bases standard', () => {
      renderComponent({ methode_calcul: 'pourcentage' });
      
      expect(screen.getByText('Salaire brut')).toBeInTheDocument();
      expect(screen.getByText('Salaire net')).toBeInTheDocument();
      expect(screen.getByText('Salaire avant IRPP')).toBeInTheDocument();
    });

    test('affiche le filtre et la liste des rubriques', () => {
      renderComponent({ methode_calcul: 'pourcentage' });
      
      expect(screen.getByPlaceholderText('Filtrer les rubriques...')).toBeInTheDocument();
      expect(screen.getByText('Prime de transport')).toBeInTheDocument();
      expect(screen.getByText('Prime d\'ancienneté')).toBeInTheDocument();
    });

    test('filtre les rubriques selon la saisie', async () => {
      renderComponent({ methode_calcul: 'pourcentage' });
      
      const filterInput = screen.getByPlaceholderText('Filtrer les rubriques...');
      fireEvent.change(filterInput, { target: { value: 'transport' } });
      
      await waitFor(() => {
        expect(screen.getByText('Prime de transport')).toBeInTheDocument();
        expect(screen.queryByText('Prime d\'ancienneté')).not.toBeInTheDocument();
      });
    });

    test('permet de sélectionner une base standard', async () => {
      renderComponent({ methode_calcul: 'pourcentage' });
      
      const radioButton = screen.getByRole('radio', { name: /Salaire brut/ });
      fireEvent.click(radioButton);
      
      await waitFor(() => {
        expect(radioButton).toBeChecked();
      });
    });

    test('permet de sélectionner des rubriques spécifiques', async () => {
      renderComponent({ methode_calcul: 'pourcentage' });
      
      const checkbox = screen.getByRole('checkbox', { name: /Prime de transport/ });
      fireEvent.click(checkbox);
      
      await waitFor(() => {
        expect(checkbox).toBeChecked();
        expect(screen.getByText('Rubriques sélectionnées :')).toBeInTheDocument();
      });
    });

    test('désactive les rubriques quand une base standard est sélectionnée', async () => {
      renderComponent({ 
        methode_calcul: 'pourcentage',
        base_calcul_standard: 'salaire_brut'
      });
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeDisabled();
      });
      
      const filterInput = screen.getByPlaceholderText('Filtrer les rubriques...');
      expect(filterInput).toBeDisabled();
    });
  });

  describe('Méthode Barème Progressif', () => {
    test('affiche la configuration barème progressif quand sélectionnée', () => {
      renderComponent({ methode_calcul: 'bareme_progressif' });
      
      expect(screen.getByText('Configuration du barème progressif')).toBeInTheDocument();
    });
  });

  describe('Méthode Formule Personnalisée', () => {
    test('affiche la configuration formule personnalisée quand sélectionnée', () => {
      renderComponent({ methode_calcul: 'formule_personnalisee' });
      
      expect(screen.getByText('Configuration de la formule personnalisée')).toBeInTheDocument();
      expect(screen.getByLabelText(/Formule de calcul/)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/salaire_brut \* 0\.15/)).toBeInTheDocument();
    });

    test('permet de saisir une formule personnalisée', async () => {
      renderComponent({ methode_calcul: 'formule_personnalisee' });
      
      const textarea = screen.getByLabelText(/Formule de calcul/) as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'salaire_brut * 0.2 + prime_anciennete' } });
      
      await waitFor(() => {
        expect(textarea.value).toBe('salaire_brut * 0.2 + prime_anciennete');
      });
    });
  });

  describe('Interactions et logique métier', () => {
    test('permet de supprimer une rubrique sélectionnée', async () => {
      renderComponent({ methode_calcul: 'pourcentage' });
      
      // Sélectionner une rubrique
      const checkbox = screen.getByRole('checkbox', { name: /Prime de transport/ });
      fireEvent.click(checkbox);
      
      await waitFor(() => {
        expect(screen.getByText('Rubriques sélectionnées :')).toBeInTheDocument();
      });
      
      // Supprimer la rubrique
      const removeButton = screen.getByRole('button');
      fireEvent.click(removeButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Rubriques sélectionnées :')).not.toBeInTheDocument();
      });
    });

    test('affiche un message quand aucune rubrique n\'est trouvée après filtrage', async () => {
      renderComponent({ methode_calcul: 'pourcentage' });
      
      const filterInput = screen.getByPlaceholderText('Filtrer les rubriques...');
      fireEvent.change(filterInput, { target: { value: 'inexistant' } });
      
      await waitFor(() => {
        expect(screen.getByText('Aucune rubrique trouvée')).toBeInTheDocument();
      });
    });
  });

  describe('Validation des props', () => {
    test('fonctionne avec des rubriques disponibles vides', () => {
      render(
        <TestWrapper defaultValues={{ methode_calcul: 'pourcentage' }}>
          {({ control, register, watch, formState: { errors } }) => (
            <RubricMethodCalculator
              control={control}
              register={register}
              watch={watch}
              errors={errors}
              rubriquesDisponibles={[]}
            />
          )}
        </TestWrapper>
      );
      
      expect(screen.getByText('Aucune rubrique trouvée')).toBeInTheDocument();
    });
  });

  describe('Gestion des erreurs', () => {
    test('affiche les erreurs de validation pour montant fixe', () => {
      const mockErrors = {
        montant_fixe: { message: 'Le montant fixe est requis' }
      };
      
      render(
        <TestWrapper defaultValues={{ methode_calcul: 'montant_fixe' }}>
          {({ control, register, watch }) => (
            <RubricMethodCalculator
              control={control}
              register={register}
              watch={watch}
              errors={mockErrors}
              rubriquesDisponibles={mockRubriquesDisponibles}
            />
          )}
        </TestWrapper>
      );
      
      expect(screen.getByText('Le montant fixe est requis')).toBeInTheDocument();
    });

    test('affiche les erreurs de validation pour pourcentage', () => {
      const mockErrors = {
        taux_pourcentage: { message: 'Le taux de pourcentage est requis' }
      };
      
      render(
        <TestWrapper defaultValues={{ methode_calcul: 'pourcentage' }}>
          {({ control, register, watch }) => (
            <RubricMethodCalculator
              control={control}
              register={register}
              watch={watch}
              errors={mockErrors}
              rubriquesDisponibles={mockRubriquesDisponibles}
            />
          )}
        </TestWrapper>
      );
      
      expect(screen.getByText('Le taux de pourcentage est requis')).toBeInTheDocument();
    });
  });
});