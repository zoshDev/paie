import type { Column } from "../../components/table/DataTable";
import type { RoleProfilPaie } from "./types";

export const profilPaieColumns: Column<RoleProfilPaie>[] = [
  { 
      header: '', 
      key: 'select' as keyof RoleProfilPaie,
      isSelection: true, 
  },
  { header: "Nom", key: "roleName" },
  { header: "Catégorie-Echelon", key: "categorie" },
  { 
    header: "Nombre d'éléments de salaire", 
    key: "elements" as keyof RoleProfilPaie,
    render: (profil: RoleProfilPaie) => profil.elements ? profil.elements.length.toString() : "0"
  }
]; 