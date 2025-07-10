import type { Column } from '@/components/table/types';
import type { CategorieEchelon } from '@/types/categorieEchelon';


export const categorieEchelonColumns: Column<CategorieEchelon>[] = [
  {
    key: 'categorieId',
    header: 'Catégorie',
    //accessor: 'categorieId', // résolu en label dans le composant
  },
  {
    key: 'echelonId',
    header: 'Échelon',
    //accessor: 'echelonId', // résolu en label dans le composant
  }
];
