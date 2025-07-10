Récapitulatif des Entités et Attributs du Système de Paie (Version 1)
Ce document centralise la définition des entités principales de notre système de paie et leurs attributs clés, mis à jour à l'issue de notre brainstorming sur la gestion des employés et des profils de paie.

1. Entité : Rubrique (Rubric)
Représente une composante individuelle de la paie (salaire, prime, déduction).

id: string - Identifiant unique de la rubrique.

code: string - Code alphanumérique unique de la rubrique (ex: SB, PRIME_TRANSPORT).

nom: string - Nom descriptif de la rubrique (ex: "Salaire de Base", "Prime de Transport").

type: 'salaire' | 'gain' | 'deduction' - Catégorie de la rubrique (salaire de base, ajout au gain, ou déduction).

methode_calcul: string - Méthode utilisée pour calculer la rubrique (montant fixe, pourcentage, barème progressif, formule personnalisée).

montant_fixe?: number - Montant fixe si applicable.

pourcentage?: number - Pourcentage si applicable.

base_calcul_standard?: string - Base de calcul standard (ex: "Salaire brut", "Salaire net") si la méthode est "pourcentage" ou "barème progressif".

rubriques_base_calcul?: string[] - Liste des IDs de rubriques utilisées comme base de calcul (si applicable).

bareme_progressif?: object - Structure du barème avec tranches (min, max, taux).

formule_personnalisee?: string - Formule de calcul personnalisée.

description?: string - Description détaillée de la rubrique.

ordre_application?: number - Ordre de calcul de la rubrique.

qui_paie?: 'employe' | 'employeur' | 'les_deux' - Indique qui est responsable du paiement/déduction.

taux_employe?: number - Taux applicable à la part de l'employé.

taux_employeur?: number - Taux applicable à la part de l'employeur.

valeur_defaut?: number - Valeur par défaut de la rubrique (utilisée pour montant fixe ou comme repli).

2. Entité : ProfilPaie (Payroll Profile)
Représente un ensemble cohérent de rubriques de paie, définissant une structure de paie standard.

id: string - Identifiant unique du profil de paie.

code: string - Code unique du profil.

nom: string - Nom du profil (ex: "Cadre Standard", "Technicien Junior").

description?: string - Description du profil.

rubriques: ProfilPaieRubrique[] - Tableau des rubriques associées à ce profil.

rubricId: string - ID de la rubrique.

code: string - Code de la rubrique.

nom: string - Nom de la rubrique.

type: 'salaire' | 'gain' | 'deduction' - Type de la rubrique.

ordre: number - Ordre d'application de la rubrique dans le profil.

Statut : Peut être "standard" (utilisé par des catégories) ou "personnel" (une copie dédiée à un ou plusieurs employés).

3. Entité : Catégorie (Category)
Regroupe les employés sous une classification commune, et leur associe un profil de paie standard.

id: string - Identifiant unique de la catégorie.

nom: string - Nom de la catégorie (ex: "Cadre Administratif", "Opérateur de Production").

description?: string - Description de la catégorie.

standard_profil_paie_id: string - ID du ProfilPaie standard associé par défaut à cette catégorie.

4. Entité : Employé (Employee)
Représente un individu au sein de l'entreprise, avec ses informations personnelles et son profil de paie.

id: string - Identifiant unique de l'employé.

nom: string - Nom de famille de l'employé.

prenom: string - Prénom de l'employé.

matricule: string - Matricule unique de l'employé.

salaire_de_base: number - Salaire de base de l'employé.

category_id: string - ID de la Catégorie à laquelle l'employé est rattaché.

personal_profil_paie_id?: string - [Clé] ID du ProfilPaie personnel de l'employé. Si défini, ce profil est utilisé ; sinon, l'employé hérite du profil de sa catégorie.

Logique de Résolution du ProfilPaie Effectif pour un Employé :

Si employe.personal_profil_paie_id est défini, le ProfilPaie associé à cet ID est le profil effectif de l'employé.

Sinon, le ProfilPaie associé à employe.categorie.standard_profil_paie_id est le profil effectif de l'employé.