import { useEffect, useState } from "react";

// 🔧 Type des éléments à lier : ex. Rôles, éléments de salaire...
interface Item {
  id: number;
  label: string;
}

// 🧩 Props attendues par le composant
interface Props {
  sourceId: number;                             // ID de l'entité source (ex: employé ou rôle)
  sourceLabel: string;                          // Libellé source (ex: "Employé")
  targetLabel: string;                          // Type d'entité à lier (ex: "Rôle")

  fetchLinked: () => Promise<Item[]>;           // Fonction pour récupérer les éléments déjà liés
  fetchAvailable: () => Promise<Item[]>;        // Fonction pour récupérer les éléments disponibles
  onSave: (linkedIds: number[]) => Promise<void>; // Fonction pour sauvegarder la sélection

  multiple?: boolean;                           // Choix entre sélection unique ou multiple
  filterPlaceholder?: string;                   // Texte pour le champ de recherche
}

export function EntityLinker({
  sourceId,
  sourceLabel,
  targetLabel,
  fetchLinked,
  fetchAvailable,
  onSave,
  multiple = false,
  filterPlaceholder = "Rechercher...",
}: Props) {
  // 🎯 États pour gérer les données et l’interaction
  const [linkedItems, setLinkedItems] = useState<Item[]>([]);         // Éléments déjà liés
  const [availableItems, setAvailableItems] = useState<Item[]>([]);   // Éléments disponibles
  const [selectedIds, setSelectedIds] = useState<number[]>([]);       // IDs sélectionnés

  const [filter, setFilter] = useState("");                           // Texte de filtrage
  const [loading, setLoading] = useState(true);                       // Chargement initial
  const [saving, setSaving] = useState(false);                        // Sauvegarde en cours

  // 🔁 À l’ouverture, on charge les données depuis les services
  useEffect(() => {
    async function load() {
      try {
        const [linked, available] = await Promise.all([
          fetchLinked(),
          fetchAvailable(),
        ]);
        setLinkedItems(linked);
        setAvailableItems(available);
        setSelectedIds(linked.map((i) => i.id)); // ✅ pré-remplissage des éléments liés
      } catch (error) {
        console.error("[❌ EntityLinker] Erreur de chargement :", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 💾 Quand l'utilisateur sauvegarde
  const handleSave = async () => {
    setSaving(true);
    await onSave(selectedIds); // Appel backend avec les IDs sélectionnés
    setSaving(false);
  };

  // 🔍 Filtrage local selon le champ de recherche
  const filtered = availableItems.filter((item) =>
    item.label.toLowerCase().includes(filter.toLowerCase())
  );

  // 🖱️ Lorsqu'on change la sélection
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value));
    setSelectedIds(multiple ? values : [values[0]]);
  };

  return (
    <div className="space-y-4 text-sm">
      {/* 🧾 Titre contextuel dynamique */}
      <h3 className="text-base font-semibold text-indigo-700">
        Lier {targetLabel} à {sourceLabel} #{sourceId}
      </h3>

      {/* ⏳ Affiche le chargement au début */}
      {loading ? (
        <p className="text-gray-500 italic">Chargement des données...</p>
      ) : (
        <>
          {/* 🔍 Champ de recherche */}
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={filterPlaceholder}
            className="border px-2 py-1 rounded w-full"
          />

          {/* 🎛️ Sélecteur (single ou multi) */}
          <select
            multiple={multiple}
            value={selectedIds.map(String)}
            onChange={handleChange}
            className="border p-2 rounded w-full h-40"
          >
            {filtered.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          {!loading && availableItems.length === 0 && (
            <p className="text-sm text-red-500 italic">
                Aucun {targetLabel.toLowerCase()} disponible pour la liaison.
            </p>
            )}

          {/* 🚨 Message si aucune donnée disponible */}

          {/* 💾 Bouton d'enregistrement */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder les liaisons"}
          </button>
        </>
      )}
    </div>
  );
}
