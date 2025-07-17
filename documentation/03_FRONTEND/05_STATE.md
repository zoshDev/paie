# Gestion d'État Frontend

Ce document décrit l'architecture de gestion d'état de l'application frontend.

## 1. Contexte d'Authentification

```typescript
// src/contexts/AuthContext.tsx

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem('token')
  });

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setState({
      user: response.user,
      isAuthenticated: true,
      token: response.access_token
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({
      user: null,
      isAuthenticated: false,
      token: null
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 2. Hooks de Gestion des Données

### 2.1 Hook Employés

```typescript
// src/hooks/useEmployees.ts

interface UseEmployeesOptions {
  page?: number;
  pageSize?: number;
  filters?: EmployeeFilters;
  sort?: SortParams;
}

export function useEmployees(options: UseEmployeesOptions = {}) {
  const queryClient = useQueryClient();
  const { page = 1, pageSize = 10, filters, sort } = options;

  const queryKey = ['employees', { page, pageSize, filters, sort }];

  const { data, isLoading, error } = useQuery(
    queryKey,
    () => employeeService.getAll({ page, pageSize, filters, sort })
  );

  const createMutation = useMutation(
    employeeService.create,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      }
    }
  );

  const updateMutation = useMutation(
    employeeService.update,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      }
    }
  );

  const deleteMutation = useMutation(
    employeeService.delete,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      }
    }
  );

  return {
    employees: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    createEmployee: createMutation.mutate,
    updateEmployee: updateMutation.mutate,
    deleteEmployee: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading
  };
}
```

### 2.2 Hook Rubriques

```typescript
// src/hooks/useRubriques.ts

export function useRubriques() {
  const queryClient = useQueryClient();

  const { data: rubriques, isLoading } = useQuery(
    'rubriques',
    rubriqueService.getAll
  );

  const createMutation = useMutation(
    rubriqueService.create,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rubriques');
      }
    }
  );

  const updateMutation = useMutation(
    rubriqueService.update,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rubriques');
      }
    }
  );

  return {
    rubriques: rubriques ?? [],
    isLoading,
    createRubrique: createMutation.mutate,
    updateRubrique: updateMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading
  };
}
```

## 3. Gestion d'État des Formulaires

### 3.1 Hook de Formulaire Générique

```typescript
// src/hooks/useForm.ts

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: any;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const validate = useCallback(() => {
    if (!validationSchema) return true;
    try {
      validationSchema.validateSync(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const validationErrors: Record<string, string> = {};
      error.inner.forEach((err: any) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
      return false;
    }
  }, [values, validationSchema]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues
  };
}
```

### 3.2 Hook de Modal

```typescript
// src/hooks/useModal.ts

interface UseModalOptions {
  onClose?: () => void;
}

export function useModal(options: UseModalOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const open = useCallback((modalData?: any) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
    options.onClose?.();
  }, [options]);

  return {
    isOpen,
    data,
    open,
    close
  };
}
```

## 4. Configuration du Client React Query

```typescript
// src/config/queryClient.ts

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Configuration des mutations par défaut
const mutations = {
  retry: 1,
  onError: (error: any) => {
    // Gestion globale des erreurs de mutation
    toast.error(error.message);
  },
};

queryClient.setMutationDefaults(['create', 'update', 'delete'], {
  ...mutations,
});
```

## 5. Gestion d'État Globale

```typescript
// src/store/index.ts

interface AppState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  notifications: Notification[];
}

const initialState: AppState = {
  theme: 'light',
  sidebarCollapsed: false,
  notifications: []
};

export const useStore = create<AppState>((set) => ({
  ...initialState,
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  addNotification: (notification: Notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification]
    })),
  removeNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }))
}));
```

## 6. Persistance des Données

```typescript
// src/utils/storage.ts

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  }
};
```
