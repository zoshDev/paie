import React from "react";
import DataTable from "../../components/table/DataTable";
import BulkActionsBar from "../../components/ui/BulkActionsBar";
import { TrashIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import type { RoleProfilPaie } from "./types";
import {profilPaieColumns} from './columns'

interface ProfilPaieTableProps {
  profilsPaie: RoleProfilPaie[];
  selectedIds: string[];
  toggleSelectedId: (id: string) => void;
  toggleAllSelected: () => void;
  clearSelection: () => void;
  isAllSelected: boolean;
  onView: (profil: RoleProfilPaie) => void;
  onEdit: (profil: RoleProfilPaie) => void;
  onDelete: (profil: RoleProfilPaie) => void;
  onDuplicate: (profil: RoleProfilPaie) => void;
  onBulkDelete: () => void;
}

const columns = [
  { accessorKey: "roleName", header: "Nom du Profil" },
  { accessorKey: "categorie", header: "Catégorie" },
  { accessorKey: "description", header: "Description" }
];

const ProfilPaieTable: React.FC<ProfilPaieTableProps> = ({
  profilsPaie,
  selectedIds,
  toggleSelectedId,
  toggleAllSelected,
  clearSelection,
  isAllSelected,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onBulkDelete
}) => {
  return (
    <>
      {selectedIds.length > 0 && (
        <div className="flex justify-end mb-4">
          <BulkActionsBar
            count={selectedIds.length}
            onClearSelection={clearSelection}
            actions={[
              {
                label: "Supprimer",
                icon: <TrashIcon className="w-4 h-4" />,
                onClick: onBulkDelete,
                className: "text-red-600 hover:bg-red-50"
              }
            ]}
          />
        </div>
      )}

      <DataTable
        data={profilsPaie}
        columns={columns}
        selectedIds={selectedIds}
        onToggleSelectedId={toggleSelectedId}
        onToggleAllSelected={toggleAllSelected}
        isAllSelected={isAllSelected}
        onClearSelection={clearSelection}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onConfigure={onDuplicate}
        configureIcon={<DocumentDuplicateIcon className="w-5 h-5" />}
        configureTitle="Dupliquer le profil"
        showConfigure={true}
        bodyBackgroundIllustration={
          <div className="text-[120px] text-yellow-100">
            🧾
          </div>
        }
      />
    </>
  );
};

export default ProfilPaieTable;
