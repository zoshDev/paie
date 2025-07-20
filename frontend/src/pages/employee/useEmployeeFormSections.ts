// src/hooks/useEmployeeFormSections.ts
import { useEffect, useState } from "react";
import { companyService } from "@/services/companyService";
import { categorieEchelonService } from "@/services/categorieEchelonService";
import { profilPaieService } from "@/pages/roleProfilPaie/profilPaieService";
import { getEmployeeFormSections } from "@/schemas/employee/employee.schema"; // ton générateur de sections

import type { FormSection } from "@/components/form/types";
import type { RoleProfilPaie } from "../profilPaie/types";

export function useEmployeeFormSections() {
  const [sections, setSections] = useState<FormSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [companies, categories, roles] = await Promise.all([
          companyService.list(),
          categorieEchelonService.list(),
          profilPaieService.list()
        ]);

        const companyOptions = companies.map((s) => ({
          label: s.nom,
          value: s.id
        }));

        const categorieOptions = categories.map((c) => ({
          label: c.id, // a revoir si c'est bien l'id ou un autre champ
          value: c.id
        }));

        const roleOptions = roles.map((r:RoleProfilPaie) => ({
          label: r.roleName,
          value: Number(r.id)
        }));

        setSections(getEmployeeFormSections({
          companyOptions,
          categorieEchelonOptions: categorieOptions,
          roleOptions
        }));
      } catch (error) {
        console.error("[useEmployeeFormSections] Échec du chargement des options", error);
        setSections(getEmployeeFormSections({
          companyOptions: [],
          categorieEchelonOptions: [],
          roleOptions: []
        }));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { sections, loading };
}
