# Contexte Frontend - Application de Paie

## Architecture Technique

### Stack Technologique
- **Framework**: React avec TypeScript
- **Gestion d'État**: 
  - Zustand pour l'état global
  - React Query pour l'état serveur
- **Routage**: React Router v6
- **Formulaires**: React Hook Form avec Zod
- **Styling**: Tailwind CSS
- **Tests**: Jest et React Testing Library
- **Build**: Vite
- **API**: Axios

### Structure du Projet
```
frontend/
├── src/
│   ├── assets/          # Ressources statiques
│   ├── components/      # Composants réutilisables
│   │   ├── auth/       # Composants d'authentification
│   │   ├── common/     # Composants génériques
│   │   ├── form/       # Composants de formulaire
│   │   ├── layout/     # Composants de mise en page
│   │   ├── table/      # Composants de tableau
│   │   └── ui/         # Composants UI de base
│   ├── contexts/       # Contextes React
│   ├── hooks/          # Hooks personnalisés
│   ├── pages/          # Pages de l'application
│   ├── services/       # Services API
│   ├── stores/         # Stores Zustand
│   └── utils/          # Utilitaires
```

## Composants Principaux

### 1. Composants de Base
```typescript
// Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Input.tsx
interface InputProps {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password';
  error?: string;
  register: UseFormRegister<any>;
}
```

### 2. Composants de Formulaire
```typescript
// Form.tsx
interface FormProps<T> {
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  validationSchema: ZodSchema;
  children: React.ReactNode;
}

// FormField.tsx
interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}
```

### 3. Composants de Table
```typescript
// DataTable.tsx
interface DataTableProps<T> {
  data: T[];
  columns: Column[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (row: T) => void;
}
```

## Gestion d'État

### 1. Stores Zustand
```typescript
// authStore.ts
interface AuthStore {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  login: async (credentials) => {
    const response = await authService.login(credentials);
    set({ user: response.user, token: response.token });
  },
  logout: () => set({ user: null, token: null })
}));
```

### 2. React Query
```typescript
// hooks/useEmployees.ts
export const useEmployees = () => {
  const queryClient = useQueryClient();

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAll
  });

  const createMutation = useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  return {
    employees,
    isLoading,
    createEmployee: createMutation.mutate
  };
};
```

## Services API

### Configuration Axios
```typescript
// services/api/config.ts
import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
```

### Services Métier
```typescript
// services/employeeService.ts
export const employeeService = {
  getAll: async () => {
    const response = await api.get<Employee[]>('/employes');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get<Employee>(`/employes/${id}`);
    return response.data;
  },
  
  create: async (employee: CreateEmployeeDto) => {
    const response = await api.post<Employee>('/employes', employee);
    return response.data;
  }
};
```

## Validation et Formulaires

### Schémas de Validation
```typescript
// schemas/employee.schema.ts
import { z } from 'zod';

export const employeeSchema = z.object({
  matricule: z.string().min(1, "Matricule requis"),
  nom: z.string().min(1, "Nom requis"),
  prenom: z.string().min(1, "Prénom requis"),
  email: z.string().email("Email invalide"),
  dateNaissance: z.string(),
  telephone: z.string(),
  adresse: z.string(),
  departement: z.string(),
  poste: z.string()
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
```

### Hooks de Formulaire
```typescript
// hooks/useForm.ts
export const useEmployeeForm = (initialData?: Partial<Employee>) => {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      await employeeService.create(data);
      toast.success('Employé créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  return { form, onSubmit };
};
```

## Gestion des Routes

### Configuration
```typescript
// routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'employees',
        children: [
          {
            index: true,
            element: <EmployeeList />
          },
          {
            path: ':id',
            element: <EmployeeDetail />
          }
        ]
      }
    ]
  }
]);
```

### Protection des Routes
```typescript
// components/auth/PrivateRoute.tsx
export const PrivateRoute = () => {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <Outlet />;
};
```

## Gestion des Erreurs

### Composant Toast
```typescript
// components/ui/Toast/ToastProvider.tsx
export const ToastProvider: React.FC = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff'
          }
        }}
      />
    </>
  );
};
```

### Gestion Globale des Erreurs
```typescript
// utils/errorHandler.ts
export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || 'Une erreur est survenue';
    toast.error(message);
  } else {
    toast.error('Une erreur inattendue est survenue');
  }
};
```

## Tests

### Configuration Jest
```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### Exemples de Tests
```typescript
// components/__tests__/EmployeeForm.test.tsx
describe('EmployeeForm', () => {
  it('should submit form with valid data', async () => {
    const onSubmit = vi.mock();
    render(<EmployeeForm onSubmit={onSubmit} />);
    
    await userEvent.type(screen.getByLabelText(/nom/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      nom: 'John Doe',
      email: 'john@example.com'
    });
  });
});
```

## Optimisations

### Mémoisation
```typescript
// components/EmployeeList.tsx
const MemoizedEmployeeRow = memo(EmployeeRow);

export const EmployeeList = () => {
  const { data } = useEmployees();
  
  return (
    <div>
      {data?.map(employee => (
        <MemoizedEmployeeRow
          key={employee.id}
          employee={employee}
        />
      ))}
    </div>
  );
};
```

### Code Splitting
```typescript
// routes/index.tsx
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const EmployeeList = lazy(() => import('@/pages/employee/EmployeeList'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />
      }
    ]
  }
]);
```

## Environnement et Configuration

### Variables d'Environnement
```typescript
// .env
VITE_API_URL=http://localhost:8000/api
VITE_APP_TITLE=Application de Paie
VITE_APP_VERSION=1.0.0
```

### Configuration Vite
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
});
``` 