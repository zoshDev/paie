# Services Frontend

Les services frontend gèrent toutes les interactions avec l'API backend et la logique métier côté client.

## 1. Service HTTP de Base

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirection vers la page de connexion
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 2. Service d'Authentification

```typescript
// src/services/authService.ts
import api from './api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  refreshToken: async () => {
    const response = await api.post<AuthResponse>('/auth/refresh-token');
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },

  getCurrentUser: async () => {
    return await api.get('/auth/me');
  }
};
```

## 3. Service des Employés

```typescript
// src/services/employeeService.ts
import api from './api';
import type { Employee, EmployeeCreate, EmployeeUpdate } from '@/types/employee';

export const employeeService = {
  getAll: () => api.get<Employee[]>('/employees'),
  
  getById: (id: number) => api.get<Employee>(`/employees/${id}`),
  
  create: (data: EmployeeCreate) => 
    api.post<Employee>('/employees', data),
  
  update: (id: number, data: EmployeeUpdate) =>
    api.put<Employee>(`/employees/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/employees/${id}`),
  
  bulkDelete: (ids: number[]) =>
    api.post('/employees/bulk-delete', { ids }),
  
  import: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/employees/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  export: () =>
    api.get('/employees/export', {
      responseType: 'blob'
    })
};
```

## 4. Service des Rubriques

```typescript
// src/services/rubriqueService.ts
import api from './api';
import type { Rubrique, RubriqueCreate, RubriqueUpdate } from '@/types/rubrique';

export const rubriqueService = {
  getAll: () => api.get<Rubrique[]>('/rubriques'),
  
  getById: (id: number) => api.get<Rubrique>(`/rubriques/${id}`),
  
  create: (data: RubriqueCreate) =>
    api.post<Rubrique>('/rubriques', data),
  
  update: (id: number, data: RubriqueUpdate) =>
    api.put<Rubrique>(`/rubriques/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/rubriques/${id}`),
    
  calculateAmount: (id: number, baseAmount: number) =>
    api.post<{amount: number}>(`/rubriques/${id}/calculate`, { baseAmount })
};
```

## 5. Service des Fiches de Paie

```typescript
// src/services/payslipService.ts
import api from './api';
import type { FichePaie, FichePaieCreate } from '@/types/fichePaie';

export const payslipService = {
  getAll: () => api.get<FichePaie[]>('/fiches-paie'),
  
  getById: (id: number) => api.get<FichePaie>(`/fiches-paie/${id}`),
  
  generate: (data: FichePaieCreate) =>
    api.post<FichePaie>('/fiches-paie/generate', data),
  
  getByEmployee: (employeeId: number) =>
    api.get<FichePaie[]>(`/fiches-paie/employee/${employeeId}`),
  
  downloadPdf: (id: number) =>
    api.get(`/fiches-paie/${id}/pdf`, {
      responseType: 'blob'
    }),
  
  sendByEmail: (id: number, email: string) =>
    api.post(`/fiches-paie/${id}/send-email`, { email })
};
```

## 6. Service des Catégories

```typescript
// src/services/categorieService.ts
import api from './api';
import type { Categorie, CategorieCreate } from '@/types/categorie';

export const categorieService = {
  list: () => api.get<Categorie[]>('/categories/get_all_categorie'),
  
  create: (data: CategorieCreate) =>
    api.post<Categorie>('/categorie', data),
  
  update: (data: Categorie) =>
    api.put<Categorie>('/categorie', data),
  
  delete: (id: number) =>
    api.delete(`/categorie/${id}`)
};
```

## 7. Service de Configuration

```typescript
// src/services/configService.ts
import api from './api';
import type { AppSettings } from '@/types/settings';

export const configService = {
  getSettings: () => api.get<AppSettings>('/settings'),
  
  updateSettings: (settings: Partial<AppSettings>) =>
    api.put<AppSettings>('/settings', settings),
  
  updateEmailConfig: (config: EmailConfig) =>
    api.put('/settings/email', config),
  
  updateTemplates: (templates: DocumentTemplates) =>
    api.put('/settings/templates', templates),
  
  testEmailConfig: (config: EmailConfig) =>
    api.post('/settings/email/test', config)
};
```

## 8. Service de Calcul

```typescript
// src/services/calculService.ts
import api from './api';
import type { CalculationResult } from '@/types/calculation';

export const calculService = {
  calculateSalary: (employeeId: number, period: string) =>
    api.post<CalculationResult>('/calcul/salary', {
      employeeId,
      period
    }),
  
  simulateRubrique: (rubriqueId: number, params: any) =>
    api.post(`/calcul/simulate-rubrique/${rubriqueId}`, params),
  
  validateFormula: (formula: string) =>
    api.post<{isValid: boolean, error?: string}>('/calcul/validate-formula', {
      formula
    })
};
```

## Utilisation des Services

Les services sont généralement utilisés dans les composants via des hooks personnalisés :

```typescript
// src/hooks/useEmployees.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { employeeService } from '@/services/employeeService';

export function useEmployees() {
  const queryClient = useQueryClient();

  const { data: employees, isLoading } = useQuery(
    'employees',
    employeeService.getAll
  );

  const createMutation = useMutation(
    employeeService.create,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      }
    }
  );

  return {
    employees,
    isLoading,
    createEmployee: createMutation.mutate,
    isCreating: createMutation.isLoading
  };
}
```
