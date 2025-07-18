import { api } from './api/config';
import { toast } from 'react-hot-toast';
import type { Societe } from '@/pages/company/types';
import type { CompanyFormData } from '@/schemas/companyZodSchema';
import { safePost, safeUpdate, safeDelete, safeGet  } from '@/utils/safeRequest';

export const companyService = {
  // companyService.ts
async list() {
  try {
    const response = await api.get('societe/get_all_societe');
    console.log('[📦 Axios Success]', response);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    if (error.response) {
      console.error('[🛑 Axios Error Response]', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });

      const raw = error.response.data;

      const isPydanticError =
        typeof raw === 'object' &&
        raw !== null &&
        'detail' in raw &&
        Array.isArray(raw.detail);

      if (isPydanticError) {
        console.warn('[⚠️] Erreur de validation Pydantic interceptée :', raw.detail);
        return [];
      }
    } else {
      console.error('[🚫 Axios Critical Failure]', error.message || error);
    }

    handleCompanyError(error, 'chargement des sociétés');
    return [];
  }
},

  create: (data: CompanyFormData) => safePost<CompanyFormData, CompanyFormData>('/societe', data),

  /*async create(data: CompanyFormData) {
    try {
      const response = await api.post('/societe', data);
      toast.success('Société créée ✅');
      return response.data;  
    } catch (error) {
      handleCompanyError(error, 'création'); 
      throw error;
    }
  },*/
  update: (data: CompanyFormData, id: string) =>
    safeUpdate<CompanyFormData, Societe>(`/societe/${id}`, data),

  /*async update(id: string, data: CompanyFormData) {
    try {
      const response = await api.put(`/societe/${id}`, data);
      toast.success('Société mise à jour ✨');
      return response.data;
    } catch (error) {
      handleCompanyError(error, 'mise à jour');
      throw error;
    }
  },*/

    delete: (id: string) => safeDelete(`/societe/${id}`),
  /*async delete(id: string) {
    try {
      await api.delete(`/societe/${id}`);
      toast.success('Société supprimée 🗑️');
    } catch (error) {
      handleCompanyError(error, 'suppression');
      throw error;
    }
  },*/

   get: (id: string) => safeGet<Societe>(`/societe/${id}`),

  async bulkDelete(ids: string[]) {
    try {
      await api.post('/societe/delete-multiple', { ids });
      toast.success(`${ids.length} sociétés supprimées`);
    } catch (error) {
      handleCompanyError(error, 'suppression multiple');
      throw error;
    }
  }
};

function handleCompanyError(error: unknown, action: string) {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as any).code;
    if (code === 'ERR_NETWORK') {
      toast.error("Impossible de contacter le serveur 🔌");
      return;
    }
  }

  const message =
    (error as any)?.response?.data?.detail ||
    `Erreur lors de la ${action} ❌`;
  toast.error(message);
}
