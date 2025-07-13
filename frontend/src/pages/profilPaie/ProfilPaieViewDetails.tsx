import React from "react";
import type { RoleProfilPaie } from "./types";

interface ViewDetailsProps {
  profil: RoleProfilPaie | null;
}

const ProfilPaieViewDetails: React.FC<ViewDetailsProps> = ({ profil }) => {
  if (!profil) return null;

  return (
    <div className="space-y-6 text-sm text-gray-700">
      {/* Infos principales */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Nom du Profil</p>
          <p>{profil.roleName}</p>
        </div>
        <div>
          <p className="font-semibold">Catégorie</p>
          <p>{profil.categorie}</p>
        </div>
        <div>
          <p className="font-semibold">Description</p>
          <p>{profil.description || "-"}</p>
        </div>
      </div>

      {/* Rubriques associées */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Rubriques associées ({profil.elements.length})
        </h3>

        {profil.elements.length > 0 ? (
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase font-medium">
                <tr>
                  <th className="px-4 py-2">Ordre</th>
                  <th className="px-4 py-2">Code</th>
                  <th className="px-4 py-2">Libellé</th>
                  <th className="px-4 py-2">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profil.elements.map((elmnt) => (
                  <tr key={elmnt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{elmnt.ordre}</td>
                    <td className="px-4 py-2 font-medium">{elmnt.code}</td>
                    <td className="px-4 py-2">{elmnt.libelle}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          elmnt.nature === "salaire"
                            ? "bg-blue-100 text-blue-800"
                            : elmnt.nature === "gain"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {elmnt.type_element}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm italic text-gray-500">
            Aucune rubrique associée
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfilPaieViewDetails;
