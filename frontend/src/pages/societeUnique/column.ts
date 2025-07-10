import type { Column } from '../../components/table/DataTable';
import type { Societe } from './types';

export const societeColumns: Column<Societe>[] = [
  {
    header: '',
    key: 'select' as keyof Societe,
    isSelection: true,
  },
  { header: 'ID', key: 'id' },
  { header: 'Nom', key: 'Nom' },
  { header: 'Adresse', key: 'Adresse' },
  { header: 'Ville', key: 'Ville' },
  // { header: 'Actions', key: 'actions' as keyof Societe, isActions: true},
];