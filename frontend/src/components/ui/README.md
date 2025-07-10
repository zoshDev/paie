# Composants UI Génériques

Ce dossier contient les composants d'interface utilisateur génériques et réutilisables pour l'application.

## Composants principaux

### GenericForm

Un composant de formulaire hautement configurable qui génère des formulaires basés sur des définitions de champs.

**Fonctionnalités:**
- Support pour différents types de champs (texte, nombre, select, multiselect, checkbox, etc.)
- Validation via Yup
- Disposition en sections et colonnes
- Gestion des dépendances entre champs
- Mode modal intégré

**Props:**
```tsx
interface GenericFormProps {
  sections: FormSection[];          // Sections de formulaire avec champs
  onSubmit: (data: any) => void;    // Fonction appelée lors de la soumission
  onCancel?: () => void;            // Fonction appelée lors de l'annulation
  initialData?: any;                // Données initiales pour remplir le formulaire
  submitLabel?: string;             // Texte du bouton de soumission
  cancelLabel?: string;             // Texte du bouton d'annulation
  isModal?: boolean;                // Si true, affiche en tant que modal
  modalTitle?: string;              // Titre du modal
  onValueChange?: (values: any) => void; // Fonction appelée quand les valeurs changent
}
```

**Exemple d'utilisation:**
```tsx
<GenericForm
  sections={[
    {
      title: "Informations personnelles",
      columns: 2,
      fields: [
        {
          name: "firstName",
          label: "Prénom",
          type: "text",
          required: true
        },
        {
          name: "lastName",
          label: "Nom",
          type: "text",
          required: true
        }
      ]
    }
  ]}
  onSubmit={(data) => console.log(data)}
  submitLabel="Enregistrer"
/>
```

### GenericFormModal

Un wrapper modal pour GenericForm, facilitant les opérations d'ajout/édition.

**Props:**
```tsx
interface GenericFormModalProps {
  isOpen: boolean;                   // Si le modal est ouvert
  isEdit: boolean;                   // Si c'est un mode édition
  title: string;                     // Titre du modal
  entity: any | null;                // Entité à éditer
  sections: FormSection[];           // Sections de formulaire
  onClose: () => void;               // Fonction de fermeture
  onSubmit: (data: any) => void;     // Fonction de soumission
  submitLabel?: string;              // Texte du bouton de soumission
  cancelLabel?: string;              // Texte du bouton d'annulation
  getFormSections?: (isEdit: boolean, entity: any | null) => FormSection[]; // Pour calculer les sections dynamiquement
}
```

**Exemple d'utilisation:**
```tsx
<GenericFormModal
  isOpen={showModal}
  isEdit={!!selectedItem}
  title="Employé"
  entity={selectedItem}
  sections={formSections}
  onClose={() => setShowModal(false)}
  onSubmit={handleSubmit}
/>
```

### GenericListPage

Un composant de liste complet avec fonctionnalités de recherche, filtrage, pagination et actions.

**Fonctionnalités:**
- Recherche textuelle
- Filtrage avancé
- Pagination avec taille de page configurable
- Actions en masse sur les éléments sélectionnés
- Actions contextuelles par ligne
- Tri par colonne

**Props principales:**
```tsx
interface GenericListPageProps<T> {
  title: string;                     // Titre de la page
  description?: string;              // Description
  columns: ColumnDef<T>[];           // Définition des colonnes
  data: T[];                         // Données à afficher
  selectedIds: string[];             // IDs sélectionnés
  isLoading?: boolean;               // État de chargement
  searchQuery: string;               // Requête de recherche
  onSearchChange: (query: string) => void; // Fonction pour la recherche
  onSelect: (id: string) => void;    // Sélection d'un élément
  onSelectAll: (items: T[]) => void; // Sélection de tous les éléments
  actions?: ActionItem[];            // Actions disponibles
  filterFields?: FilterField[];      // Champs de filtrage
  filter?: Record<string, any>;      // État du filtre
  onFilterChange?: (filter: Record<string, any>) => void; // Changement de filtre
  renderRowActions?: (item: T) => ReactNode; // Actions par ligne
  page?: number;                     // Page courante
  setPage?: (page: number) => void;  // Changement de page
  pageSize?: number;                 // Taille de page
  setPageSize?: (pageSize: number) => void; // Changement de taille de page
}
```

**Exemple d'utilisation:**
```tsx
<GenericListPage
  title="Liste des employés"
  columns={columns}
  data={filteredEmployees}
  selectedIds={selectedIds}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  onSelect={handleSelect}
  onSelectAll={handleSelectAll}
  actions={actions}
  renderRowActions={renderRowActions}
  page={page}
  setPage={setPage}
  pageSize={pageSize}
  setPageSize={setPageSize}
/>
```

### GenericFilter

Un composant de filtrage avancé qui peut être utilisé avec GenericListPage.

**Fonctionnalités:**
- Plusieurs types de filtres (texte, select, multiselect, checkbox, date, etc.)
- Interface utilisateur intuitive
- Réinitialisation des filtres
- Compteur de filtres actifs

**Props:**
```tsx
interface GenericFilterProps {
  fields: FilterField[];            // Champs de filtrage
  filter: Record<string, any>;      // État du filtre
  onFilterChange: (filter: Record<string, any>) => void; // Changement de filtre
  onClose: () => void;              // Fermeture du panneau de filtrage
  title?: string;                   // Titre du panneau
}
```

**Exemple d'utilisation:**
```tsx
<GenericFilter
  fields={[
    {
      name: "status",
      label: "Statut",
      type: "select",
      options: [
        { value: "all", label: "Tous" },
        { value: "active", label: "Actif" },
        { value: "inactive", label: "Inactif" }
      ]
    }
  ]}
  filter={filter}
  onFilterChange={handleFilterChange}
  onClose={() => setShowFilter(false)}
/>
```

## Comment créer un nouveau type de champ

Pour ajouter un nouveau type de champ dans GenericForm:

1. Ajouter le nouveau type à l'union de types `FieldType`
2. Implémenter le rendu du champ dans la fonction `renderField`
3. Ajouter la logique de validation dans `buildValidationSchema`

## Bonnes pratiques

- Toujours fournir des labels et des placeholders explicites
- Utiliser des validations appropriées pour chaque type de champ
- Grouper les champs connexes dans des sections logiques
- Limiter le nombre de champs visibles simultanément pour une meilleure expérience utilisateur 