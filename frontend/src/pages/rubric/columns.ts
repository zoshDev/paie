// pages/rubriques/columns.ts
import type { Column } from "../../components/table/DataTable";
import type { Rubric } from "./types";

export const rubricColumns: Column<Rubric>[] = [
  { 
      header: '', 
      key: 'select' as keyof Rubric,
      isSelection: true, 
  },
  { header: "Code", key: "code" },
  { header: "Nom", key: "nom" },
  { header: "Type", key: "type" },
  { header: "Méthode de calcul", key: "methode_calcul" },
];
