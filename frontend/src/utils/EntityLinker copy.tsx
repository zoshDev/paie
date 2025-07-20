import { useEffect, useState } from "react";

// 🧩 Type générique pour les éléments à sélectionner (ex: rôles, éléments de salaire)
interface Item {
  id: number;
  label: string;
}

// 🧠 Props du composant : entièrement génériques et réutilisables
interface Props {
  sourceId: number;                   // ID de l'entité source (ex: employé)
  sourceLabel: string;               // Libellé affiché (ex: "Employé")
  targetLabel: string;               // Type d'entité ciblée (ex: "Profil de paie")

  fetchLinked: () => Promise<Item[]>;    // Fonction pour récupérer les éléments déjà liés
  fetchAvailable: () => Promise<Item[]>; // Fonction pour récupérer tous les éléments disponibles
  onSave: (linkedIds: number[]) => Promise<void>; // Fonction pour sauvegarder la liaison

  multiple?: boolean;                // Permet de choisir entre select ou multiselect
  filterPlaceholder?: string;        // Texte du champ de recherche
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
  // 🧠 États internes pour stocker les données et la sélection
  const [linkedItems, setLinkedItems] = useState<Item[]>([]);         // éléments actuellement liés
  const [availableItems, setAvailableItems] = useState<Item[]>([]);   // éléments disponibles pour liaison
  const [selectedIds, setSelectedIds] = useState<number[]>([]);       // IDs sélectionnés pour liaison
  const [filter, setFilter] = useState("");                           // filtre texte pour recherche

  const [loading, setLoading] = useState(true);                       // état de chargement initial
  const [saving, setSaving] = useState(false);                       // état de sauvegarde en cours

  // 🔁 Chargement initial des données liées et disponibles
  useEffect(() => {
    async function load() {
    try {
      const [linked, available] = await Promise.all([
        fetchLinked(),     // éléments déjà liés à sourceId
        fetchAvailable()   // tous les éléments disponibles dans le système
      ]);

      console.log("[🧩 EntityLinker] linked:", linked);
      console.log("[🧩 EntityLinker] available:", available);

      setLinkedItems(linked);
      setAvailableItems(available);
      setSelectedIds(linked.map((i) => i.id)); // pré-remplir la sélection avec les éléments déjà liés
    } catch (error) {
      console.error("[❌ EntityLinker] Erreur lors du chargement :", error);
    } finally {
      setLoading(false);
    }
  }
    load();
  }, []);

  // 💾 Sauvegarde des nouvelles liaisons
  const handleSave = async () => {
    setSaving(true);
    await onSave(selectedIds);     // envoie les IDs sélectionnés au backend
    setSaving(false);
  };

  // 🔍 Filtrage local des options disponibles selon le texte saisi
  const filtered = availableItems.filter((item) =>
    item.label.toLowerCase().includes(filter.toLowerCase())
  );

  // 🖱️ Mise à jour des éléments sélectionnés depuis le `select`
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value));
    setSelectedIds(multiple ? values : [values[0]]); // gère select ou multiselect selon la prop
  };

  return (
    <div className="space-y-4 text-sm">
      {/* 🧾 Titre contextuel pour afficher ce qu'on lie à quoi */}
      <h3 className="text-base font-semibold text-indigo-700">
        Lier {targetLabel} à {sourceLabel} #{sourceId}
      </h3>

      {/* ⏳ Loader pendant le fetch initial */}
      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : (
        <>
          {/* 🔍 Champ de recherche/filter */}
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={filterPlaceholder}
            className="border px-2 py-1 rounded w-full"
          />

          {/* 🧠 Sélecteur simple ou multi selon la prop `multiple` */}
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

          {/* 💾 Bouton de sauvegarde des liaisons */}
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
