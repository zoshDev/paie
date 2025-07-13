import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Employee } from './types'

// Stub de ta fonction d'API : remplace par l'appel vers /services/employees.getEmployees
async function fetchEmployees(): Promise<Employee[]> {
  // TODO : importer et utiliser ta fonction getEmployees()
  // import { getEmployees } from '@/services/employees'
  // return await getEmployees()
  return [
  { id: '1', Nom: 'Dupont Jean', Categorie: 'Technique', Poste: 'IT' },
  { id: '2', Nom: 'Lefevre Marie', Categorie: 'Commercial', Poste: 'Ventes' },
  { id: '3', Nom: 'Garcia Pierre', Categorie: 'Gestion', Poste: 'RH' },
  { id: '4', Nom: 'Dubois Sophie', Categorie: 'Technique', Poste: 'Développement' },
  

]; // placeholder, renvoie un tableau vide pour le moment
}

export function useEmployees() {
  // état du terme de recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // chargement via React Query
  const { data: allEmployees = [], isLoading, isError } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  })

  // filtrage memo-isé
  const employees = useMemo(() => {
    if (!searchTerm.trim()) return allEmployees
    const term = searchTerm.toLowerCase()
    return allEmployees.filter(emp =>
      [emp.Nom, emp.Categorie, emp.Poste].some(f =>
        f.toLowerCase().includes(term)
      )
    )
  }, [allEmployees, searchTerm])

  const toggleSelectedId = (id: string) => {
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