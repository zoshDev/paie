import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Societe } from './types';

// Stub de votre fonction d'API pour récupérer UNE SEULE société par son ID
async function fetchSocieteUnique(id: string): Promise<Societe | undefined> {
  // TODO: Importer et utiliser votre fonction pour récupérer la société unique
  // Exemple de données statiques pour une seule société
  return {
    id: 'unique_societe',
    Nom: 'Ma Super Entreprise',
    Adresse: '123 Rue du Centre',
    Ville: 'Quelque Part',
    Pays: 'Mon Pays',
  };
}

function useSocieteUnique(societeId: string) {
  const { data: societe, isLoading, isError, refetch } = useQuery<Societe | undefined>({
    queryKey: ['societe', societeId],
    queryFn: () => fetchSocieteUnique(societeId),
    enabled: !!societeId, // Ne pas lancer la requête si l'ID n'est pas encore là
  });

  // Vous pourriez avoir une fonction de mutation ici pour enregistrer les modifications

  return { societe, isLoading, isError, refetch };
}

export default useSocieteUnique;