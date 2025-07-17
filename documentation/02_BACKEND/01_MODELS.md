# Modèles de Données Backend

## Structure de Base

Les modèles sont construits avec SQLAlchemy et Pydantic pour la validation des schémas.

```python
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
```

## Modèles Principaux

### 1. Employé
```python
class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    matricule = Column(String, unique=True, index=True)
    nom = Column(String)
    prenom = Column(String)
    date_embauche = Column(DateTime)
    poste = Column(String)
    categorie_id = Column(Integer, ForeignKey("categories.id"))
    
    # Relations
    categorie = relationship("Categorie", back_populates="employees")
    fiches_paie = relationship("FichePaie", back_populates="employee")
```

### 2. Catégorie
```python
class Categorie(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True)
    nom = Column(String)
    description = Column(String)
    
    # Relations
    employees = relationship("Employee", back_populates="categorie")
    echelons = relationship("Echelon", back_populates="categorie")
```

### 3. Échelon
```python
class Echelon(Base):
    __tablename__ = "echelons"
    
    id = Column(Integer, primary_key=True, index=True)
    niveau = Column(Integer)
    salaire_base = Column(Float)
    categorie_id = Column(Integer, ForeignKey("categories.id"))
    
    # Relations
    categorie = relationship("Categorie", back_populates="echelons")
```

### 4. Rubrique de Paie
```python
class RubriquePaie(Base):
    __tablename__ = "rubriques"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True)
    nom = Column(String)
    type = Column(String)  # salaire, gain, déduction
    methode_calcul = Column(String)
    ordre_application = Column(Integer)
    qui_paie = Column(String)  # employe, employeur, les_deux
    taux_employe = Column(Float)
    taux_employeur = Column(Float)
```

### 5. Fiche de Paie
```python
class FichePaie(Base):
    __tablename__ = "fiches_paie"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    periode = Column(String)
    date_generation = Column(DateTime)
    salaire_brut = Column(Float)
    total_retenues = Column(Float)
    salaire_net = Column(Float)
    
    # Relations
    employee = relationship("Employee", back_populates="fiches_paie")
    lignes_paie = relationship("LignePaie", back_populates="fiche_paie")
```

### 6. Ligne de Paie
```python
class LignePaie(Base):
    __tablename__ = "lignes_paie"
    
    id = Column(Integer, primary_key=True, index=True)
    fiche_paie_id = Column(Integer, ForeignKey("fiches_paie.id"))
    rubrique_id = Column(Integer, ForeignKey("rubriques.id"))
    base = Column(Float)
    taux = Column(Float)
    montant = Column(Float)
    
    # Relations
    fiche_paie = relationship("FichePaie", back_populates="lignes_paie")
    rubrique = relationship("RubriquePaie")
```

## Schémas Pydantic

Les schémas Pydantic sont utilisés pour la validation des données et la sérialisation API.

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class EmployeeBase(BaseModel):
    matricule: str
    nom: str
    prenom: str
    date_embauche: datetime
    poste: str
    categorie_id: int

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    
    class Config:
        orm_mode = True
```

## Relations et Dépendances

1. Un employé appartient à une catégorie
2. Une catégorie peut avoir plusieurs échelons
3. Une fiche de paie est liée à un employé
4. Une fiche de paie contient plusieurs lignes de paie
5. Chaque ligne de paie fait référence à une rubrique

## Configuration de la Base de Données

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/db_name"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)
```
