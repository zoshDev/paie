import type { Column } from "@/components/table/types";
import type { Variable } from "./variableService";
//import { companyService } from "@/services/companyService";
//import { safeGet } from "@/utils/safeRequest";

//export let companyNamereq = await companyService.get();


export const variableColumns: Column<Variable>[] = [
  { 
      header: '', 
      key: 'select' as keyof Variable,
      isSelection: true, 
  },
  { 
    header: 'ID', 
    key: 'id',
  },
  {
    header: 'Société',
    key: 'societeId' , 
    //Faire un appel au service afin de récupérer le nom de la société
  },
  {
    header: 'Nom',
    key: 'nom',
  },
  {
    header: 'Description',
    key: 'nom',
  },
  {
    header: 'Valeur',
    key: 'valeur',
  },
  {
    header: 'Type de Variable',
    key: 'typeVariable',
  },
  {
    header: 'Code',
    key: 'code',
  },
  {
    header: 'Formule',
    key: 'formule',
  },
 
];
