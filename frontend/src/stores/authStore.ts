import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import {jwtDecode} from 'jwt-decode';
//import { authService } from '../services/authService';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  role: Role[];
  name?: string;
  phoneNumber: string;
  pseudo: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  refreshToken: string | null;

  login: (token: string, user?: User) => void;
  logout: () => void;
  isTokenExpired: () => boolean;
  refreshSession?: () => Promise<void>;
}

interface JWTPayload {
  exp: number;
  iat?: number;
  sub?: string;
  role?: string;
  name: string;
  email: string;
  phoneNumber: string;
  pseudo: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      refreshToken: null,

      isTokenExpired: () => {
        const token = localStorage.getItem('access_token');
        if (!token) return true;
        try {
          const decodedToken = jwtDecode<JWTPayload>(token);
          return !!decodedToken.exp && decodedToken.exp < Math.floor(Date.now() / 1000);
        } catch (error) {
          console.error('Erreur lors du décodage du token:', error);
          return true;
        }
      },

      login: (token) => {
        try{
          const payload = jwtDecode<JWTPayload>(token);
          console.log('payload', payload);
          const user = {
            id: Number(payload.sub),
            email: payload.email,
            role: payload.role,
            nom: payload.name,
            phoneNumber: payload.phoneNumber,
            pseudo: payload.pseudo,
          };
          
        toast.success(`Connexion réussie ! Bienvenue ${user.pseudo} `);

        set({
          token,
          isAuthenticated: true,
          user: user ?? null,
        });
        localStorage.setItem('access_token', token);
      } catch (error) {
        console.error('[AuthStore] Erreur de décodage du token :', error);
        toast.error('❌ Token invalide. Échec de la connexion.');
      }
    },

      logout: () => {
        toast('🔒 Vous êtes déconnecté.');
        set({
          token: null,
          isAuthenticated: false,
          user: null,
          refreshToken: null,
        });
        localStorage.removeItem('access_token');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
