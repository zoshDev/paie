Prompt pour l'IA de Codage : Implémentation du Formulaire de Gestion des Rubriques
Objectif Général : Implémenter et améliorer le formulaire de gestion des rubriques de paie (création et modification) pour le rendre efficient, simple et intuitif, en consolidant les logiques fonctionnelles et les améliorations d'interface définies. Le formulaire final (RubricForm.tsx) doit s'afficher dans la modale EntityModal.tsx pour les opérations de création et de modification, déclenchées par des boutons d'édition et de création.

Principes Fondamentaux à Respecter Impérativement :

NE PAS modifier ou casser le code existant en dehors des points explicitement mentionnés dans cette TodoList.

SUIVRE l'architecture existante du projet (utilisation de GenericForm, react-hook-form, yup, EntityModal, etc.).

Maintenir la modularité et la réutilisabilité des composants.

Prioriser la clarté du code avec des commentaires explicatifs pour chaque modification significative.

Contexte des Fichiers Existants :
Le système actuel utilise les composants et définitions suivants. L'IA doit se référer à ces fichiers pour comprendre la structure et les points d'intégration :

EntityModal.tsx : Gère l'affichage des modales (création, édition, suppression).

RubricForm.tsx : Le formulaire principal pour la configuration des rubriques, qui utilise GenericForm.

RubricFormMain.tsx : Le composant de page qui orchestre le formulaire de rubrique, gère les modes création/édition et l'intégration avec la navigation.

GenericForm.tsx : Un composant de formulaire générique basé sur react-hook-form et yup, capable de rendre divers types de champs et de gérer des sections.

RubricMethodCalculator.tsx : Un composant spécialisé pour la configuration des différentes méthodes de calcul d'une rubrique.

RubricMethodCalculator.types.ts : Définit les types et interfaces pour RubricMethodCalculator.

BaremeField.tsx : Un composant pour la gestion des tranches de barème progressif.

rubricField.ts : La configuration statique des champs du formulaire de rubrique.

rubricValidationSchema.ts : Le schéma de validation Yup pour l'ensemble des champs de rubrique.

types.ts : Définit les interfaces TypeScript Rubric et RubricFormData.

Structure Générale du Formulaire :
Le formulaire sera une longue page déroulante, organisée en sections distinctes (Informations Générales, Configuration du Paiement, Méthode de Calcul, Autres Paramètres) pour une meilleure clarté visuelle et navigation.

Détail des Exigences par Section (Instructions Spécifiques pour l'IA) :

1. Section "Informations Générales"
Fichiers Ciblés : rubricField.ts, GenericForm.tsx

Tâches :

code (Texte) :

Assurer la validation d'unicité (si un mécanisme est disponible ou à simuler pour l'IA).

En mode édition, modifier la configuration du champ code dans rubricField.ts pour ajouter une propriété disabled: true ou readOnly: true (selon la meilleure pratique avec GenericForm et react-hook-form pour rendre le champ non modifiable).

type (Sélection) :

Dans GenericForm.tsx (ou un composant wrapper si nécessaire), implémenter un mécanisme d'infobulle (tooltip) pour le champ type. L'infobulle doit afficher le texte suivant au survol : "Salaire : Rémunération de base ; Gain : Ajout au salaire ; Déduction : Retrait du salaire."

description (Zone de texte) :

Ajouter un placeholder au champ description dans rubricField.ts avec le texte : "Décrivez l'objectif et l'utilisation de cette rubrique".

ordre_application (Nombre entier) :

Dans GenericForm.tsx (ou un composant wrapper si nécessaire), implémenter une infobulle (tooltip) pour ce champ. Texte de l'infobulle : "Définit l'ordre de calcul. Ex: Salaires (1xx), Gains (2xx), Déductions (3xx)."

Dans rubricValidationSchema.ts, ajouter ou modifier les règles de validation pour ordre_application afin qu'il respecte la convention de préfixe basée sur le type de rubrique (1xx pour salaire, 2xx pour gain, 3xx pour déduction). Les messages d'erreur doivent être explicites.

2. Section "Configuration du Paiement"
Fichiers Ciblés : rubricField.ts, GenericForm.tsx, rubricValidationSchema.ts

Tâches :

qui_paie (Sélection) :

