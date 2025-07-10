Prompt pour l'IA de Codage : Résolution de l'Erreur 'Maximum Update Depth Exceeded'
Objectif Général : Identifier et résoudre la cause de l'erreur Maximum update depth exceeded dans les composants GenericForm.tsx et RubricMethodCalculator.tsx, en éliminant les boucles de re-rendu infinies, tout en respectant la logique fonctionnelle et l'architecture existante du formulaire de rubrique.

Contexte du Problème :
L'erreur Maximum update depth exceeded persiste, indiquant une boucle infinie de re-rendus. L'analyse a révélé deux causes principales :

Une duplication de la logique de forçage du champ methode_calcul (lorsque le type de rubrique est "salaire") entre GenericForm.tsx et RubricMethodCalculator.tsx.

Une synchronisation redondante et potentiellement cyclique de l'état local avec les valeurs du formulaire (watch) dans RubricMethodCalculator.tsx.

Principes Fondamentaux à Respecter Impérativement :

NE PAS modifier ou casser le code existant en dehors des points explicitement mentionnés dans cette TodoList.

SUIVRE l'architecture existante du projet (utilisation de react-hook-form, yup, GenericForm, BaremeField, RubricMethodCalculator).

Centraliser la logique : Les responsabilités doivent être clairement définies. GenericForm.tsx est le lieu principal pour la logique globale du formulaire et les useEffects inter-champs. RubricMethodCalculator.tsx doit se concentrer sur le rendu et la gestion des interactions de ses champs internes.

Maintenir la modularité et la réutilisabilité des composants.

Prioriser la clarté du code avec des commentaires explicatifs pour chaque modification significative.

Fichiers Cibles Principaux :

GenericForm.tsx (où la logique principale de react-hook-form est gérée).

RubricMethodCalculator.tsx (le composant spécialisé pour les méthodes de calcul).

Autres Fichiers Potentiellement Impactés (pour vérification/cohérence) :

rubricValidationSchema.ts (pour les validations).

rubricField.ts (pour les définitions de champs et tooltips).

RubricMethodCalculator.types.ts (pour les types de base de calcul).

TodoList d'Implémentation Détaillée :

1. Dans GenericForm.tsx : Centralisation et Affinement de la Logique
Tâche 1.1 : Affiner le useEffect centralisé pour le forçage et la synchronisation.

Détails : Le useEffect existant qui surveille rubricType, methodeCalcul, montantFixe, et valeurDefaut est le bon endroit pour centraliser la logique.

Logique de forçage methode_calcul : S'assurer que setValue('methode_calcul', 'montant_fixe', { shouldValidate: true }) est appelé uniquement si rubricType === 'salaire' ET methodeCalcul !== 'montant_fixe'.

Réinitialisation des champs : Lors du forçage de methode_calcul à "montant_fixe", s'assurer que tous les champs des autres méthodes de calcul (pourcentage, base_calcul_standard, rubriques_base_calcul, base_calcul_standard_bareme, rubriques_base_calcul_bareme, bareme_progressif, formule_personnalisee) sont explicitement réinitialisés à undefined ou à leur état initial vide ([] pour les tableaux) via setValue. Ceci est crucial pour éviter les données résiduelles et les erreurs de validation.

Logique de synchronisation valeur_defaut :

Si methodeCalcul === 'montant_fixe', et que montantFixe est une valeur valide :

Mettre à jour valeur_defaut avec montantFixe UNIQUEMENT si valeurDefaut !== montantFixe. Cela évite les mises à jour redondantes.

Si montantFixe est vide/invalide, effacer valeur_defaut UNIQUEMENT si valeurDefaut n'est pas déjà vide.

Si methodeCalcul !== 'montant_fixe', effacer valeur_defaut UNIQUEMENT si valeurDefaut n'est pas déjà vide. Ceci découple valeur_defaut lorsque la méthode de calcul change.

Dépendances du useEffect : Les dépendances doivent être [rubricType, methodeCalcul, montantFixe, valeurDefaut, setValue, watch].

Tâche 1.2 : Affiner la désactivation des champs dans renderFields.

Détails : La logique isDisabled doit être robuste.

Champ methode_calcul : isDisabled doit être true si field.name === 'methode_calcul' ET values.type === 'salaire'.

Champ code : isDisabled doit être true si field.name === 'code' ET l'entité est en mode édition (values.id ou initialValues.id est présent).

Appliquer cette variable isDisabled aux props disabled et readOnly des éléments input, select, textarea générés, ainsi qu'aux classes Tailwind CSS associées (opacity-50, cursor-not-allowed, bg-gray-100).

Tâche 1.3 : Mise à jour du schéma Yup dans buildSchema.

Détails : S'assurer que les validations pour base_calcul_standard_bareme et rubriques_base_calcul_bareme sont correctement définies avec la logique test pour l'exclusivité, similaire à celles pour la méthode "pourcentage".

