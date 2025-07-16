import { useState } from 'react';
import type { ElementSalaire } from './elementSalaire';

// 🧪 À remplacer plus tard par React Query ou appel réel
const FAKE_ELEMENTS: ElementSalaire[] = [
  {
    societeId: 1,
    variableId: 1001,
    libelle: "Prime de rendement",
    type_element: "prime",
    nature: "fixe",
    imposable: true,
    soumisCnps: true,
    partEmploye: true,
    partEmployeur: true,
    prorataBase: 30,
    processCalculJson: {},
  },
  {
    societeId: 1,
    variableId: 1002,
    libelle: "Retenue CNPS",
    type_element: "retenue",
    nature: "variable",
    imposable: false,
    soumisCnps: true,
    partEmploye: true,
    partEmployeur: true,
    prorataBase: 30,
    processCalculJson: {},
  },
];

const useElementsSalaire = () => {
  // 📦 Liste complète simulée
  const [elements, setElements] = useState<ElementSalaire[]>(FAKE_ELEMENTS);

  // 🔍 Recherche
  const [searchTerm, setSearchTerm] = useState('');
  const filteredElements = elements.filter((el) =>
    el.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Sélection multiple
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelectedId = (variableId: number) => {
    setSelectedIds((prev) =>
      prev.includes(variableId) ? prev.filter((id) => id !== variableId) : [...prev, variableId]
    );
  };

  const toggleAllSelected = (list: ElementSalaire[]) => {
    const allIds = list.map((el) => el.variableId);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : allIds);
  };

  const clearSelection = () => setSelectedIds([]);

  const isAllSelected = filteredElements.length > 0 &&
    filteredElements.every((el) => selectedIds.includes(el.variableId));

  return {
    elements: filteredElements,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    isAllSelected,
  };
};

export default useElementsSalaire;
