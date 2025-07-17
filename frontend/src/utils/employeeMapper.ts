import type { RawEmployee } from "@/pages/employee/rawEmployee";
import type { Employee } from  '@/pages/employee/types';

export const mapRawToEmployee = (raw: RawEmployee): Employee => {
  return {
    id: String(raw.id),
    name: raw.name,
    matricule: raw.matricule,
    nationalite: raw.nationalite,
    isActive: raw.isActive,
    societeId: raw.societeId,
    categorieEchelonId: raw.categorieEchelonId,
    //Nom: raw.name,
    // autres mappings conditionnels…
  };
};
