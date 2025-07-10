# GenericDuplicateForm

Un composant React générique et réutilisable pour gérer le processus de duplication de n'importe quelle entité.

## Description

Le `GenericDuplicateForm` permet de dupliquer n'importe quelle entité (profils, rubriques, etc.) en préservant la plupart des données tout en permettant à l'utilisateur de modifier au minimum le code et le nom de la nouvelle entité avant sa création.

## Props

Le composant accepte les props génériques suivantes :

| Prop | Type | Description | Obligatoire |
|------|------|-------------|-------------|
| `entityToDuplicate` | `T` | L'objet complet de l'entité originale à dupliquer. `T` doit être un type générique avec au moins un `id: string`. | Oui |
| `onClose` | `() => void` | Fonction à appeler pour fermer la modale. | Oui |
| `onDuplicateSubmit` | `(duplicatedData: Partial<T>) => void` | Callback principal appelé lorsque l'utilisateur soumet le formulaire. `duplicatedData` contient les valeurs finales (avec le nouveau code et nom), mais sans l'ID de la nouvelle entité. | Oui |
| `isSubmitting` | `boolean` | Booléen pour désactiver les boutons pendant la soumission. | Non |
| `renderEntityForm` | `(initialData: Partial<T>, onSubmit: (data: Partial<T>) => void, isSubmitting: boolean, onClose: () => void) => React.ReactNode` | Fonction qui rend le formulaire spécifique à l'entité avec les données préparées. | Oui |
| `generateNewCode` | `(originalCode: string \| undefined) => string` | Fonction pour générer le nouveau code suggéré. | Oui |
| `generateNewName` | `(originalName: string \| undefined) => string` | Fonction optionnelle pour générer le nouveau nom suggéré. | Non |
| `codeFieldName` | `keyof T` | Le nom de la clé du champ "code" dans l'objet T. Par défaut: 'code' | Non |
| `nameFieldName` | `keyof T` | Le nom de la clé du champ "nom" dans l'objet T. Par défaut: 'nom' | Non |
| `modalTitle` | `string` | Titre personnalisé pour le haut de la modale de duplication. | Non |
| `introText` | `string` | Court texte explicatif sous le titre. | Non |

## Exemple d'utilisation simple

```tsx
import React from 'react';
import GenericDuplicateForm from './GenericDuplicateForm';
import ProfilPaieForm from './ProfilPaieForm';
import type { ProfilPaie } from '../../types';

// Dans un composant parent
const renderDuplicateForm = (profil: ProfilPaie | null, onClose: () => void, onSubmit: (data: Partial<ProfilPaie>) => void) => {
  if (!profil) return null;
  
  return (
    <GenericDuplicateForm<ProfilPaie>
      entityToDuplicate={profil}
      onClose={onClose}
      onDuplicateSubmit={onSubmit}
      isSubmitting={isSubmitting}
      renderEntityForm={(initialData, formSubmit, formSubmitting, formClose) => (
        <ProfilPaieForm
          initialData={initialData}
          onSubmit={formSubmit}
          isSubmitting={formSubmitting}
        />
      )}
      generateNewCode={(originalCode) => 
        originalCode ? `${originalCode}_COPIE_${Date.now().toString().slice(-4)}` : `NOUVEAU_${Date.now().toString().slice(-4)}`
      }
      generateNewName={(originalName) => 
        originalName ? `Copie de ${originalName}` : `Nouvelle Entité Copiée`
      }
      modalTitle="Dupliquer l'Entité"
      introText="Modifiez le code et le nom de la copie avant de la créer."
    />
  );
};
```

## Logique interne

1. Le composant prend l'entité originale, en crée une copie sans ID, et applique les fonctions de génération de code/nom.
2. L'utilisateur peut modifier le code et le nom avant de soumettre.
3. Le composant utilise le formulaire spécifique à l'entité fourni via `renderEntityForm` pour permettre la modification de tous les champs de l'entité.
4. Lorsque l'utilisateur soumet le formulaire interne, le composant intercepte la soumission et appelle `onDuplicateSubmit` avec les données finales.

## Dépendances

- React
- react-hook-form
- react-hot-toast 