# Composant GenericAssignmentForm

Le composant `GenericAssignmentForm` est un formulaire générique et réutilisable pour assigner un ensemble d'entités "source" à un ensemble d'entités "cible". Ce composant a été conçu pour remplacer des implémentations spécifiques et promouvoir la réutilisabilité dans l'application.

## Fonctionnalités

- Interface utilisateur intuitive et cohérente
- Recherche dynamique des entités cible
- Sélection/désélection d'entités avec retour visuel
- Notification utilisateur via react-hot-toast
- Support pour des types d'entités génériques
- Personnalisation des libellés et descriptions

## Comment utiliser

### Import

```tsx
import GenericAssignmentForm from "../../components/form/GenericAssignmentForm";
```

### Usage basique

```tsx
<GenericAssignmentForm
  sourceItemsIds={selectedIds}
  availableTargetEntities={profiles}
  onClose={handleClose}
  onSubmit={handleSubmit}
/>
```

### Usage complet avec toutes les options

```tsx
<GenericAssignmentForm
  sourceItemsIds={selectedIds}
  availableTargetEntities={profiles}
  onClose={handleClose}
  onSubmit={handleSubmit}
  isSubmitting={isLoading}
  title="Assigner des rubriques aux profils"
  description="Sélectionnez les profils auxquels assigner les rubriques."
  sourceItemsLabel="Rubrique"
  targetFilterPlaceholder="Rechercher des profils..."
  targetLabelKey="name"
  targetValueKey="id"
/>
```

## Props

Le composant accepte les props suivantes :

| Prop | Type | Obligatoire | Description | Valeur par défaut |
|------|------|------------|-------------|-------------------|
| `sourceItemsIds` | `string[]` | Oui | IDs des entités source à assigner | - |
| `availableTargetEntities` | `T[]` | Oui | Entités cible disponibles pour l'assignation | - |
| `onClose` | `() => void` | Oui | Fonction pour fermer la modale | - |
| `onSubmit` | `(sourceIds: string[], targetIds: string[]) => void` | Oui | Fonction de callback appelée lors de la soumission | - |
| `isSubmitting` | `boolean` | Non | Indique si la soumission est en cours | `false` |
| `title` | `string` | Non | Titre personnalisé pour le formulaire | "Assignation d'entités" |
| `description` | `string` | Non | Description personnalisée sous le titre | "Sélectionnez les cibles..." |
| `sourceItemsLabel` | `string` | Non | Texte pour décrire les éléments source | "Élément(s) à assigner" |
| `targetFilterPlaceholder` | `string` | Non | Placeholder du champ de recherche | "Rechercher..." |
| `targetLabelKey` | `keyof T` | Non | Clé à utiliser pour l'affichage | "name" |
| `targetValueKey` | `keyof T` | Non | Clé à utiliser comme valeur unique | "id" |

## Intégration avec EntityModal

Pour utiliser ce composant avec `EntityModal`, vous devez :

1. Ajouter le mode "assign-entities" au type ModalMode
2. Ajouter la prop renderAssignmentForm à l'interface EntityModalsProps
3. Gérer le nouveau mode dans le switch de EntityModals
4. Utiliser le composant dans vos pages

Exemple d'utilisation dans `RubricListPage.tsx` :

```tsx
<EntityModals
  mode={modalMode}
  entity={selectedRubrique}
  selectedIds={selectedIds}
  onClose={closeModal}
  onSubmit={modalMode === "assign-entities" ? handleAssignEntities : handleRubricSubmit}
  renderAssignmentForm={(sourceIds, close, submit) => (
    <GenericAssignmentForm
      sourceItemsIds={sourceIds}
      availableTargetEntities={profiles}
      onClose={close}
      onSubmit={submit}
      title="Assigner des rubriques aux profils de paie"
      description="Sélectionnez les profils de paie auxquels les rubriques choisies seront assignées."
      sourceItemsLabel="Rubrique(s)"
      targetFilterPlaceholder="Filtrer les profils..."
    />
  )}
/>
```

## Considérations techniques

- Le composant utilise la généricité TypeScript pour supporter différents types d'entités
- La recherche des entités cible est insensible à la casse et s'applique aux propriétés spécifiées
- Les entités déjà sélectionnées sont filtrées des résultats de recherche
- Les callbacks sont optimisés avec useCallback pour éviter les rendus inutiles
- Les calculs coûteux sont mémorisés avec useMemo 