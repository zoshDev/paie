import { safePost, safeUpdate, safeGet, safeDelete } from '@/utils/safeRequest';
import type { Contract } from './contract';
import type { ContractFormData } from './contractFormSections'

export const contractService = {
  // 📄 Créer un contrat
  create: (data: ContractFormData) =>
    safePost<ContractFormData, Contract>('/contrat', data),

  // 🔍 Récupérer le contrat d'un employé
  getByEmployeId: (employeId: string | number) =>
    safeGet<Contract>(`/contrat/${employeId}`),

  // ✏️ Mettre à jour un contrat
  update: (id: string | number, data: ContractFormData) =>
    safeUpdate<ContractFormData, Contract>(`/contrat/${id}`, data),

  // ❌ Supprimer un contrat
  delete: (id: string | number) =>
    safeDelete(`/contrat/${id}`),
};