Envisager une petite indication visuelle (icône d'information) ou textuelle près du champ qui_paie pour rappeler que les taux dépendent de ce choix. Cette indication doit être subtile et ne pas surcharger l'interface.

taux_employe (Nombre, Pourcentage) et taux_employeur (Nombre, Pourcentage) :

Mettre à jour la logique showIf dans rubricField.ts :

Pour taux_employe, la condition showIf doit être : (data.qui_paie === "employe" || data.qui_paie === "les_deux") && data.type === "deduction".

Pour taux_employeur, la condition showIf doit être : (data.qui_paie === "employeur" || data.qui_paie === "les_deux") && data.type === "deduction".

Explication pour l'IA : Cette modification supprime la restriction data.type !== "salaire" && data.type !== "gain" et assure que les taux ne s'affichent que pour les rubriques de type "Déduction", car c'est là que la notion de taux de participation est pertinente.

Dans GenericForm.tsx (ou un composant wrapper), implémenter des infobulles (tooltip) pour ces champs.

taux_employe : "Pourcentage du montant de la rubrique déduit de la part de l'employé."

taux_employeur : "Pourcentage du montant de la rubrique à la charge de l'employeur."

Dans rubricValidationSchema.ts, s'assurer que les règles when pour ces champs les rendent obligatoires uniquement si elles sont affichées (selon la nouvelle logique showIf).

valeur_defaut (Nombre) :

Dans GenericForm.tsx (ou un composant wrapper), implémenter une infobulle (tooltip) pour ce champ. Texte de l'infobulle : "Valeur utilisée si le calcul de la rubrique ne produit pas de résultat ou si elle est facultative."

S'assurer que son showIf est bien data.methode_calcul === "montant_fixe".

3. Section "Méthode de Calcul"
Fichiers Ciblés : RubricMethodCalculator.tsx, RubricMethodCalculator.types.ts, rubricField.ts, rubricValidationSchema.ts

Tâches :

methode_calcul (Sélection) :

Obligatoire.

Le choix de cette méthode doit conditionner l'affichage exclusif d'un seul des blocs de configuration suivants : "Montant fixe", "Pourcentage", "Barème progressif", "Formule personnalisée".

Forçage/Désactivation (Mise à jour) : Si le type de la rubrique est "Salaire de base", le sélecteur methode_calcul doit être désactivé (visuellement grisé avec opacity-50 et pointer-events-none) et sa valeur doit être forcée à "Montant fixe" (via setValue de react-hook-form). Seul le bloc "Montant fixe" s'affichera alors.

S'assurer que lors du changement de methode_calcul, les champs de l'ancienne méthode sont correctement réinitialisés (vidés ou mis à null) via setValue.

Clarté visuelle des sections de configuration : Dans RubricMethodCalculator.tsx, renforcer l'encapsulation visuelle de chaque fieldset (Montant fixe, Pourcentage, Barème progressif, Formule personnalisée) en utilisant des icônes plus grandes, des couleurs de fond distinctes et des titres clairs pour chaque legend.

Si methode_calcul = "Pourcentage" :

Le champ pourcentage (nombre, entre 0 et 100) s'affiche et est obligatoire.

Un groupe de choix pour la Base de Calcul s'affiche, offrant une exclusivité stricte entre :

base_calcul_standard (Radio buttons) :

Options de bases standard (Cameroun) : "Salaire brut", "Salaire net", "Salaire cotisable (CNPS)", "Revenu net imposable (IRPP)". Ces options devront être définies dans RubricMethodCalculator.types.ts et utilisées dans RubricMethodCalculator.tsx.

Champ de filtre : Inclure un champ de recherche (input type="text") au-dessus de la liste des bases standard pour permettre de filtrer les options affichées.

Comportement exclusif : Si une option est sélectionnée, le bloc rubriques_base_calcul (multi-sélection) doit être désactivé et visuellement grisé (opacity-50, pointer-events-none).

rubriques_base_calcul (Multi-sélection de rubriques disponibles avec filtre) :

Comportement exclusif : Si au moins une rubrique est sélectionnée, les radio buttons base_calcul_standard (et leur filtre) doivent être désactivés et grisés.

Si aucune rubrique n'est sélectionnée, les radios base_calcul_standard redeviennent actives.

Message d'aide contextuel : Un petit texte informatif sous le titre "Base de calcul" expliquant cette exclusivité (ex: "Choisissez une base standard prédéfinie OU sélectionnez une ou plusieurs rubriques spécifiques pour le calcul.").

Validation : Au moins une base (standard OU rubriques) doit être sélectionnée si la méthode est "Pourcentage".

Si methode_calcul = "Barème progressif" :

Le composant BaremeField (pour bareme_progressif) s'affiche.

Doit contenir au moins une tranche.

Les validations de BaremeField (min < max, pas de chevauchement, taux positif) doivent être intégrées et les messages d'erreur clairs.

Si methode_calcul = "Formule personnalisée" :

Le champ formule_personnalisee (zone de texte) s'affiche.

Obligatoire si affiché.

Doit contenir une formule valide (caractères alphanumériques, opérateurs mathématiques, parenthèses).

Aides contextuelles : Fournir des exemples de formules valides (ex: (SALAIRE_BRUT * 0.05) + PRIME_ANCIENNETE) et une liste des variables disponibles (ex: SALAIRE_BRUT, PRIME_ANCIENNETE, MONTANT_TOTAL_GAINS, IRPP_CALCULE, etc.) directement sous le textarea de la formule. Un bouton "Insérer une variable" qui insère le nom de la variable dans le textarea pourrait être un plus.

4. Affinements Généraux et Intégration
Fichiers Ciblés : GenericForm.tsx, RubricForm.tsx, RubricFormMain.tsx, EntityModal.tsx, rubricValidationSchema.ts

Tâches :

Améliorations UI/UX dans GenericForm.tsx (et composants liés) :

Implémenter le mécanisme d'infobulles (tooltip) de manière générique pour qu'il puisse être utilisé par les champs via une prop tooltipText dans FormField.

Améliorer le rendu des sections (formSections) avec des bordures, des fonds de couleur subtils ou un espacement plus prononcé pour les rendre plus distinctes.

Assurer des transitions CSS fluides pour l'apparition/disparition des champs conditionnels (ex: transition-all duration-300).

S'assurer que les messages d'erreur de yup apparaissent clairement et rapidement sous les champs concernés.

Mise à jour de rubricValidationSchema.ts :

Revoir et affiner tous les messages d'erreur de validation pour qu'ils soient clairs, concis et orientés utilisateur, évitant le jargon technique.

Intégration du formulaire dans la modale et la page "RubricListPage" :

Le formulaire final (RubricForm.tsx) doit être directement intégré et répondre aux actions 'create' et 'edit' de la page RubricListPage. Cela signifie que RubricForm.tsx sera le composant principal utilisé par EntityModal.tsx pour ces actions.

Modifier EntityModal.tsx : S'assurer que le composant RubricForm.tsx est correctement rendu lorsque mode est 'create' ou 'edit', en lui passant les props nécessaires (entity, onClose, onSubmit, isSubmitting).

Adapter RubricForm.tsx : Ajuster ses props et sa logique interne pour qu'il fonctionne parfaitement en tant que composant au sein de EntityModal.tsx (recevoir initialData, onSubmit, isSubmitting via props).

RubricFormMain.tsx (ou la future RubricListPage) : Ce composant sera responsable de :

Gérer l'affichage de la liste des rubriques.

Déclencher l'ouverture de la modale EntityModal.tsx en mode "création" (sans entity) ou "édition" (en lui passant l'entité de la rubrique à modifier).

Gérer les callbacks onClose et onDeleteConfirm de la modale.

Système de notifications "toast" (Mise à jour) :

Installer la librairie react-hot-toast : npm install react-hot-toast ou yarn add react-hot-toast.

Intégrer Toaster : Ajouter le composant <Toaster /> de react-hot-toast au niveau le plus haut de l'application (ex: App.tsx ou index.tsx).

Remplacer toutes les occurrences de alert() (notamment dans RubricFormMain.tsx et RubricForm.tsx) par des appels à toast.success(), toast.error(), toast.info(), toast.warning() de react-hot-toast selon le contexte.

Nettoyage des sections de débogage :

Retirer ou conditionner l'affichage des sections de débogage (Sélecteur d'exemples, Données actuelles du formulaire) pour les builds de production (process.env.NODE_ENV !== 'production').