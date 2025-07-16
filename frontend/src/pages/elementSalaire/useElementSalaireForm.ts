import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { elementSalaireSchema } from './elementSalaireSchema';
import type { ElementSalaire } from './elementSalaire';

// Hook qui encapsule la logique du formulaire
export function useElementSalaireForm(onSubmit: (data: ElementSalaire) => void) {
  // Initialisation du hook React Hook Form
  const form = useForm({
    resolver: zodResolver(elementSalaireSchema),
    defaultValues: {
      societeId: 0,
      variableId: 0,
      libelle: '',
      type_element: 'prime',
      nature: 'fixe',
      imposable: true,
      soumisCnps: true,
      partEmploye: true,
      partEmployeur: true,
      prorataBase: 0,
      processCalculJson: {},
    },
  });

  // Retourne les fonctions nécessaires
  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}
