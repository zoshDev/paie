# Composants Frontend

## 1. Formulaires

### RubricForm

Le formulaire de rubrique est un composant complexe qui permet de gérer les configurations de paie. Il est constitué de plusieurs sections :

#### Structure des Sections

```typescript
interface FormSection {
  title: string;
  fields: FormField[];
}

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  icon?: React.ReactNode;
  tooltipText?: string;
  showIf?: (values: any) => boolean;
  options?: { label: string; value: string }[];
}
```

#### Sections Principales

1. **Informations générales**
   - Code de la rubrique
   - Nom
   - Description
   - Type (salaire, gain, déduction)
   - Ordre d'application

2. **Configuration du paiement**
   - Responsable du paiement (employé/employeur/les deux)
   - Taux employé (%)
   - Taux employeur (%)

3. **Méthode de calcul**
   - Configuration du calculateur de rubrique

4. **Autres paramètres**
   - Valeur par défaut
   
#### Types de Champs Disponibles
- text
- textarea
- select
- number
- rubric_method_calculator (composant spécialisé)

#### Logique Conditionnelle
Les champs peuvent être conditionnels grâce à la propriété `showIf`. Exemple :
```typescript
showIf: (values) => values.type === "deduction"
```

### Rubriques Disponibles

Liste des rubriques standard pour les calculs :
- Salaire de base
- Prime d'ancienneté
- Prime de rendement
- Indemnité de logement
- Indemnité de transport
- Heures supplémentaires
- Avance sur salaire
- Cotisation retraite
- Assurance maladie
