import type { Column }  from '../../components/table/DataTable'
import type { Employee } from './types'

export const employeeColumns: Column<Employee>[] = [
  { 
    header: '', 
    key: 'select' as keyof Employee,
    isSelection: true, 
},
  { header: 'ID', key: 'id' },
  { header: 'Nom', key: 'Nom' },
  { header: 'Catégorie', key: 'Categorie' },
  { header: 'Poste', key: 'Poste' },
  //{ header: 'Actions', key: 'actions' as keyof Employee, isActions: true},
]
