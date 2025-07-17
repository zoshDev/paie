# Routes API Backend

## Structure des Routes

Les routes API sont organisées par domaine fonctionnel avec FastAPI.

## 1. Authentication
```python
@router.post("/login")
async def login(user_credentials: OAuth2PasswordRequestForm):
    """
    Route de connexion pour obtenir un token JWT
    """
    pass

@router.post("/refresh-token")
async def refresh_token(current_token: str):
    """
    Rafraîchir un token JWT existant
    """
    pass
```

## 2. Employés

### Routes principales
```python
@router.get("/employees/", response_model=List[Employee])
async def get_employees():
    """Liste tous les employés"""
    pass

@router.get("/employees/{employee_id}", response_model=Employee)
async def get_employee(employee_id: int):
    """Récupère un employé par son ID"""
    pass

@router.post("/employees/", response_model=Employee)
async def create_employee(employee: EmployeeCreate):
    """Crée un nouvel employé"""
    pass

@router.put("/employees/{employee_id}", response_model=Employee)
async def update_employee(employee_id: int, employee: EmployeeUpdate):
    """Met à jour un employé"""
    pass

@router.delete("/employees/{employee_id}")
async def delete_employee(employee_id: int):
    """Supprime un employé"""
    pass
```

## 3. Catégories et Échelons

### Catégories
```python
@router.get("/categories/", response_model=List[Categorie])
async def get_categories():
    """Liste toutes les catégories"""
    pass

@router.post("/categories/", response_model=Categorie)
async def create_category(category: CategorieCreate):
    """Crée une nouvelle catégorie"""
    pass
```

### Échelons
```python
@router.get("/echelons/", response_model=List[Echelon])
async def get_echelons():
    """Liste tous les échelons"""
    pass

@router.post("/echelons/", response_model=Echelon)
async def create_echelon(echelon: EchelonCreate):
    """Crée un nouvel échelon"""
    pass
```

## 4. Rubriques de Paie

```python
@router.get("/rubriques/", response_model=List[RubriquePaie])
async def get_rubriques():
    """Liste toutes les rubriques de paie"""
    pass

@router.post("/rubriques/", response_model=RubriquePaie)
async def create_rubrique(rubrique: RubriqueCreate):
    """Crée une nouvelle rubrique"""
    pass

@router.put("/rubriques/{rubrique_id}", response_model=RubriquePaie)
async def update_rubrique(rubrique_id: int, rubrique: RubriqueUpdate):
    """Met à jour une rubrique"""
    pass
```

## 5. Fiches de Paie

```python
@router.post("/fiches-paie/generate/")
async def generate_fiche_paie(employee_id: int, periode: str):
    """Génère une fiche de paie pour un employé"""
    pass

@router.get("/fiches-paie/{fiche_id}", response_model=FichePaie)
async def get_fiche_paie(fiche_id: int):
    """Récupère une fiche de paie par son ID"""
    pass

@router.get("/fiches-paie/employee/{employee_id}", response_model=List[FichePaie])
async def get_fiches_paie_employee(employee_id: int):
    """Liste les fiches de paie d'un employé"""
    pass
```

## Protection des Routes

Toutes les routes (sauf /login) sont protégées par authentification JWT :

```python
from fastapi import Depends
from app.oauth2 import get_current_user

@router.get("/protected-route", dependencies=[Depends(get_current_user)])
async def protected_route():
    pass
```

## Gestion des Erreurs

Les erreurs sont gérées de manière centralisée :

```python
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(ValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )
```

## Middleware CORS

Configuration CORS pour permettre les requêtes du frontend :

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
