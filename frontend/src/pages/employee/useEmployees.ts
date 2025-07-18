import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { RawEmployee as  Employee, RawEmployee } from '@/pages/employee/rawEmployee'

// Stub de ta fonction d'API : remplace par l'appel vers /services/employees.getEmployees
async function fetchEmployees(): Promise<Employee[]> {
  // TODO : importer et utiliser ta fonction getEmployees()
  // import { getEmployees } from '@/services/employees'
  // return await getEmployees()
  return [
    {
    id: 1,
    userId: 101,
    userRoleId: [1],
    isActive: true,
    name: "Dupont",
    matricule: "EMP001",
    statutFamilial: "Célibataire",
    nbEnfants: 0,
    nationalite: "Française",
    estLoge: false,
    societeId: 2,
    categorieEchelonId: 5,
  },
  

]; // placeholder, renvoie un tableau vide pour le moment
}

export function useEmployees() {
  // état du terme de recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // chargement via React Query
  const { data: allEmployees = [], isLoading, isError } = useQuery<RawEmployee[]>({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  })

  // filtrage memo-isé
  const employees = useMemo(() => {
    if (!searchTerm.trim()) return allEmployees
    const term = searchTerm.toLowerCase()
    return allEmployees.filter(emp =>
    [emp.matricule, emp.name, emp.societeId?.toString(), emp.categorieEchelonId?.toString()].some(f =>
      f?.toLowerCase().includes(term)
    )
);

  }, [allEmployees, searchTerm])

  const toggleSelectedId = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  const selectAll = () => {
    const allIds = employees.map(emp => emp.id)
    setSelectedIds(allIds)
  }

  const toggleAllSelected = () => {
    if (selectedIds.length === employees.length) {
      clearSelection();
    } else {
      selectAll();
    }
  };

  const isAllSelected = selectedIds.length === employees.length

  return { employees, searchTerm, setSearchTerm, isLoading, isError, selectedIds, setSelectedIds, toggleSelectedId, toggleAllSelected, clearSelection, selectAll, isAllSelected }
}
export default useEmployees