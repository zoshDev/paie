# Analyse Comparative Frontend vs Backend

## 1. Points de Divergence

### 1.1 Structure des Données
```typescript
// Backend (FastAPI)
class Employee(Base):
    id: int
    user_id: int
    matricule: str
    categorie_id: int
    date_embauche: datetime
    type_contrat: str
    salaire_base: float

// Frontend (React)
interface Employee {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    salary: number;
}

// Problèmes Identifiés
1. Incohérence des noms de champs
2. Types de données non alignés
3. Relations manquantes
4. Validation incomplète
```

### 1.2 Endpoints API vs Services Frontend
```typescript
// Backend Routes
@router.get("/employees/")
@router.get("/employees/{id}")
@router.post("/employees/")
@router.put("/employees/{id}")
@router.delete("/employees/{id}")

// Frontend Services
const employeeService = {
    getAll: () => api.get('/api/employees'),
    getById: (id) => api.get(`/api/employees/${id}`),
    create: (data) => api.post('/api/employees', data),
    update: (id, data) => api.put(`/api/employees/${id}`, data)
};

// Problèmes Identifiés
1. Préfixe API inconsistant
2. Gestion des paramètres de requête
3. Typage des réponses
4. Gestion des erreurs
```

### 1.3 Gestion des Permissions
```typescript
// Backend
class AccessControl:
    def check_permission(user_id: int, resource: str, action: str) -> bool:
        # Logique de vérification des permissions

// Frontend
const usePermissions = () => {
    const permissions = useAuthStore(state => state.permissions);
    return {
        can: (action: string, resource: string) => boolean
    };
};

// Problèmes Identifiés
1. Synchronisation des permissions
2. Granularité des contrôles
3. Mise en cache des permissions
```

## 2. Recommandations d'Alignement

### 2.1 Types et Interfaces
```typescript
// Types Partagés
interface BaseEntity {
    id: number;
    created_at: string;
    updated_at: string;
}

interface Employee extends BaseEntity {
    matricule: string;
    categorie_id: number;
    date_embauche: string;
    type_contrat: ContractType;
    salaire_base: number;
    
    // Relations
    categorie?: Category;
    contrats?: Contract[];
    bulletins?: Payslip[];
}

// Énumérations
enum ContractType {
    CDI = 'CDI',
    CDD = 'CDD',
    STAGE = 'STAGE'
}
```

### 2.2 Services API
```typescript
// Service de Base
class BaseApiService<T extends BaseEntity> {
    constructor(
        protected endpoint: string,
        protected options: ApiOptions = {}
    ) {}

    async getAll(params?: QueryParams): Promise<ApiResponse<T[]>> {
        const response = await api.get(this.endpoint, { params });
        return this.transformResponse(response);
    }

    async getById(id: number): Promise<ApiResponse<T>> {
        const response = await api.get(`${this.endpoint}/${id}`);
        return this.transformResponse(response);
    }

    protected transformResponse<R>(response: any): ApiResponse<R> {
        return {
            data: response.data,
            message: response.message,
            status: response.status
        };
    }
}

// Services Spécifiques
class EmployeeService extends BaseApiService<Employee> {
    constructor() {
        super('/employees');
    }

    async getBulletins(employeeId: number): Promise<Bulletin[]> {
        return this.get(`${employeeId}/bulletins`);
    }

    async calculateSalary(employeeId: number, month: number, year: number): Promise<SalaryCalculation> {
        return this.post(`${employeeId}/calculate`, { month, year });
    }
}
```

### 2.3 Gestion d'État
```typescript
// Store Global
interface RootStore {
    auth: AuthStore;
    employees: EntityStore<Employee>;
    payroll: PayrollStore;
    ui: UIStore;
}

// Store Entité
interface EntityStore<T extends BaseEntity> {
    items: Record<number, T>;
    list: {
        data: number[];
        total: number;
        loading: boolean;
        error: string | null;
    };
    selected: {
        id: number | null;
        loading: boolean;
        error: string | null;
    };
    
    // Actions
    fetch: (params?: QueryParams) => Promise<void>;
    fetchById: (id: number) => Promise<void>;
    create: (data: Partial<T>) => Promise<void>;
    update: (id: number, data: Partial<T>) => Promise<void>;
    delete: (id: number) => Promise<void>;
}
```

## 3. Plan de Migration

### 3.1 Étapes Prioritaires
```typescript
// 1. Standardisation des Types
interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}

interface QueryParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    [key: string]: any;
}

// 2. Mise à Jour des Services
const createApiService = <T extends BaseEntity>(endpoint: string) => {
    return new BaseApiService<T>(endpoint);
};

// 3. Adaptation des Composants
interface DataTableProps<T extends BaseEntity> {
    service: BaseApiService<T>;
    columns: TableColumn<T>[];
    filters?: FilterConfig[];
    actions?: TableAction<T>[];
}
```

### 3.2 Tests de Régression
```typescript
// 1. Tests d'Intégration API
describe('Employee API Integration', () => {
    it('fetches employee with related data', async () => {
        const service = new EmployeeService();
        const employee = await service.getById(1);
        
        expect(employee.categorie).toBeDefined();
        expect(employee.contrats).toBeInstanceOf(Array);
    });
});

// 2. Tests de Composants
describe('EmployeeForm', () => {
    it('handles backend validation errors', async () => {
        const error = {
            status: 400,
            message: 'Validation Error',
            details: {
                matricule: 'Matricule déjà utilisé'
            }
        };
        
        mockApiError(error);
        
        render(<EmployeeForm />);
        fireEvent.click(screen.getByText('Sauvegarder'));
        
        await waitFor(() => {
            expect(screen.getByText('Matricule déjà utilisé')).toBeInTheDocument();
        });
    });
});
```

### 3.3 Documentation des Changements
```markdown
# Guide de Migration

## Changements Majeurs
1. Nouveaux types TypeScript alignés avec le backend
2. Services API standardisés
3. Gestion d'état unifiée
4. Système de permissions cohérent

## Étapes de Migration
1. Mettre à jour les dépendances
2. Adapter les types et interfaces
3. Migrer les services API
4. Mettre à jour les composants
5. Tester l'intégration

## Points d'Attention
- Validation des données
- Gestion des erreurs
- Cache et performance
- Permissions et sécurité
```

## 4. Monitoring et Maintenance

### 4.1 Métriques de Performance
```typescript
interface ApiMetrics {
    endpoint: string;
    method: string;
    duration: number;
    status: number;
    timestamp: string;
}

const trackApiCall = async (
    endpoint: string,
    method: string,
    call: () => Promise<any>
) => {
    const start = performance.now();
    try {
        const result = await call();
        const duration = performance.now() - start;
        
        logMetric({
            endpoint,
            method,
            duration,
            status: result.status,
            timestamp: new Date().toISOString()
        });
        
        return result;
    } catch (error) {
        const duration = performance.now() - start;
        logMetric({
            endpoint,
            method,
            duration,
            status: error.status || 500,
            timestamp: new Date().toISOString()
        });
        throw error;
    }
};
```

### 4.2 Logging et Débogage
```typescript
interface ErrorContext {
    user?: {
        id: number;
        role: string;
    };
    action?: string;
    params?: Record<string, any>;
    stack?: string;
}

const logError = (
    error: Error,
    context: ErrorContext
) => {
    const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.message,
        type: error.name,
        context,
        environment: process.env.NODE_ENV
    };
    
    // Envoi au service de logging
    api.post('/logs/error', errorLog);
    
    // Notification développeur si critique
    if (error.name === 'ApiError' && error.status >= 500) {
        notifyDevelopers(errorLog);
    }
};
``` 