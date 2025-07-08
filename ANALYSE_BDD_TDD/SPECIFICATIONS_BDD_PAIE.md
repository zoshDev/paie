# Spécifications BDD pour l'Application de Paie

## 1. Features Principales

### 1.1 Gestion des Éléments de Salaire
```gherkin
Feature: Gestion des Éléments de Salaire
  En tant que gestionnaire de paie
  Je veux configurer les éléments de salaire
  Afin de calculer correctement les bulletins de paie

  Scenario: Création d'un élément de salaire
    Given je suis connecté en tant qu'administrateur
    When j'accède à la page "Éléments de Salaire"
    And je clique sur "Nouvel Élément"
    And je remplis les champs suivants:
      | Champ              | Valeur                    |
      | Code               | "IND_TRANSPORT"           |
      | Libellé           | "Indemnité de Transport" |
      | Type              | "Gain"                    |
      | Méthode de calcul | "Montant Fixe"           |
      | Base              | "1500"                    |
    Then l'élément est créé avec succès
    And apparaît dans la liste des éléments de salaire

  Scenario: Configuration d'une formule de calcul
    Given je suis sur la page d'édition d'un élément de salaire
    When je sélectionne "Formule" comme méthode de calcul
    And je définis la formule "SALAIRE_BASE * 0.1"
    Then le système valide la syntaxe de la formule
    And enregistre la configuration
```

### 1.2 Profils de Paie
```gherkin
Feature: Gestion des Profils de Paie
  En tant que gestionnaire RH
  Je veux définir des profils de paie
  Afin d'automatiser le calcul des salaires par catégorie

  Scenario: Création d'un profil de paie
    Given je suis sur la page "Profils de Paie"
    When je crée un nouveau profil "CADRE_SUPERIEUR"
    And j'associe les éléments suivants:
      | Élément            | Type     | Ordre |
      | SALAIRE_BASE      | Base     | 1     |
      | PRIME_ANCIENNETE  | Gain     | 2     |
      | CNSS              | Retenue  | 3     |
    Then le profil est enregistré
    And peut être assigné aux employés

  Scenario: Association profil-catégorie
    Given un profil de paie existant
    When j'accède à la page "Catégories"
    And je sélectionne une catégorie
    And j'associe le profil de paie
    Then tous les employés de cette catégorie héritent du profil
```

### 1.3 Calcul de Bulletin
```gherkin
Feature: Calcul Automatique des Bulletins
  En tant que gestionnaire de paie
  Je veux générer les bulletins de paie
  Afin de payer les employés correctement

  Scenario: Calcul bulletin individuel
    Given je sélectionne un employé
    And je choisis la période "Mai 2024"
    When je lance le calcul du bulletin
    Then le système:
      | Action                           | Résultat                        |
      | Récupère le profil de l'employé | Profil chargé                  |
      | Applique les éléments fixes     | Éléments calculés              |
      | Intègre les variables du mois   | Variables prises en compte     |
      | Calcule les cotisations         | Montants déduits               |
      | Détermine le net à payer        | Montant final calculé          |

  Scenario: Gestion des variables mensuelles
    Given un bulletin en cours de calcul
    When j'ajoute une variable mensuelle:
      | Type              | Valeur |
      | Heures supplémentaires | 10     |
      | Prime exceptionnelle   | 500    |
    Then le système recalcule le bulletin
    And met à jour le net à payer
```

## 2. Scénarios de Test Spécifiques

### 2.1 Tests Unitaires Prioritaires
```gherkin
Feature: Calculs de Paie
  Scénarios de test pour les fonctions de calcul

  Scenario: Calcul prime d'ancienneté
    Given un employé avec 5 ans d'ancienneté
    And un salaire de base de 50000
    When la fonction calculPrimeAnciennete est appelée
    Then le résultat devrait être 2500

  Scenario: Calcul CNSS
    Given un salaire brut de 45000
    When la fonction calculCNSS est appelée
    Then le résultat devrait respecter les tranches:
      | Tranche | Taux  | Plafond |
      | 1       | 4.48% | 6000    |
      | 2       | 3.96% | 14000   |
      | 3       | 1%    | illimité|
```

### 2.2 Tests d'Intégration Clés
```gherkin
Feature: Intégration Calculs-Interface
  Scénarios de test pour l'intégration UI-Logique

  Scenario: Mise à jour temps réel des calculs
    Given je suis sur le formulaire de bulletin
    When je modifie une variable
    Then les calculs sont mis à jour instantanément
    And les totaux sont recalculés
    And l'interface reflète les changements

  Scenario: Persistance des données de calcul
    Given un bulletin calculé
    When je sauvegarde le bulletin
    Then toutes les lignes de calcul sont enregistrées
    And l'historique est mis à jour
    And le bulletin peut être régénéré à l'identique
```

## 3. Critères d'Acceptation Détaillés

### 3.1 Performance des Calculs
```gherkin
Feature: Performance des Calculs de Paie
  Critères de performance pour les calculs

  Scenario: Calcul de masse
    Given une liste de 100 employés
    When je lance le calcul des bulletins du mois
    Then le temps total ne dépasse pas 30 secondes
    And la mémoire utilisée reste stable
    And aucune erreur n'est générée

  Scenario: Réactivité interface
    Given je suis sur un bulletin de paie
    When je modifie un élément variable
    Then la mise à jour des calculs prend moins de 500ms
    And l'interface reste responsive
```

### 3.2 Validation des Données
```gherkin
Feature: Validation des Données de Paie
  Règles de validation pour les données de paie

  Scenario: Validation formule de calcul
    Given je crée une nouvelle formule de calcul
    When j'entre une formule invalide
    Then le système détecte l'erreur immédiatement
    And affiche un message d'erreur explicite
    And empêche la sauvegarde

  Scenario: Cohérence des données
    Given je calcule un bulletin
    When le total des gains est inférieur aux retenues
    Then le système affiche un avertissement
    And demande une confirmation avant sauvegarde
```

## 4. Workflows Métier

### 4.1 Processus de Validation
```gherkin
Feature: Workflow de Validation des Bulletins
  Processus de validation multi-niveaux

  Scenario: Circuit de validation
    Given un bulletin calculé
    When je soumets le bulletin pour validation
    Then le workflow suit les étapes:
      | Étape          | Validateur        | Action                |
      | Vérification   | Gestionnaire Paie | Contrôle des calculs |
      | Approbation    | Chef Service      | Validation montants   |
      | Autorisation   | DRH              | Validation finale     |

  Scenario: Rejet avec modifications
    Given un bulletin en cours de validation
    When le validateur rejette le bulletin
    Then il doit fournir un motif
    And le bulletin retourne en édition
    And conserve l'historique des modifications
```

### 4.2 Clôture Mensuelle
```gherkin
Feature: Processus de Clôture Mensuelle
  Étapes de clôture de la paie mensuelle

  Scenario: Vérification pré-clôture
    Given tous les bulletins du mois sont calculés
    When je lance la vérification pré-clôture
    Then le système contrôle:
      | Point de contrôle                | Statut    |
      | Bulletins calculés               | Complet   |
      | Validations effectuées          | Complet   |
      | Variables mensuelles intégrées  | Vérifié  |
      | Totaux cohérents               | Validé    |

  Scenario: Génération documents de synthèse
    Given la période est validée
    When je lance la clôture
    Then le système génère:
      | Document                    | Format |
      | Journal de paie            | PDF    |
      | État des charges sociales  | Excel  |
      | Récapitulatif par service | PDF    |
``` 