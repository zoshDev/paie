// 📦 AssignmentModal.tsx
import EntityModals from "@/components/ui/Modal/EntityModal";
import { EntityLinker } from "@/utils/EntityLinker";
import { profilPaieService } from "@/pages/roleProfilPaie/profilPaieService";
import type { RawEmployee } from "@/pages/employee/rawEmployee";
import { useState } from "react";
import { toEntity } from "@/utils/transformers";
import type { ProfilPaie } from "@/pages/roleProfilPaie/ProfilPaie";
import type { ElementSalaire } from "../profilPaie/types";

type Props = {
  employee: RawEmployee;
  onClose: () => void;
};

export default function AssignmentModal({ employee, onClose }: Props) {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  return (
    <EntityModals
      mode="view"
      //entity={employee}
      entity={employee ? toEntity(employee) : null}
      selectedIds={[]}
      onClose={onClose}
      renderView={() => (
        <div className="space-y-6">
          {/* 🔹 Section 1 — Assignation des rôles à un employé */}
          <div>
            <h3 className="font-semibold text-indigo-700">Assignation de rôles</h3>
            <EntityLinker
              sourceId={employee.id}
              sourceLabel="Utilisateur"
              targetLabel="Rôle"
              fetchLinked={() => Promise.resolve([])} // 🔧 Endpoints à prévoir ou enrichir
              fetchAvailable={() =>
                profilPaieService.list().then((roles) =>
                    
                (roles as ProfilPaie[]).map((r) => ({
                    id: Number(r.id),
                    label: r.roleName
                }))
                )
              }
              onSave={async (ids) => {
                for (const id of ids) {
                  await profilPaieService.assignRoleToUser(employee.id, id);
                }
              }}
              multiple={true}
            />
          </div>

          {/* 🔸 Section 2 — Assignation d’éléments à un rôle sélectionné */}
          <div className="space-y-2">
            <h3 className="font-semibold text-indigo-700">Assignation d’éléments à un rôle</h3>
            <select
              onChange={(e) => setSelectedRoleId(Number(e.target.value))}
              value={selectedRoleId ?? ""}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">Sélectionner un rôle</option>
              {employee.roleId?.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.roleName}
                </option>
              ))}
            </select>

            {selectedRoleId && (
              <EntityLinker
                sourceId={selectedRoleId}
                sourceLabel="Rôle"
                targetLabel="Élément de salaire"
                fetchLinked={async () =>
                  Promise.resolve([
                    { id: 1, label: "Prime mensuelle" },
                    { id: 2, label: "Avantage logement" },
                  ])
                } // 🔧 Fallback mock ici
                fetchAvailable={() =>
                    profilPaieService.listElements().then((list) =>
                (list as ElementSalaire[]).map((r) => ({
                    id: Number(r.id),
                    label: r.libelle
                }))
                )
                }
                onSave={async (ids) => {
                  for (const id of ids) {
                    await profilPaieService.assignElementToRole(selectedRoleId, id);
                  }
                }}
                multiple={true}
              />
            )}
          </div>
        </div>
      )}
    />
  );
}
