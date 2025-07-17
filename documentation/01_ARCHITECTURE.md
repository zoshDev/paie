# Architecture Globale du Projet Paie-App

## Stack Technique

### Frontend
- React + TypeScript
- Vite comme bundler
- TailwindCSS pour le styling
- React Router pour la navigation
- Heroicons pour les icônes

### Backend
- Python/FastAPI
- SQLAlchemy comme ORM
- Alembic pour les migrations
- MySQL Connector pour la base de données (pas PostgreSQL comme indiqué précédemment)
- JWT pour l'authentification
- Pydantic pour la validation des données

### Sécurité et Middleware
- CORS configuré
- Middleware d'authentification OAuth2
- Système de rôles et permissions (RBAC)
- Gestion des sessions avec SQLAlchemy

## Structure du Projet

```
paie-app/
├── frontend/           # Application React
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/      # Pages de l'application
│   │   ├── services/   # Services et appels API
│   │   ├── hooks/      # Hooks personnalisés
│   │   └── types/      # Types TypeScript
│   
└── backend/           # API FastAPI
    ├── src/
    │   ├── models/     # Modèles de données
    │   │   ├── user.py
    │   │   ├── role.py
    │   │   ├── ressource.py
    │   │   ├── categorie.py
    │   │   ├── echelon.py
    │   │   ├── employe.py
    │   │   ├── contrat.py
    │   │   ├── bulletin_paie.py
    │   │   └── element_salaire.py
    │   ├── routers/    # Routes API
    │   ├── services/   # Logique métier
    │   ├── schemas/    # Schémas Pydantic
    │   ├── oauth2.py   # Authentification
    │   ├── database.py # Configuration DB
    │   └── config.py   # Configuration
```

## Architecture Backend Détaillée

### Modèles de Base de Données
- `BasePaie`: Classe abstraite commune avec fonctionnalités CRUD
- Modèles principaux:
  - User & Role: Gestion des utilisateurs et permissions
  - Categorie & Echelon: Classification des employés
  - Employe & Contrat: Gestion du personnel
  - ElementSalaire: Composants de la paie
  - BulletinPaie & LigneBulletinSalaire: Gestion des bulletins

### Système d'Authentification
- OAuth2 avec JWT
- Durée de validité des tokens configurable
- Vérification du statut actif des utilisateurs
- Support pour les rôles multiples

### Validation des Données
- Schémas Pydantic avec validation avancée
- Enums pour les types standardisés:
  - RegimeFiscal: REEL, SIMPLIFIE, FORFAIT
  - TypeContrat: CDI, CDD
  - TypeElement: prime, indemnite, retenue, cotisation, avantage
  - NatureElement: fixe, variable, derive

### Points d'Entrée Principaux

### Frontend
- `main.tsx` : Point d'entrée de l'application React
- `App.tsx` : Composant racine avec le routage

### Backend
- `main.py` : Point d'entrée de l'API FastAPI
- `database.py` : Configuration de la base de données

## Configuration Requise

### Environnement de Développement
- Node.js ≥ 16
- Python ≥ 3.9
- MySQL ≥ 8.0 (au lieu de PostgreSQL)

### Variables d'Environnement Principales
Frontend (.env):
```
VITE_API_URL=http://localhost:8000
```

Backend (.env):
```
DATABASE_USERNAME=user
DATABASE_PASSWORD=password
DATABASE_HOSTNAME=localhost
DATABASE_NAME=paie_db
TOKEN_SECRET_KEY=your-secret-key
TOKEN_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Gestion des Erreurs
- Gestion centralisée via CustomHttpResponse
- Codes d'erreur standardisés:
  - 400: Requête invalide ou objet existant
  - 403: Accès non autorisé
  - 404: Ressource non trouvée
  - 500: Erreur serveur

## Sécurité
- CORS configuré avec options personnalisables
- Authentification JWT obligatoire sur les routes protégées
- Système RBAC pour le contrôle d'accès granulaire
- Validation des données entrantes via Pydantic
- Sessions sécurisées avec SQLAlchemy
