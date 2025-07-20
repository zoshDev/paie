import { useState } from "react";
import { EntityLinker } from "@/utils/EntityLinker";
import type { ProfilPaie } from "@/pages/roleProfilPaie/ProfilPaie";
import { profilPaieService } from "@/pages/roleProfilPaie/profilPaieService";
import { employeService } from "@/services/employeeService";

//type Item = { id: number; label: string };

export function BulkLinkerPanel({ sourceId }: { sourceId: number }) {
  const [linkType, setLinkType] = useState<"profil" | "element" | null>(null);

  const config = {
    profil: {
      label: "Profil(s) de paie",
      fetchLinked: () =>
        employeService.getRole(sourceId).then((list) =>
          (list as ProfilPaie[]).map((r) => ({ id: Number(r.id), label: r.roleName }))
        ),
      fetchAvailable: () =>
        profilPaieService.list().then((list) =>{
          console.log("[🔍 fetchAvailable PROFIL]", list);
          return (list as ProfilPaie[]).map((r) => ({ id: Number(r.id), label: r.roleName }))
        ;}),
      onSave: async (ids: number[]) => {
        for (const id of ids) {
          await profilPaieService.assignRoleToUser(sourceId, id);
        }
      },
    },
    element: {
      label: "Éléments de salaire",
      fetchLinked: () =>
        profilPaieService.getElementsOfRole(sourceId).then((list) =>
          (list as any[]).map((e) => ({ id: Number(e.id), label: e.libelle }))
        ),
      fetchAvailable: () =>
        profilPaieService.listElements().then((list) =>
          (list as any[]).map((e) => ({ id: Number(e.id), label: e.libelle }))
        ),
      onSave: async (ids: number[]) => {
        for (const id of ids) {
          await profilPaieService.assignElementToRole(sourceId, id);
        }
      },
    },
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
          sourceLabel={linkType === "profil" ? "Utilisateur" : "Rôle"}
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