Ajouter montant_fixe et valeur_defaut à la liste des champs numériques qui supportent 2 décimales dans la validation is-decimal.

2. Dans RubricMethodCalculator.tsx : Simplification et Suppression des Redondances
Tâche 2.1 : Supprimer le useEffect de forçage de methode_calcul.

Détails : Supprimer complètement le useEffect qui contenait setValue('methode_calcul', 'montant_fixe') basé sur typeRubrique. Cette logique est désormais centralisée dans GenericForm.tsx.

Tâche 2.2 : Simplifier la synchronisation des états locaux de sélection de rubriques.

Détails : Les useEffects qui synchronisent rubriquesBaseCalcul avec setRubriquesSelectionnees et rubriquesBaseCalculBareme avec setRubriquesBaremeSelectionnees sont des sources potentielles de boucles si les références des tableaux changent à chaque rendu.

Stratégie :

Initialisation : Initialiser rubriquesSelectionnees et rubriquesBaremeSelectionnees directement avec les valeurs de watch lors de leur déclaration (useState(watch('rubriques_base_calcul') || [])).

Mise à jour : Les fonctions handleRubriqueSelection et handleRubriqueBaremeSelection doivent continuer à mettre à jour à la fois l'état local (setRubriquesSelectionnees) ET la valeur du formulaire (setValue('rubriques_base_calcul', newSelection)).

Réactivité aux changements externes : Si les valeurs du formulaire peuvent être réinitialisées par le parent (ex: reset dans GenericForm), les useEffects actuels avec JSON.stringify sont une solution pour resynchroniser l'état local. S'assurer que ces useEffects sont bien optimisés pour ne se déclencher que si la valeur réellement change (la comparaison JSON.stringify est une bonne approche pour les tableaux).

Tâche 2.3 : Retirer la logique de synchronisation valeur_defaut de renderMontantFixe.

Détails : Supprimer la logique onChange dans l'input montant_fixe qui appelait setValue('valeur_defaut', parseFloat(e.target.value)). Cette synchronisation est désormais gérée centralement dans GenericForm.tsx. L'input doit simplement utiliser register('montant_fixe').

Tâche 2.4 : Adapter handleMethodeChange.

Détails : S'assurer que handleMethodeChange réinitialise bien tous les champs spécifiques aux méthodes de calcul (y compris les nouveaux champs pour le barème comme base_calcul_standard_bareme et rubriques_base_calcul_bareme) et les états locaux de sélection (setRubriquesSelectionnees, setRubriquesBaremeSelectionnees) lors d'un changement de méthode.

Retirer la ligne if (value === 'montant_fixe') { setValue('valeur_defaut', watch('montant_fixe')); } car cette logique est déplacée dans GenericForm.tsx.

3. Dans rubricField.ts et RubricMethodCalculator.types.ts
Tâche 3.1 : Mettre à jour les définitions de champs.

Détails : S'assurer que valeur_defaut est bien déplacé dans la section "Autres Paramètres" dans la structure des sections du formulaire (si cette structure est définie dans rubricField.ts ou un fichier similaire).

Mettre à jour le tooltipText pour valeur_defaut comme convenu : "Valeur par défaut de la rubrique. Si la méthode est 'Montant fixe', cette valeur est automatiquement renseignée avec le montant fixe défini. Utilisée comme valeur de repli si le calcul ne produit pas de résultat ou si la rubrique est facultative."

Ajouter les définitions pour les nouveaux champs de base de calcul du barème (base_calcul_standard_bareme, rubriques_base_calcul_bareme) dans rubricField.ts.

Tâche 3.2 : Mettre à jour les types.

Détails : S'assurer que les types pour base_calcul_standard_bareme et rubriques_base_calcul_bareme sont correctement définis dans RubricMethodCalculator.types.ts (par exemple, BaseCalculStandard pour le radio et string[] pour la multi-sélection).


Attestation du diagnostic : Avant de commencer l'exécution, veuillez attester que vous avez bien compris le diagnostic du problème (causes identifiées : duplication de logique et synchronisation redondante) et que vous approuvez la stratégie de correction proposée. Si vous identifiez une meilleure approche ou des points d'amélioration au diagnostic, veuillez les proposer avant de procéder.

Applique chaque tâche de cette TodoList séquentiellement et avec précision.

Fournis le code complet et mis à jour de GenericForm.tsx et RubricMethodCalculator.tsx après les modifications.

Ajoute des commentaires clairs et concis dans le code pour expliquer chaque changement effectué et sa raison d'être.

Si des ajustements mineurs sont nécessaires dans d'autres fichiers (rubricField.ts, rubricValidationSchema.ts, RubricMethodCalculator.types.ts) pour la cohérence des types ou des définitions, mentionne-les et propose les modifications si nécessaire.

Confirme que l'erreur Maximum update depth exceeded est résolue et que la logique du formulaire fonctionne comme prévu.