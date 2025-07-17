# Services Backend

Cette documentation détaille les services métier qui implémentent la logique principale de l'application.

## 1. Service d'Authentification

```python
class AuthService:
    def __init__(self, db: Session):
        self.db = db

    async def authenticate_user(self, username: str, password: str):
        """Authentifie un utilisateur et retourne un token JWT"""
        user = await self.db.query(User).filter(User.username == username).first()
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        access_token = create_access_token(data={"user_id": user.id})
        return {"access_token": access_token, "token_type": "bearer"}

    async def get_current_user(self, token: str):
        """Vérifie et décode un token JWT"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("user_id")
            if user_id is None:
                raise HTTPException(status_code=401)
            return await self.db.query(User).filter(User.id == user_id).first()
        except JWTError:
            raise HTTPException(status_code=401)
```

## 2. Service des Employés

```python
class EmployeeService:
    def __init__(self, db: Session):
        self.db = db

    async def get_all_employees(self):
        """Récupère tous les employés avec leur catégorie"""
        return await self.db.query(Employee).options(
            joinedload(Employee.categorie)
        ).all()

    async def create_employee(self, employee_data: EmployeeCreate):
        """Crée un nouvel employé"""
        employee = Employee(**employee_data.dict())
        self.db.add(employee)
        await self.db.commit()
        await self.db.refresh(employee)
        return employee

    async def update_employee(self, employee_id: int, employee_data: EmployeeUpdate):
        """Met à jour un employé"""
        employee = await self.db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
            
        for field, value in employee_data.dict(exclude_unset=True).items():
            setattr(employee, field, value)
            
        await self.db.commit()
        await self.db.refresh(employee)
        return employee
```

## 3. Service de Calcul de Paie

```python
class PayrollService:
    def __init__(self, db: Session):
        self.db = db

    async def calculate_salary(self, employee_id: int, period: str):
        """Calcule le salaire d'un employé pour une période donnée"""
        # Récupération de l'employé et de ses informations
        employee = await self.db.query(Employee).options(
            joinedload(Employee.categorie),
            joinedload(Employee.categorie).joinedload(Categorie.echelons)
        ).filter(Employee.id == employee_id).first()

        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")

        # Calcul du salaire de base
        base_salary = self._calculate_base_salary(employee)
        
        # Récupération et application des rubriques
        rubriques = await self._get_applicable_rubriques(employee)
        salary_components = self._apply_rubriques(base_salary, rubriques)
        
        # Création de la fiche de paie
        return await self._create_payslip(employee, period, salary_components)

    async def _get_applicable_rubriques(self, employee: Employee):
        """Récupère les rubriques applicables pour un employé"""
        return await self.db.query(RubriquePaie).order_by(
            RubriquePaie.ordre_application
        ).all()

    def _calculate_base_salary(self, employee: Employee):
        """Calcule le salaire de base selon la catégorie et l'échelon"""
        echelon = next(
            (e for e in employee.categorie.echelons if e.niveau == employee.echelon),
            None
        )
        if not echelon:
            raise HTTPException(
                status_code=400,
                detail="No salary configuration found for employee's grade"
            )
        return echelon.salaire_base

    async def _create_payslip(self, employee: Employee, period: str, components: dict):
        """Crée une nouvelle fiche de paie"""
        fiche = FichePaie(
            employee_id=employee.id,
            periode=period,
            salaire_brut=components["brut"],
            total_retenues=components["retenues"],
            salaire_net=components["net"]
        )
        self.db.add(fiche)
        
        # Ajout des lignes de paie
        for comp in components["details"]:
            ligne = LignePaie(
                fiche_paie=fiche,
                rubrique_id=comp["rubrique_id"],
                base=comp["base"],
                taux=comp["taux"],
                montant=comp["montant"]
            )
            self.db.add(ligne)
        
        await self.db.commit()
        await self.db.refresh(fiche)
        return fiche
```

## 4. Service de Gestion des Rubriques

```python
class RubriqueService:
    def __init__(self, db: Session):
        self.db = db

    async def get_all_rubriques(self):
        """Récupère toutes les rubriques de paie"""
        return await self.db.query(RubriquePaie).order_by(
            RubriquePaie.ordre_application
        ).all()

    async def create_rubrique(self, rubrique_data: RubriqueCreate):
        """Crée une nouvelle rubrique"""
        # Vérification de l'unicité du code
        existing = await self.db.query(RubriquePaie).filter(
            RubriquePaie.code == rubrique_data.code
        ).first()
        if existing:
            raise HTTPException(
                status_code=400,
                detail="A rubrique with this code already exists"
            )

        rubrique = RubriquePaie(**rubrique_data.dict())
        self.db.add(rubrique)
        await self.db.commit()
        await self.db.refresh(rubrique)
        return rubrique

    async def update_rubrique(self, rubrique_id: int, rubrique_data: RubriqueUpdate):
        """Met à jour une rubrique"""
        rubrique = await self.db.query(RubriquePaie).filter(
            RubriquePaie.id == rubrique_id
        ).first()
        
        if not rubrique:
            raise HTTPException(status_code=404, detail="Rubrique not found")

        # Vérification de l'unicité du code si modifié
        if rubrique_data.code and rubrique_data.code != rubrique.code:
            existing = await self.db.query(RubriquePaie).filter(
                RubriquePaie.code == rubrique_data.code
            ).first()
            if existing:
                raise HTTPException(
                    status_code=400,
                    detail="A rubrique with this code already exists"
                )

        for field, value in rubrique_data.dict(exclude_unset=True).items():
            setattr(rubrique, field, value)

        await self.db.commit()
        await self.db.refresh(rubrique)
        return rubrique
```

## 5. Service de Gestion des Catégories

```python
class CategoryService:
    def __init__(self, db: Session):
        self.db = db

    async def get_all_categories(self):
        """Récupère toutes les catégories avec leurs échelons"""
        return await self.db.query(Categorie).options(
            joinedload(Categorie.echelons)
        ).all()

    async def create_category(self, category_data: CategorieCreate):
        """Crée une nouvelle catégorie"""
        category = Categorie(**category_data.dict())
        self.db.add(category)
        await self.db.commit()
        await self.db.refresh(category)
        return category

    async def add_echelon(self, category_id: int, echelon_data: EchelonCreate):
        """Ajoute un échelon à une catégorie"""
        category = await self.db.query(Categorie).filter(
            Categorie.id == category_id
        ).first()
        
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")

        echelon = Echelon(**echelon_data.dict(), categorie_id=category_id)
        self.db.add(echelon)
        await self.db.commit()
        await self.db.refresh(echelon)
        return echelon
```
