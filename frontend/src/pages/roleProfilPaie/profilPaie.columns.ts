import type { Column } from "@/components/table/DataTable";
import type { ProfilPaie } from "./ProfilPaie";

export const profilPaieColumns : Column<ProfilPaie>[] = [
  {
    key: "id", // ou "id" ou "libelle" → ce champ doit exister dans ElementSalaire
    header: "",
    isSelection: true, // ✅ indique que c’est une colonne pour la case à cocher
  },
  { key: 'nom', header:"Nom du Profil" },
  {
    key: 'elements',
    header: "Nombre d'éléments",
    render: (rowModel: ProfilPaie) => rowModel.elements?.length ?? 0,
  },
];
