//import { axiosInstance } from "@/lib/axios";
import { safeDelete, safeGet, safeUpdate, safePost } from "@/utils/safeRequest";
import type { VariableFormValues } from "./variable.zod";

export interface Variable {
  id: number;
  nom: string;
  description?: string;
  valeur: string;
  societeId: number;
  typeVariable: "Calcul" | "Test" | "Intevalle" | "Valeur";
  code: number;
  formule?: string;
  condition?: Record<string, unknown>;
  intervalle?: Record<string, unknown>;
}

export const variableService = {
  getAll:() => safeGet<Variable[]>('/variable/get_all_variable'),
  /*getAll: async (): Promise<Variable[]> => {
    const { data } = await axiosInstance.get("/variable/get_all_variable");
    return data;
  },*/
  create: (data: VariableFormValues) => safePost<VariableFormValues, Variable>('/variable', data),
  /*create: async (payload: Partial<Variable>) => {
    const { data } = await axiosInstance.post("/variable", payload);
    return data;
  },*/
  update: (id: number, data: Partial<Variable>) => safeUpdate<Partial<Variable>, Variable>(`/variable/${id}`, data),
  /*update: async (id: number, payload: Partial<Variable>) => {
    const { data } = await axiosInstance.put(`/variable/${id}`, payload);
    return data;
  },*/
  delete: (id: number) => safeDelete(`/variable/${id}`),
  /*    
  delete: async (id: number) => {
    await axiosInstance.delete(`/variable/${id}`);
  }*/
  getById: (id: number) => safeGet<Variable>(`/variable/${id}`),
  /*  getById: async (id: number): Promise<Variable> => {
    const { data } = await axiosInstance.get(`/variable/${id}`);
    return data;
  },*/
  getBySocieteId: (societeId: number) => safeGet<Variable[]>(`/variable/societe/${societeId}`),
  /*getBySocieteId: async (societeId: number): Promise<Variable[]> => {
    const { data }  = await axiosInstance.get(`/variable/societe/${societeId}`);
    return data;
  },*/
};

