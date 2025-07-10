import { useState, useMemo } from 'react';
import type { ProfilPaie } from './types';
import { useQuery } from '@tanstack/react-query';

// Fonction pour récupérer les profils de paie depuis l'API (simulée)
async function fetchProfilsPaie(): Promise<ProfilPaie[]> {
  // TODO : Remplacer par l'appel API réel
  // import { getProfilPaie } from '@/services/profilPaie'
  // return await getProfilPaie()
  return [
    {
      id: 'PP001',
      code: 'CADRE_STD',
      nom: 'Profil Standard Cadre',
      description: 'Profil de paie standard pour les cadres',
      categorie: 'cadre',
      rubriques: [
        {
          rubriqueId: 'RB001',
          code: 'SB',
          nom: 'Salaire de Base',
          type: 'salaire',
          ordre: 1
        },
        {
          rubriqueId: 'RB002',
          code: 'PRIME_ANCIENNETE',
          nom: 'Prime d\'Ancienneté',
          type: 'gain',
          ordre: 2
        },
        {
          rubriqueId: 'RB004',
          code: 'COTIS_SANTÉ',
          nom: 'Cotisation Santé',
          type: 'deduction',
          ordre: 3
        }
      ]
    },
    {
      id: 'PP002',
      code: 'NCADRE_STD',
      nom: 'Profil Standard Non-Cadre',
      description: 'Profil de paie standard pour les non-cadres',
      categorie: 'non-cadre',
      rubriques: [
        {
          rubriqueId: 'RB001',
          code: 'SB',
          nom: 'Salaire de Base',
          type: 'salaire',
          ordre: 1
        },
        {
          rubriqueId: 'RB003',
          code: 'INDEMNITE_TRANSPORT',
          nom: 'Indemnité de Transport',
          type: 'gain',
          ordre: 2
        }
      ]
    },
    {
      id: 'PP003',
      code: 'STAG_BASE',
      nom: 'Profil Stagiaire',
      description: 'Profil de base pour stagiaires',
      categorie: 'stagiaire',
      rubriques: [
        {
          rubriqueId: 'RB001',
          code: 'SB',
          nom: 'Salaire de Base',
          type: 'salaire',
          ordre: 1
        }
      ]
    }
  ]; // données de test
}

export function useProfilPaie() {
  // État local
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Récupération des données
  const { data: allProfilsPaie = [], isLoading, isError } = useQuery<ProfilPaie[]>({
    queryKey: ['profilsPaie'],
    queryFn: fetchProfilsPaie,
  });

  // Filtrage des profils de paie en fonction du terme de recherche
  const profilsPaie = useMemo(() => {
    if (!searchTerm.trim()) return allProfilsPaie;
    const term = searchTerm.toLowerCase();
    return allProfilsPaie.filter(profil =>
      [profil.nom, profil.code, profil.description, profil.categorie].some(f =>
        f?.toLowerCase().includes(term)
      )
    );
  }, [allProfilsPaie, searchTerm]);

  // Gestion de la sélection
  const toggleSelectedId = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const selectAll = () => {
    const allIds = profilsPaie.map(profil => profil.id);
    setSelectedIds(allIds);
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
    isLoading,
    isError,
    selectedIds,
    setSelectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    selectAll,
    isAllSelected,
  };
}

export default useProfilPaie; 