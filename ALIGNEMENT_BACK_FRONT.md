# Guide d'Implémentation pour l'Alignement Frontend-Backend

## Table des Matières
1. [Jour 1 : Configuration et Alignement des Types](#jour-1--configuration-et-alignement-des-types)
2. [Jour 2 : Implémentation des Services et Formulaires](#jour-2--implémentation-des-services-et-formulaires)
3. [Jour 3 : Intégration et Tests](#jour-3--intégration-et-tests)

## Jour 1 : Configuration et Alignement des Types

### Étape 1 : Correction des Dépendances Frontend

1. **Naviguer vers le dossier frontend**
```bash
cd paie-app/frontend
```

2. **Mettre à jour package.json**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "tailwindcss": "^3.4.0",
    "@tanstack/react-query": "^5.76.1",
    "axios": "^1.6.7",
    "react-hook-form": "^7.56.4",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4"
  }
}
```

3. **Installer les dépendances**
```bash
npm install
```

### Étape 2 : Configuration des Types Partagés

1. **Créer la structure des dossiers**
```bash
mkdir src/types/shared
```

2. **Créer les types pour les employés (`src/types/shared/employee.types.ts`)**
```typescript
export interface Employee {
  id: number;
  userId: number;
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  situationFamiliale: string;
  nombreEnfants: number;
  adresse: string;
  telephone: string;
  email: string;
  dateEmbauche: string;
  categorie: string;
  departement: string;
  poste: string;
  statut: 'ACTIF' | 'INACTIF';
}
```

3. **Créer les types pour la paie (`src/types/shared/payroll.types.ts`)**
```typescript
export interface PayrollElement {
  id: number;
  code: string;
  libelle: string;
  type: 'GAIN' | 'RETENUE';
  methodeCalcul: 'FIXE' | 'POURCENTAGE' | 'FORMULE';
  valeur: number;
  formule?: string;
}

export interface PayrollProfile {
  id: number;
  code: string;
  nom: string;
  description: string;
  elements: PayrollElement[];
  actif: boolean;
}
```

### Étape 3 : Configuration Axios et Services API

1. **Créer la configuration API (`src/services/api/config.ts`)**
```typescript
import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Jour 2 : Implémentation des Services et Formulaires

### Étape 1 : Services API

1. **Créer le service employé (`src/services/api/employee.service.ts`)**
```typescript
import { api } from './config';
import { Employee } from '@/types/shared/employee.types';

export const employeeService = {
  getAll: async () => {
    const response = await api.get<Employee[]>('/employes');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get<Employee>(`/employes/${id}`);
    return response.data;
  },
  
  create: async (employee: Omit<Employee, 'id'>) => {
    const response = await api.post<Employee>('/employes', employee);
    return response.data;
  },
  
  update: async (id: number, employee: Partial<Employee>) => {
    const response = await api.put<Employee>(`/employes/${id}`, employee);
    return response.data;
  },
  
  delete: async (id: number) => {
    await api.delete(`/employes/${id}`);
  }
};
```

2. **Créer le service paie (`src/services/api/payroll.service.ts`)**
```typescript
import { api } from './config';
import { PayrollProfile, PayrollElement } from '@/types/shared/payroll.types';

export const payrollService = {
  // Profils de paie
  getProfiles: async () => {
    const response = await api.get<PayrollProfile[]>('/profils-paie');
    return response.data;
  },
  
  // Éléments de paie
  getElements: async () => {
    const response = await api.get<PayrollElement[]>('/elements-salaire');
    return response.data;
  }
};
```

### Étape 2 : Hooks React Query

1. **Créer le hook employés (`src/hooks/useEmployees.ts`)**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/services/api/employee.service';
import { Employee } from '@/types/shared/employee.types';

export const useEmployees = () => {
  const queryClient = useQueryClient();

  const employees = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAll
  });

  const createEmployee = useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  return {
    employees,
    createEmployee,
    isLoading: employees.isLoading,
    error: employees.error
  };
};
```

### Étape 3 : Formulaires avec Validation

1. **Créer le formulaire employé (`src/components/forms/EmployeeForm.tsx`)**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Employee } from '@/types/shared/employee.types';

const employeeSchema = z.object({
  matricule: z.string().min(1, "Matricule requis"),
  nom: z.string().min(1, "Nom requis"),
  prenom: z.string().min(1, "Prénom requis"),
  email: z.string().email("Email invalide"),
  // ... autres validations
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
}

export const EmployeeForm = ({ initialData, onSubmit }: EmployeeFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Champs du formulaire */}
    </form>
  );
};
```

## Jour 3 : Intégration et Tests

### Étape 1 : Pages et Routes

1. **Mettre à jour les routes (`src/routes/index.tsx`)**
```typescript
import { createBrowserRouter } from 'react-router-dom';
import { EmployeeList } from '@/pages/employee/EmployeeList';
import { EmployeeDetail } from '@/pages/employee/EmployeeDetail';
import { PayrollProfiles } from '@/pages/payroll/PayrollProfiles';

export const router = createBrowserRouter([
  {
    path: '/employees',
    element: <EmployeeList />
  },
  {
    path: '/employees/:id',
    element: <EmployeeDetail />
  },
  {
    path: '/payroll-profiles',
    element: <PayrollProfiles />
  }
]);
```

### Étape 2 : Tests d'Intégration

1. **Créer les tests d'intégration (`src/tests/integration/employee.test.tsx`)**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EmployeeList } from '@/pages/employee/EmployeeList';

describe('Employee Integration Tests', () => {
  const queryClient = new QueryClient();

  it('should load and display employees', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EmployeeList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });
});
```

## Liste de Vérification Finale

### 1. Authentification
- [ ] Gestion des tokens
- [ ] Protection des routes
- [ ] Gestion des sessions

### 2. Gestion des Données
- [ ] Synchronisation backend-frontend
- [ ] Cache React Query
- [ ] Gestion des erreurs

### 3. Validation des Formulaires
- [ ] Schémas de validation
- [ ] Messages d'erreur
- [ ] Validation côté client

### 4. Performance
- [ ] Optimisation des requêtes
- [ ] Temps de chargement
- [ ] Rendu des composants

### 5. Tests
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Tests end-to-end

## Notes Importantes

1. **Avant de Commencer**
   - Assurez-vous que le backend est en cours d'exécution
   - Vérifiez les versions des dépendances
   - Testez la connexion API

2. **Pendant le Développement**
   - Suivez les conventions de code
   - Documentez les changements
   - Testez régulièrement

3. **Après l'Implémentation**
   - Vérifiez tous les points de la liste
   - Testez sur différents navigateurs
   - Validez les performances 