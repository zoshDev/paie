# Contexte Général du Projet Paie-App (Synthèse Globale)

## 1. Vue d'Ensemble

- **Objectif :** Application web full-stack de gestion de la paie.
- **Composants :**
    - **Backend :** API RESTful robuste et structurée, développée avec **FastAPI (Python)**, SQLAlchemy et Alembic.
    - **Frontend :** Application monopage (SPA) développée avec **React (TypeScript)** et Vite.
- **État Actuel & Défi Principal :** Le projet est **non fonctionnel en l'état**. Le backend semble stable et bien défini, mais le frontend est bloqué par des **dépendances critiques incorrectes** dans `package.json` et souffre d'un **désalignement majeur** (nomenclature, routes, types de données) avec le backend.

---

## 2. Feuille de Route Stratégique

L'ordre des actions suivantes est impératif pour débloquer le projet.

1.  **Phase 1 : Stabilisation du Frontend (Priorité Absolue)**
    - **Action :** Corriger les versions des dépendances dans `frontend/package.json` vers des versions stables et existantes (`react`, `react-router-dom`, `tailwindcss`, `zod`, etc.).
    - **Action :** Supprimer `node_modules` et `package-lock.json` puis exécuter `npm install` pour créer un environnement de développement propre et fonctionnel.

2.  **Phase 2 : Alignement Frontend-Backend**
    - **Action :** Synchroniser les types TypeScript du frontend avec les schémas Pydantic du backend.
    - **Action :** Aligner les appels `fetch`/`axios` du frontend sur les routes réelles de l'API backend (ex: `/api/employes`).
    - **Action :** Standardiser la nomenclature (fichiers, variables) du frontend sur celle du backend (français).

3.  **Phase 3 : Baseline Git et Développement**
    - **Action :** Initialiser un dépôt Git à la racine du projet (`/home/ubuntu/projets/paie-app`) pour gérer le projet full-stack de manière unifiée.
    - **Action :** Créer un fichier `.gitignore` à la racine pour ignorer les dossiers non nécessaires (`node_modules`, `__pycache__`, `.env`, etc.).
    - **Action :** Effectuer un premier commit pour établir une **baseline de code connue et fiable**.
    - **Action :** Poursuivre le développement en suivant une approche **TDD/BDD**, en s'appuyant sur les composants génériques déjà créés.

---

## 3. Directives Techniques pour les Interventions Futures

- **Source de Vérité :** Le backend (modèles, routes, nomenclature) fait foi.
- **Priorité :** La stabilisation du frontend est le prérequis à toute autre tâche.
- **Conventions :** Utiliser et enrichir les composants génériques existants.
- **Tests :** Le développement doit être guidé par les tests (TDD/BDD).
