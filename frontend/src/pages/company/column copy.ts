import type { Column } from '../../components/table/DataTable';
import type { Societe } from './types';

export const societeColumns: Column<Societe>[] = [
  {
    header: '',
    key: 'select' as keyof Societe,
    isSelection: true,
  },
  { header: 'ID', key: 'id' },
  { header: 'Nom', key: 'nom' },
  { header: 'Localisation', key: 'localisation' },
  { header: 'Régime Fiscal', key: 'regime_fiscal' },
  // { header: 'Actions', key: 'actions' as keyof Societe, isActions: true },
];
