# Module Profil de Paie

Ce module permet la gestion complète des profils de paie dans l'application. Un profil de paie définit un ensemble de rubriques salariales qui seront utilisées pour calculer la paie d'un employé.

## Structure du module

Le module est organisé selon l'architecture standard du projet:

- `types.ts` - Définition des interfaces TypeScript pour les profils de paie
- `columns.ts` - Configuration des colonnes pour le tableau d'affichage
- `profilPaieField.ts` - Définition des champs de formulaire
- `useProfilPaie.ts` - Hook personnalisé pour gérer l'état et les opérations CRUD
- `ProfilPaieListPage.tsx` - Page principale listant les profils de paie
- `__tests__/` - Tests unitaires pour chaque composant

## Fonctionnalités

### Visualisation des profils de paie
- Liste paginée des profils de paie avec tri et filtrage
- Visualisation détaillée d'un profil avec ses rubriques associées
- Marquage visuel des types de rubriques (salaire, gain, déduction)

### Gestion des profils de paie
- Création de nouveaux profils avec sélection de catégories
- Association de rubriques existantes aux profils
- Réorganisation de l'ordre des rubriques dans un profil
- Suppression de rubriques d'un profil
- Modification des informations d'un profil existant
- Suppression individuelle ou en masse de profils

## Composants spécifiques

### RubriqueSelector
Composant personnalisé permettant:
- Afficher les rubriques déjà associées au profil
- Rechercher et ajouter des rubriques existantes
- Réorganiser l'ordre des rubriques (montée/descente)
- Supprimer des rubriques du profil

### ProfilPaieForm
Formulaire de création/modification avec:
- Validation des champs obligatoires
- Interface utilisateur ergonomique pour gérer les rubriques
- Prévisualisation des rubriques associées

## Tests

Les tests couvrent:
- Le hook `useProfilPaie` (gestion d'état et sélection)
- Le composant `RubriqueSelector` (ajout/suppression/recherche)
- Le formulaire `ProfilPaieForm` (validation et soumission)
- La page `ProfilPaieListPage` (rendu et interactions utilisateur)

## Usage

```jsx
import ProfilPaieListPage from './pages/profilPaie/ProfilPaieListPage';

// Dans un composant ou une route
<ProfilPaieListPage />
```

## Intégration avec d'autres modules

Ce module peut être connecté à:
- Module Employé: pour associer un profil de paie à un employé
- Module Paie: pour calculer les bulletins de paie selon le profil associé
- Module Rubrique: utilise les rubriques définies pour les associer aux profils

## Points d'extension future

1. Ajout de règles de calcul spécifiques par rubrique dans le contexte d'un profil
2. Support pour les historiques de modifications des profils
3. Prévisualisation du calcul de paie basé sur un profil et un salaire de base 