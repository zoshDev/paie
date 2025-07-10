import { useState, useMemo } from 'react';
import type { Rubric } from './types';
import { useQuery } from '@tanstack/react-query';


// Stub de ta fonction d'API pour les rubriques
async function fetchRubrics(): Promise<Rubric[]> {
  // TODO : importer et utiliser ta fonction getRubrics()
  // import { getRubrics } from '@/services/rubrics'
  // return await getRubrics()
  return [
     {
    id: 'RB001',
    code: 'SB',
    nom: 'Salaire de Base',
    type: 'salaire',
    description: 'Rémunération mensuelle fixe de l\'employé.',
  },
  {
    id: 'RB002',
    code: 'PRIME_ANCIENNETE',
    nom: 'Prime d\'Ancienneté',
    type: 'gain',
    description: 'Prime versée en fonction de la durée d\'emploi dans l\'entreprise.',
  },
  {
    id: 'RB003',
    code: 'INDEMNITE_TRANSPORT',
    nom: 'Indemnité de Transport',
    type: 'gain',
    description: 'Remboursement des frais de déplacement domicile-travail.',
  },
  {
    id: 'RB004',
    code: 'COTIS_SANTÉ',
    nom: 'Cotisation Santé',
    type: 'deduction',
    description: 'Part salariale de la cotisation à la mutuelle santé.',
  },
  {
    id: 'RB005',
    code: 'HSUP',
    nom: 'Heures Supplémentaires',
    type: 'gain',
    description: 'Rémunération des heures travaillées au-delà de la durée légale.',
  },
  {
    id: 'RB006',
    code: 'IMPOT_REVENU',
    nom: 'Impôt sur le Revenu',
    type: 'deduction',
    description: 'Retenue à la source de l\'impôt sur le revenu.',
  },
  {
    id: 'RB007',
    code: 'PRIME_PERFORMANCE',
    nom: 'Prime de Performance',
    type: 'gain',
    description: 'Prime liée à l\'atteinte d\'objectifs individuels ou collectifs.',
  },
  {
    id: 'RB008',
    code: 'AVANCE_SALAIRE',
    nom: 'Avance sur Salaire',
    type: 'deduction',
    description: 'Montant avancé sur le salaire futur.',
  },
  {
    id: 'RB009',
    code: 'PRIME_FIN_ANNEE',
    nom: 'Prime de Fin d\'Année',
    type: 'gain',
    description: 'Prime versée généralement en décembre.',
  },
  {
    id: 'RB010',
    code: 'COTIS_RETRAITE',
    nom: 'Cotisation Retraite',
    type: 'deduction',
    description: 'Part salariale de la cotisation pour la retraite.',
  },
    ]; // placeholder
}

export function useRubrics() {
  // état du terme de recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // chargement via React Query
  const { data: allRubrics = [], isLoading, isError } = useQuery<Rubric[]>({
    queryKey: ['rubrics'],
    queryFn: fetchRubrics,
  });

  // filtrage memo-isé
  const rubrics = useMemo(() => {
    if (!searchTerm.trim()) return allRubrics;
    const term = searchTerm.toLowerCase();
    return allRubrics.filter(rubric =>
      [rubric.code,rubric.nom, rubric.description, rubric.description, rubric.type].some(f =>
        f?.toLowerCase().includes(term) // Gère le cas où la description est undefined
      )
    );
  }, [allRubrics, searchTerm]);

  const toggleSelectedId = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const selectAll = () => {
    const allIds = rubrics.map(rubric => rubric.id);
    setSelectedIds(allIds);
  };

  const toggleAllSelected = () => {
    if (selectedIds.length === rubrics.length) {
      clearSelection();
    } else {
      selectAll();
    }
  };

  const isAllSelected = selectedIds.length === rubrics.length;

  return {
    rubrics,
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

export default useRubrics;