# Modèles et Interfaces Backend-Frontend

## 1. Modèles de Données Partagés

### 1.1 Utilisateurs et Authentification

```typescript
// frontend/src/types/auth.ts
interface User {
  id: number;
  pseudo: string;
  isActive: boolean;
  roles: Role[];
}

interface Role {
  id: number;
  roleName: string;
  permissions: RoleAccesRessource[];
}

interface RoleAccesRessource {
  id: number;
  roleId: number;
  ressourceId: number;
  accessMode: string;
}

// Backend (schemas.py)
class User(BaseModel):
    id: int
    pseudo: Optional[str] = None
    isActive: bool
    roles: List[Role]

class Role(BaseModel):
    id: int
    roleName: str
    permissions: List[RoleAccesRessource]
```

### 1.2 Gestion des Employés

```typescript
// frontend/src/types/employee.ts
interface Employee {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  adresse: string;
  telephone: string;
  email: string;
  dateEmbauche: string;
  categorieId: number;
  categorie?: Categorie;
  contrats?: Contrat[];
}

interface Categorie {
  id: number;
  code: string;
  libelle: string;
  echelons: Echelon[];
}

interface Echelon {
  id: number;
  code: string;
  libelle: string;
  salaireBase: number;
}

// Backend (schemas.py)
class Employee(BaseModel):
    id: int
    matricule: str
    nom: str
    prenom: str
    dateNaissance: date
    lieuNaissance: str
    adresse: str
    telephone: str
    email: str
    dateEmbauche: date
    categorieId: int
    categorie: Optional[Categorie]
    contrats: Optional[List[Contrat]]
```

### 1.3 Gestion de la Paie

```typescript
// frontend/src/types/payroll.ts
interface BulletinPaie {
  id: number;
  employeId: number;
  periode: string;
  dateCalcul: string;
  salaireBrut: number;
  totalRetenues: number;
  salaireNet: number;
  lignes: LigneBulletinSalaire[];
}

interface LigneBulletinSalaire {
  id: number;
  bulletinId: number;
  elementSalaireId: number;
  base: number;
  taux: number;
  montant: number;
  elementSalaire?: ElementSalaire;
}

interface ElementSalaire {
  id: number;
  code: string;
  libelle: string;
  type: TypeElement;
  nature: NatureElement;
  formule?: string;
}

enum TypeElement {
  PRIME = "prime",
  INDEMNITE = "indemnite",
  RETENUE = "retenue",
  COTISATION = "cotisation",
  AVANTAGE = "avantage"
}

enum NatureElement {
  FIXE = "fixe",
  VARIABLE = "variable",
  DERIVE = "dérive"
}

// Backend (schemas.py)
class BulletinPaie(BaseModel):
    id: int
    employeId: int
    periode: str
    dateCalcul: datetime
    salaireBrut: float
    totalRetenues: float
    salaireNet: float
    lignes: List[LigneBulletinSalaire]
```

## 2. Points d'Intégration API

### 2.1 Services Frontend

```typescript
// frontend/src/services/api.ts
class ApiService {
  private baseUrl: string;
  private headers: Headers;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL;
    this.headers = new Headers({
      'Content-Type': 'application/json'
    });
  }

  setAuthToken(token: string) {
    this.headers.set('Authorization', `Bearer ${token}`);
  }

  // Méthodes génériques
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.headers
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return this.handleResponse<T>(response);
  }

  // ... autres méthodes HTTP
}

// Services spécifiques
class EmployeeService extends ApiService {
  async getEmployee(id: number): Promise<Employee> {
    return this.get<Employee>(`/employees/${id}`);
  }

  async calculatePayroll(
    employeeId: number,
    period: string
  ): Promise<BulletinPaie> {
    return this.post<BulletinPaie>('/payroll/calculate', {
      employeeId,
      period
    });
  }
}
```

### 2.2 Routes Backend

```python
# backend/src/routers/employe.py
@router.get("/{id}", response_model=schemas.Employee)
async def get_employee(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    employee = models.Employee.get(id, db)
    if isinstance(employee, JSONResponse):
        return employee
    return employee

# backend/src/routers/bulletin_paie.py
@router.post("/calculate", response_model=schemas.BulletinPaie)
async def calculate_payroll(
    payload: schemas.PayrollCalculateRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(oauth2.get_current_user)
):
    return services.payroll.calculate_payroll(
        db,
        payload.employee_id,
        payload.period
    )
```

## 3. Gestion des Erreurs

### 3.1 Types d'Erreurs Frontend

```typescript
// frontend/src/types/error.ts
interface ApiError {
  code: number;
  message: string;
  details?: Record<string, any>;
}

class CustomError extends Error {
  constructor(
    public code: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
  }
}
```

### 3.2 Gestion Backend

```python
# backend/src/tools.py
class CustomHttpResponse:
    @staticmethod
    def object_exists_400():
        return JSONResponse(
            status_code=400,
            content={"message": "Object already exists"}
        )

    @staticmethod
    def object_not_found_404():
        return JSONResponse(
            status_code=404,
            content={"message": "Object not found"}
        )
```

## 4. Validation des Données

### 4.1 Frontend (avec Zod)

```typescript
// frontend/src/schemas/employee.ts
import { z } from 'zod';

export const employeeSchema = z.object({
  matricule: z.string()
    .regex(/^[A-Z]{2}\d{4}$/, "Format invalide"),
  nom: z.string().min(2),
  prenom: z.string().min(2),
  dateNaissance: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format date invalide"),
  email: z.string().email(),
  categorieId: z.number().positive()
});
```

### 4.2 Backend (avec Pydantic)

```python
# backend/src/schemas.py
class EmployeeCreate(BaseModel):
    matricule: str
    nom: str
    prenom: str
    dateNaissance: date
    email: str
    categorieId: int

    @field_validator('matricule')
    def validate_matricule(cls, v):
        if not re.match(r'^[A-Z]{2}\d{4}$', v):
            raise ValueError('Format de matricule invalide')
        return v
```

## 5. Sécurité et Authentification

### 5.1 Frontend

```typescript
// frontend/src/services/auth.ts
class AuthService extends ApiService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/login', credentials);
    if (response.token) {
      this.setAuthToken(response.token);
      localStorage.setItem('token', response.token);
    }
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.get<User>('/auth/me');
  }
}
```

### 5.2 Backend

```python
# backend/src/oauth2.py
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + \
        timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode,
        settings.token_secret_key,
        algorithm=settings.token_algorithm
    )

# backend/src/routers/auth.py
@router.post("/login")
async def login(
    credentials: schemas.UserLogin,
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, credentials)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
    
    token = create_access_token({
        "id": user.id,
        "roles": [role.id for role in user.roles]
    })
    
    return {"token": token, "user": user}
```
