import type { Column } from "../../components/table/DataTable";
import type { ProfilPaie } from "./types";

export const profilPaieColumns: Column<ProfilPaie>[] = [
  { 
      header: '', 
      key: 'select' as keyof ProfilPaie,
      isSelection: true, 
  },
  { header: "Code", key: "code" },
  { header: "Nom", key: "nom" },
  { header: "Catégorie", key: "categorie" },
  { 
    header: "Nombre de rubriques", 
    key: "rubriques" as keyof ProfilPaie,
    render: (profil: ProfilPaie) => profil.rubriques ? profil.rubriques.length.toString() : "0"
  }
]; 