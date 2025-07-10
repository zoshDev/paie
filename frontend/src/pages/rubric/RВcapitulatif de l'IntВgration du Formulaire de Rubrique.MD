Prompt pour l'IA de Codage : Récapitulatif de l'Intégration du Formulaire de Rubrique
Objectif : Ce prompt récapitule les modifications nécessaires pour intégrer le formulaire de gestion des rubriques (RubricForm.tsx) dans la modale générique (EntityModals.tsx), afin qu'il puisse être utilisé pour les actions de création et de modification depuis la page de liste des rubriques (RubricsListPage.tsx), en utilisant react-hot-toast pour les notifications.

Contexte et Architecture :
Le projet suit une architecture React modulaire avec des composants génériques (EntityModals, GenericForm) et des composants spécifiques (RubricForm). L'objectif est de faire fonctionner RubricForm via EntityModals depuis RubricsListPage sans casser l'architecture existante.

Principes Clés à Respecter :

NE PAS casser le code existant.

SUIVRE l'architecture actuelle.

Maintenir la modularité et la réutilisabilité.

Ajouter des commentaires clairs pour toutes les modifications.

Résumé des Modifications Requises :

1. Dans RubricsListPage.tsx (La page de liste)
Rôle : Orchestrer l'ouverture de la modale et la gestion de la soumission du formulaire de rubrique.

Modifications :

Déclarer un nouvel état const [isSubmitting, setIsSubmitting] = useState(false); pour gérer l'état de chargement du formulaire.

Créer une fonction handleRubricSubmit(data: Record<string, any>) qui :

Met isSubmitting à true au début et à false à la fin.

Contient la logique de sauvegarde (simuler un appel API pour la création ou modification).

Utilise toast.success() en cas de succès et toast.error() en cas d'échec pour les notifications.

Appelle closeModal() après un succès.

Mettre à jour le composant <EntityModals /> en lui passant les props essentielles pour le RubricForm :

entityType="rubric" : Indique à EntityModals de rendre spécifiquement le RubricForm.

onSubmit={handleRubricSubmit} : Transmet la fonction de soumission.

isSubmitting={isSubmitting} : Transmet l'état de chargement.

Remplacer toutes les occurrences de alert() par toast.info() ou toast.success() pour les actions d'import/export et de suppression.

2. Dans EntityModals.tsx (La modale générique)
Rôle : Rendre le formulaire approprié en fonction du entityType et transmettre les props.

Modifications :

Aucune modification majeure n'est requise dans ce fichier car sa structure actuelle (renderForm avec le switch sur entityType) est déjà conçue pour ce type d'intégration. Il est déjà prêt à recevoir et transmettre entityType, onSubmit, et isSubmitting au RubricForm.

3. Dans RubricForm.tsx (Le formulaire de rubrique spécifique)
Rôle : Gérer la logique du formulaire et la soumission.

Modifications :

S'assurer qu'il reçoit bien les props entity, mode, onSubmit, isSubmitting, et onClose.

Confirmer que la fonction handleSubmit interne appelle la prop onSubmit reçue pour déclencher la logique de sauvegarde définie dans RubricsListPage.

Vérifier que les notifications sont gérées via toast.success() et toast.error().

4. Installation et Intégration de react-hot-toast
Rôle : Fournir un système de notifications non-bloquant et esthétique.

Modifications :

Assurer l'installation de la librairie : npm install react-hot-toast ou yarn add react-hot-toast.

Ajouter le composant <Toaster /> de react-hot-toast au niveau le plus haut de l'application (ex: App.tsx ou index.tsx) pour que les toasts soient disponibles globalement.

Instructions pour l'IA :
Implémente ces modifications en respectant scrupuleusement l'architecture existante. Fournis le code complet des fichiers modifiés, en mettant en évidence les ajouts et changements avec des commentaires.