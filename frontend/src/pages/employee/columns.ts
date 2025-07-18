import type { Column }  from '../../components/table/DataTable'
import type { RawEmployee } from '@/pages/employee/rawEmployee'

export const employeeColumns: Column<RawEmployee>[] = [
  { 
    header: '', 
    key: 'select' as keyof RawEmployee,
    isSelection: true, 
  },
  { header: 'ID', key: 'id' },
  { header: 'Matricule', key: 'matricule' },
  { header: 'Nom', key: 'name' },
  
  { header: 'CatégorieEchelon', key: 'categorieEchelonId' },
  { header: 'Societe', key: 'societeId' },
  //{ header: 'Actions', key: 'actions' as keyof Employee, isActions: true},
]
