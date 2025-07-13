//import axios from "@/utils/axiosInstance";
import type { RoleProfilPaieFormData } from "@/schemas/profilPaieZod";
import type { RoleProfilPaie } from "@/pages/profilPaie/types";
import { safeDelete, safeGet, safePost, safeUpdate } from "@/utils/safeRequest";

export const roleProfilService = {
  getAll: () => safeGet<RoleProfilPaie[]>('/roles'),
  create: (data: RoleProfilPaieFormData) => safePost<RoleProfilPaieFormData, RoleProfilPaieFormData>('/roles', data),
  update: (id: string, data: RoleProfilPaieFormData) => safeUpdate<RoleProfilPaieFormData, RoleProfilPaieFormData>(`/roles/${id}`, data),
  delete: (id: string) => safeDelete(`/roles/${id}`),
  assignElement: (roleId: string, elementId: string) =>
    safePost(`/role-element-salaire`, { roleId, elementSalaireId: elementId })
};

//delete: (id: number) => safeDelete(`/echelon/${id}`),
// create: (data: CompanyFormData) => safePost<CompanyFormData, CompanyFormData>('/societe', data),
//list: () => safeGet<Echelon>('/echelon'),
//create: (data: EchelonCreateDto) => safePost<EchelonCreateDto, Echelon>('/echelon', data),
//update: (data: Echelon) => safeUpdate<Echelon, Echelon>('/echelon', data),
//delete: (id: number) => safeDelete(`/echelon/${id}`),