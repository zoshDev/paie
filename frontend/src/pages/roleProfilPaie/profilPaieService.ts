//import axios from 'axios';
import type { ProfilPaie } from './ProfilPaie';
import type { ElementSalaire } from '../elementSalaire/elementSalaire';
import { safeDelete, safeGet, safePost, safeUpdate } from "@/utils/safeRequest";



export const profilPaieService = {
  //list: () => safeGet<ProfilPaie[]>("/role/get_all_role_element_salaire") ,//axios.get('role/get_all_role_element_salaire'),
  list: () => safeGet<ProfilPaie[]>("/role/get_all_role_element_salaire") ,//axios.get('role/get_all_role_element_salaire'),

  create: (data: ProfilPaie) => safePost('/role', data),
  update: (id: number, data: ProfilPaie) => safeUpdate(`/profils-paie/${id}`, data),
  remove: (id: number) => safeDelete(`/profils-paie/${id}`),

  // ✅ Assigne un rôle à un utilisateur (un seul à la fois)
  assignRoleToUser: (userId: number, roleId: number) => safePost<{ userId: number; roleId: number }, any>(
    '/role/add_role_to_user',
    { userId, roleId }
  ),
  removeRoleFromUser:(roleId: number) => safeDelete(`/role/delete_user_role?${roleId}`),
  // ✅ Récupère les éléments de salaire disponibles
  listElements: () =>  safeGet<ElementSalaire[]>("/element-salaire/get_all_element_salaire"),

  getElementsOfRole: (roleId: number) =>
    safeGet<ElementSalaire>(`/role/get_all_role_element_salaire?role_id=${roleId}`),

  assignElementToRole: (roleId: number, elementSalaireId: number) => 
    safePost<{ roleId: number; elementSalaireId: number }, any>(
    '/role/add_element_salaire_to_role',
    { roleId, elementSalaireId: elementSalaireId }
  ), 
  removeElementFromRole: (roleId: number, elementSalaireId: number) => safeDelete(`/role/delete_element_salaire-to-role/${roleId}/${elementSalaireId}`),
};
