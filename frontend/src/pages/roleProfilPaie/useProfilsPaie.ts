import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { profilPaieService } from './profilPaieService';
import type { ProfilPaie } from "./ProfilPaie";
import { mockElementsSalaire } from './mockElementsSalaire';

export default function useProfilsPaie() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  /*const { data } = useQuery({
    queryKey: ['profils-paie'],
    queryFn: profilPaieService.list,
  });*/

  const mockProfils: ProfilPaie[] = [
  {
    id: '1',
    nom: "Cadre Supérieur",
    elements: [mockElementsSalaire[1], mockElementsSalaire[0]],
  },
  {
    id: '2',
    nom: "Technicien",
    elements: [mockElementsSalaire[0], mockElementsSalaire[2]]
  },
  {
    id: '3',
    nom: "Contractuel",
    elements: [mockElementsSalaire[3], mockElementsSalaire[2]],
  },
];


  //const profils = data?.data ?? [];
  const profils = mockProfils.filter((p) =>
  p.nom.toLowerCase().includes(searchTerm.toLowerCase())
);


  const filtered = profils.filter((p: ProfilPaie) =>
  p.nom.toLowerCase().includes(searchTerm.toLowerCase())
);

  const toggleSelectedId = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllSelected = (items: any[]) => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item.id));
    }
  };

  return {
    profils: filtered,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection: () => setSelectedIds([]),
    isAllSelected: selectedIds.length === profils.length,
  };
}
