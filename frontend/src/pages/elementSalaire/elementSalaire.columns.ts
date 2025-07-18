import type { Column } from '@/components/table/DataTable';
import type { ElementSalaire } from './elementSalaire';

export const elementSalaireColumns: Column<ElementSalaire>[] = [
  {
    key: "id", // ou "id" ou "libelle" → ce champ doit exister dans ElementSalaire
    header: "",
    isSelection: true, // ✅ indique que c’est une colonne pour la case à cocher
  },
  {
    key: "id", // ou "id" ou "libelle" → ce champ doit exister dans ElementSalaire
    header: "ID",
  },
  {
    key: 'libelle',
    header: 'Libellé',
    render: (item) => item.libelle
  },
  {
    key: 'type_element',
    header: 'Type',
    render: (item) => item.type_element === 'prime' ? 'Prime 🟢' : 'Retenue 🔴'
  },
  {
    key: 'nature',
    header: 'Nature',
    render: (item) => item.nature === 'fixe' ? 'Fixe' : 'Variable'
  },
  {
    key: 'imposable',
    header: 'Imposable',
    render: (item) => item.imposable ? '✅' : '❌'
  },
  {
    key: 'soumisCnps',
    header: 'Soumis CNPS',
    render: (item) => item.soumisCnps ? '✅' : '❌'
  },
  {
    key: 'partEmploye',
    header: 'Part Employé',
    render: (item) => item.partEmploye ? '✅' : '❌'
  },
  {
    key: 'partEmployeur',
    header: 'Part Employeur',
    render: (item) => item.partEmployeur ? '✅' : '❌'
  },
  {
    key: 'prorataBase',
    header: 'Prorata Base',
    render: (item) => item.prorataBase.toString()
  }
];
