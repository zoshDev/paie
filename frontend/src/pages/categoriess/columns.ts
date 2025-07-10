import type { Column } from '@/components/table/types';
import type { Categorie } from '@/types/categorie';

export const categorieColumns: Column<Categorie>[] = [
  {
    key: 'libelle',
    header: 'Libellé',
    //accessor: 'libelle',
  }
];
