import { safePost, safeUpdate, safeGet, safeDelete } from '@/utils/safeRequest';
import type { Contract } from './contract';
import type { ContractFormData } from './contractFormSections'

export const contractService = {
  // 📄 Créer un contrat
  create: (data: ContractFormData) =>
    safePost<ContractFormData, Contract>('/contrats', data),

  // 🔍 Récupérer le contrat d'un employé
  getByEmployeId: (employeId: string | number) =>
    safeGet<Contract>(`/contrats/by-employe/${employeId}`),

  // ✏️ Mettre à jour un contrat
  update: (id: string | number, data: ContractFormData) =>
    safeUpdate<ContractFormData, Contract>(`/contrats/${id}`, data),

  // ❌ Supprimer un contrat
  delete: (id: string | number) =>
    safeDelete(`/contrats/${id}`),
};
