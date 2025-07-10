import type { Column } from '@/components/table/types';
import type { Echelon } from '@/types/echelon';

export const echelonColumns: Column<Echelon>[] = [
  {
    key: 'libelle',
    header: 'Libellé',
    //accessor: 'libelle'
  }
];
