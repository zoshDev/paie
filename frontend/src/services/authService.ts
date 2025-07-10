// src/services/authService.ts
import { api } from './api/config'; // Axios instance configurée avec le token et interceptors
import type{ LoginFormData } from '../schemas/auth/login.schema';
//import {axiosInstance} from '../lib/axios';

// Tu peux adapter ces types selon le backend
interface AuthResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
}

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {

    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    const response = await api.post<AuthResponse>('/login', formData);
    return response.data;
  },

  // Optionnel : si tu veux gérer le refresh token plus tard
  //refreshAuth: async (): Promise<AuthResponse> => {
  //  const response = await api.post<AuthResponse>('/refresh');
  //  return response.data;
  //}
};


/*export async function refreshAuth(){
  const response = await axiosInstance.post('/refresh', {}

  );
  return response.data;
}*/


