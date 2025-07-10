import React, { useState, useMemo, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import TableActions from '../../components/ui/TablesActions';
import AddEditModal from '../../components/ui/AddEditModal';
import ConfirmModal from '../../components/ui/ConfirmModal/ConfirmModal';
import { useCategoriesStore } from '../../stores/categorieStore';

const FILTER_OPTIONS = [
  { label: 'Nom', value: 'nom' },
  { label: 'Description', value: 'description' },
];
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 0]; // 0 = Toutes

export default function CategoriePage() {
  const {
    categories,
    loading,
    addCategory,
    editCategory,
    deleteCategory,
  } = useCategoriesStore();

  const [filterField, setFilterField] = useState('nom');
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDelete, setToDelete] = useState<number | null>(null);

  // Sélection multiple
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Remettre la page à 1 si filtre ou pageSize change
  useEffect(() => { setPage(1); }, [filterField, search, pageSize]);

  // Filtrage dynamique
  const filtered = useMemo(
    () =>
      categories.filter(cat =>
        (cat[filterField] ?? '')
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [categories, filterField, search]
  );

  // Pagination locale
  const paginated = useMemo(() => {
    if (pageSize === 0) return filtered;
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const columns = [
    { header: 'ID', accessor: 'id' }, // Ajout de la colonne ID
    { header: 'Nom', accessor: 'nom' },
    { header: 'Description', accessor: 'description' },
    { header: 'Profils de paie', accessor: (row: any) => row.profils?.map((p: any) => p.nom).join(', ') },
    { header: 'Employés', accessor: 'nbEmployes' },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <TableActions
        onAdd={() => setShowAdd(true)}
        addLabel="Ajouter une catégorie"
        search={search}
        setSearch={setSearch}
        filterField={filterField}
        setFilterField={setFilterField}
        filterOptions={FILTER_OPTIONS}
        pageSize={pageSize}
        setPageSize={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
      />
      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        onEdit={cat => { setEditData(cat); setShowEdit(true); }}
        onDelete={cat => { setToDelete(cat.id); setShowConfirm(true); }}
        selectable
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || pageSize === 0}
          className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Précédent
        </button>
        <span>
          Page {page} / {pageSize === 0 ? 1 : Math.ceil(filtered.length / pageSize) || 1}
        </span>
        <button
          onClick={() => setPage(p => p < Math.ceil(filtered.length / pageSize) ? p + 1 : p)}
          disabled={page >= Math.ceil(filtered.length / pageSize) || pageSize === 0}
          className="px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
      {/* Modal d'ajout */}
      <AddEditModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={addCategory}
        title="Ajouter une catégorie"
      >
        {/* Formulaire d'ajout ici */}
      </AddEditModal>
      {/* Modal d'édition */}
      <AddEditModal
        open={showEdit}
        onClose={() => { setShowEdit(false); setEditData(null); }}
        onSubmit={data => { editCategory(editData.id, data); setShowEdit(false); setEditData(null); }}
        initialData={editData}
        title="Modifier la catégorie"
      >
        {/* Formulaire d'édition ici */}
      </AddEditModal>
      {/* Modal de confirmation */}
      <ConfirmModal
        open={showConfirm}
        title="Confirmer la suppression"
        message="Voulez-vous vraiment supprimer cette catégorie ?"
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onClose={() => setShowConfirm(false)}
        onConfirm={() => { if (toDelete) deleteCategory(toDelete); setShowConfirm(false); }}
        confirmColor="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
}