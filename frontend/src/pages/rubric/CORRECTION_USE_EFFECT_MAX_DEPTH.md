Prompt pour l'IA de Codage : Implémentation de la Solution GenericForm (Mise à Jour)
Objectif Général : Implémenter la correction de l'erreur "Maximum update depth exceeded" dans le composant GenericForm.tsx et s'assurer que la logique de forçage de la méthode de calcul, la désactivation visuelle du champ methode_calcul, le comportement du champ valeur_defaut, et la gestion de la base de calcul pour le barème progressif sont correctement appliqués, tout en respectant l'architecture existante.

Contexte du Problème :
Une erreur Maximum update depth exceeded se produit, indiquant une boucle infinie de re-rendus. Cette erreur est liée à l'interaction entre la surveillance des champs (watch) et la mise à jour des valeurs (setValue) via useEffect dans GenericForm.tsx, en particulier lorsque le type de la rubrique est "Salaire de base" et que methode_calcul doit être forcée à "Montant fixe".

Principes Fondamentaux à Respecter Impérativement :

NE PAS modifier ou casser le code existant en dehors des points explicitement mentionnés dans cette TodoList.

SUIVRE l'architecture existante du projet (utilisation de react-hook-form, yup, GenericForm, BaremeField, RubricMethodCalculator).

Maintenir la modularité et la réutilisabilité des composants.

Prioriser la clarté du code avec des commentaires explicatifs pour chaque modification significative.

Fichier Cible Principal :

