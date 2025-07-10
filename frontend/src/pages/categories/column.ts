import type { Column } from "../../components/table/DataTable";
import type { Categorie } from "./categoryType";

export const categorieColumns: Column<Categorie>[] = [
  {
    header: '',
    key: 'select' as keyof Categorie,
    isSelection: true,
  },
  { header: 'ID', key: 'id' },
  { header: 'Code', key: 'code' },
  { header: 'Nom', key: 'nom' },
  { header: 'Description', key: 'description' },
  
];
