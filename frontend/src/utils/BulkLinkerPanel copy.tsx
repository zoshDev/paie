import { useState } from "react"; // <— manquant ou cassé
import { employeService} from "@/services/employeeService";
import { EntityLinker } from "@/utils/EntityLinker";
import type { ProfilPaie } from "@/pages/roleProfilPaie/ProfilPaie";
import  { profilPaieService } from "@/pages/roleProfilPaie/profilPaieService";

export function BulkLinkerPanel({ sourceId }: { sourceId: number }) {
  const [linkType, setLinkType] = useState<"profil" | "element" | null>(null);

  const config = {
    profil: {
      label: "Profil(s) de paie",
      //fetchLinked: () => employeService.getRole(sourceId),
      fetchLinked: () =>
        employeService.getRole(sourceId).then((list) =>
            (list as ProfilPaie[]).map((r) => ({ id: Number(r.id), label: r.roleName }))
        ),
      //fetchAvailable: () => profilPaieService.list(),
      fetchAvailable: () =>
        profilPaieService.list().then((list) =>
            (list as ProfilPaie[]).map((r) => ({ id: Number(r.id), label: r.roleName }))
        ),
      //onSave: (ids: number[]) => profilPaieService.assignRoleToUser(userId, ids),
      onSave: async (ids: number[]) => {
        for (const id of ids) {
            await profilPaieService.assignElementToRole(sourceId, id); // sourceId = roleId ici
        }
}
    },
    element: {
      label: "Éléments de salaire",
      //fetchLinked: () => profilPaieService.getElementsOfRole(sourceId),
      fetchLinked: () =>
        profilPaieService.getElementsOfRole(sourceId).then((list) =>
            list.map((e) => ({ id: e.id, label: e.libelle }))
        ),
      //fetchAvailable: () => profilPaieService.list(),
      fetchAvailable: () =>
        profilPaieService.listElements().then((list) =>
            list.map((e) => ({ id: e.id, label: e.libelle }))
        ),
      onSave: async (ids: number[]) => {
        for (const id of ids) {
          await profilPaieService.assignElementToRole(sourceId, id);
        }
      },
      //onSave: (ids: number[]) => profilPaieService.assignElementToRole(sourceId, ids),
    }
  };

  return (
    <div className="border p-4 bg-white rounded shadow space-y-4">
      {!linkType ? (
        <>
          <h3 className="text-sm font-semibold text-gray-700">Choisir le type de liaison</h3>
          <div className="flex gap-2">
            <button onClick={() => setLinkType("profil")} className="px-2 py-1 border rounded">
              Lier à un ou des profils
            </button>
            <button onClick={() => setLinkType("element")} className="px-2 py-1 border rounded">
              Ajouter des éléments de salaire
            </button>
          </div>
        </>
      ) : (
        <EntityLinker
          sourceId={sourceId}
          sourceLabel="Employé"
          targetLabel={config[linkType].label}
          fetchLinked={config[linkType].fetchLinked}
          fetchAvailable={config[linkType].fetchAvailable}
          onSave={config[linkType].onSave}
          multiple={true}
        />
      )}
    </div>
  );
}