GenericForm.tsx (se référer à l'artefact GenericForm_fix_max_depth_fr pour la solution détaillée).

Autres Fichiers Potentiellement Impactés (pour vérification/cohérence) :

RubricMethodCalculator.tsx (pour la prop isMethodSelectDisabled et les nouvelles bases de calcul).

rubricField.ts (pour les définitions des champs et les tooltips).

rubricValidationSchema.ts (pour les validations des nouveaux champs).

types.ts (pour les types des nouvelles bases de calcul).

TodoList d'Implémentation Détaillée :

1. Correction de l'erreur "Maximum update depth exceeded" dans GenericForm.tsx
Tâche : Implémenter la logique de useEffect pour gérer le forçage conditionnel de methode_calcul.

Détails :

Ajouter un useEffect dans GenericForm.tsx.

Ce useEffect doit surveiller les valeurs de rubricType (watch('type')) et methodeCalcul (watch('methode_calcul')).

À l'intérieur de cet effet, ajouter la condition : if (rubricType === 'salaire' && methodeCalcul !== 'montant_fixe').

Si la condition est vraie, appeler setValue('methode_calcul', 'montant_fixe', { shouldValidate: true });.

Crucial : Lors du forçage de methode_calcul, réinitialiser explicitement les valeurs des autres champs spécifiques aux méthodes de calcul alternatives (montant_fixe, pourcentage, base_calcul_standard, rubriques_base_calcul, bareme_progressif, formule_personnalisee) à undefined ou à leur état initial vide (ex: [] pour les tableaux, { tranches: [] } pour le barème). Ceci est essentiel pour éviter les données résiduelles et les erreurs de validation lorsque la méthode change.

Les dépendances du useEffect doivent être [rubricType, methodeCalcul, setValue].

2. Désactivation visuelle du champ methode_calcul dans GenericForm.tsx
Tâche : Rendre le sélecteur methode_calcul désactivé (grisé) lorsque le type de la rubrique est "Salaire de base".

Détails :

Dans la fonction renderFields de GenericForm.tsx, ajouter une logique pour déterminer si le champ actuel (field.name) est methode_calcul et si rubricType est "salaire".

Si ces conditions sont remplies, définir une variable isDisabled à true.

Appliquer cette variable isDisabled à la prop disabled de l'élément <select> qui rend methode_calcul.

Ajouter des classes Tailwind CSS (bg-gray-100, cursor-not-allowed, opacity-70) pour un rendu visuel clair de l'état désactivé.

Passer cette prop isDisabled (renommée isMethodSelectDisabled pour plus de clarté) au composant RubricMethodCalculator via ses props, afin qu'il puisse désactiver son propre sélecteur interne si nécessaire.

3. Section "Configuration du Paiement" (Mise à Jour)
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

Supprimer le champ valeur_defaut de cette section dans rubricField.ts. Il sera déplacé vers la section "Autres Paramètres".

4. Section "Méthode de Calcul" (Mise à Jour)
Fichiers Ciblés : RubricMethodCalculator.tsx, RubricMethodCalculator.types.ts, rubricField.ts, rubricValidationSchema.ts, GenericForm.tsx

Tâches :

methode_calcul (Sélection) :

Obligatoire.

Le choix de cette méthode doit conditionner l'affichage exclusif d'un seul des blocs de configuration suivants : "Montant fixe", "Pourcentage", "Barème progressif", "Formule personnalisée".

Forçage/Désactivation (Mise à jour) : Si le type de la rubrique est "Salaire de base", le sélecteur methode_calcul doit être désactivé (visuellement grisé avec opacity-50 et pointer-events-none) et sa valeur doit être forcée à "Montant fixe" (via setValue de react-hook-form). Seul le bloc "Montant fixe" s'affichera alors.

S'assurer que lors du changement de methode_calcul, les champs de l'ancienne méthode sont correctement réinitialisés (vidés ou mis à null) via setValue.

Clarté visuelle des sections de configuration : Dans RubricMethodCalculator.tsx, renforcer l'encapsulation visuelle de chaque fieldset (Montant fixe, Pourcentage, Barème progressif, Formule personnalisée) en utilisant des icônes plus grandes, des couleurs de fond distinctes et des titres clairs pour chaque legend.

Si methode_calcul = "Montant fixe" :

Le champ montant_fixe (nombre) s'affiche.

Obligatoire si affiché.

Doit être positif.

Nouveau : Remplissage automatique de valeur_defaut : Dans GenericForm.tsx (via un useEffect supplémentaire ou en étendant celui existant), implémenter une logique pour que si methode_calcul est "Montant fixe", le champ valeur_defaut soit automatiquement rempli avec la valeur saisie dans montant_fixe. S'assurer que cette mise à jour est conditionnelle pour éviter les boucles (ex: if (valeur_defaut !== montant_fixe) setValue('valeur_defaut', montant_fixe)).

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

Nouveau : Ajout de la Base de Calcul pour le Barème : Similaire à la méthode "Pourcentage", ajouter une section de sélection de la base de calcul pour le barème. Cette section doit inclure :

Des champs pour base_calcul_standard_bareme (radio buttons avec les mêmes options standard) et rubriques_base_calcul_bareme (multi-sélection avec filtre).

Implémenter la logique d'exclusivité entre ces deux groupes de choix.

Mettre à jour rubricField.ts et rubricValidationSchema.ts pour ces nouveaux champs et leur validation.

Mettre à jour RubricMethodCalculator.types.ts pour inclure les nouveaux types de base de calcul pour le barème.

Si methode_calcul = "Formule personnalisée" :

Le champ formule_personnalisee (zone de texte) s'affiche.

Obligatoire si affiché.

Doit contenir une formule valide (caractères alphanumériques, opérateurs mathématiques, parenthèses).

Aides contextuelles : Fournir des exemples de formules valides (ex: (SALAIRE_BRUT * 0.05) + PRIME_ANCIENNETE) et une liste des variables disponibles (ex: SALAIRE_BRUT, PRIME_ANCIENNETE, MONTANT_TOTAL_GAINS, IRPP_CALCULE, etc.) directement sous le textarea de la formule. Un bouton "Insérer une variable" qui insère le nom de la variable dans le textarea pourrait être un plus.

5. Section "Autres Paramètres" (Nouvelle organisation)
Fichiers Ciblés : rubricField.ts, GenericForm.tsx

Tâches :

Nouveau : Déplacer le champ valeur_defaut ici : Re-définir le champ valeur_defaut dans rubricField.ts pour qu'il apparaisse dans cette section.

Mise à jour du tooltip de valeur_defaut : Modifier son tooltipText à : "Valeur par défaut de la rubrique. Si la méthode est 'Montant fixe', cette valeur est automatiquement renseignée avec le montant fixe défini. Utilisée comme valeur de repli si le calcul ne produit pas de résultat ou si la rubrique est facultative."

Affichage conditionnel de valeur_defaut : Le champ valeur_defaut doit continuer à s'afficher UNIQUEMENT si la methode_calcul est "Montant fixe". (La logique de remplissage automatique est gérée au point 4. "Si methode_calcul = "Montant fixe"").

6. Affinements Généraux et Intégration
Fichiers Ciblés : GenericForm.tsx, RubricForm.tsx, RubricFormMain.tsx, EntityModal.tsx, rubricValidationSchema.ts

Tâches :

Améliorations UI/UX dans GenericForm.tsx (et composants liés) :

Implémenter le mécanisme d'infobulles (tooltip) de manière générique pour qu'il puisse être utilisé par les champs via une prop tooltipText dans FormField.

Améliorer le rendu des sections (formSections) avec des bordures, des fonds de couleur subtils ou un espacement plus prononcé pour les rendre plus distinctes.

Assurer des transitions CSS fluides pour l'apparition/disparition des champs conditionnels (ex: transition-all duration-300).

S'assurer que les messages d'erreur de yup apparaissent clairement et rapidement sous les champs concernés.

Mise à jour de rubricValidationSchema.ts :

Revoir et affiner tous les messages d'erreur de validation pour qu'ils soient clairs, concis et orientés utilisateur, évitant le jargon technique.

Ajouter/Mettre à jour les règles de validation pour la nouvelle base de calcul du barème progressif.

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