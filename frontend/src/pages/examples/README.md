# Exemples de pages avec composants génériques

Ce dossier contient des exemples de pages qui utilisent les composants génériques UI pour créer une interface complète de gestion de paie.

## Pages disponibles

### PayrollItemListPage

Une page pour gérer les rubriques de paie (salaires, indemnités, déductions, etc.).

**Fonctionnalités:**
- Liste des rubriques avec filtrage et pagination
- Ajout, modification et suppression de rubriques
- Affichage sous forme de badges pour les types et statuts
- Gestion de barèmes progressifs pour les impôts

### PayrollProfileListPage

Une page pour gérer les profils de paie standards qui peuvent être assignés à des groupes d'employés.

**Fonctionnalités:**
- Liste des profils avec recherche et tri
- Création et modification de profils
- Association de rubriques de paie aux profils

### EmployeePayrollProfilePage

Une page pour assigner et personnaliser des profils de paie aux employés.

**Fonctionnalités:**
- Liste des employés avec leurs profils associés
- Personnalisation des montants et désactivation de rubriques spécifiques par employé
- Interface dédiée pour les personnalisations

### EmployeeListPage

Une page de gestion des employés qui présente les données des employés.

**Fonctionnalités:**
- Liste complète des employés avec filtrage et recherche
- Actions contextuelles (édition, suppression, affichage des détails)
- Sélection multiple pour actions en masse

## Composants partagés

### Composants de formulaire

Le dossier `components/` contient plusieurs composants réutilisables:

- **PayrollItemForm.tsx**: Formulaire de création/édition de rubriques de paie
- **PayrollItemFormModal.tsx**: Modal contenant le formulaire de rubriques
- **ProgressiveRatesManager.tsx**: Interface pour gérer les barèmes progressifs d'imposition
- **CustomizeProfileFormModal.tsx**: Modal pour personnaliser les profils par employé

### Composants d'action

Des composants pour les actions contextuelles:

- **PayrollItemRowActions.tsx**: Actions disponibles sur chaque ligne de rubrique
- **ConfirmDeleteModal.tsx**: Modal de confirmation pour les suppressions
- **AssignToProfileModal.tsx**: Modal pour assigner des rubriques à un profil

## Utilisation des stores

Ces pages utilisent trois stores Zustand principaux:

- **exampleEmployeeStore**: Gestion des données d'employés
- **examplePayrollItemStore**: Gestion des rubriques de paie
- **examplePayrollProfileStore**: Gestion des profils et des assignations

## Comment les pages sont connectées

1. Les **rubriques de paie** (PayrollItemListPage) sont la base du système
2. Ces rubriques sont regroupées dans des **profils de paie** (PayrollProfileListPage)
3. Les profils sont assignés aux **employés** (EmployeePayrollProfilePage)
4. Des **personnalisations** peuvent être appliquées pour chaque employé

## Comment étendre ces exemples

Pour ajouter de nouvelles fonctionnalités:

1. Définir de nouveaux types dans les fichiers modèles (`models/`)
2. Ajouter des actions et des états dans les stores appropriés
3. Créer des sections de formulaire pour les nouveaux champs
4. Mettre à jour les interfaces utilisateur pour afficher/modifier les nouvelles données 