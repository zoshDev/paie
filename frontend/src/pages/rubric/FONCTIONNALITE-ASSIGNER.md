Objectif Général : Implémenter une nouvelle fonctionnalité d'action groupée sur la page de liste des rubriques (RubricListPage.tsx) qui permettra d'assigner plusieurs rubriques sélectionnées à un ou plusieurs profils de paie. Cette action déclenchera l'ouverture d'une modale (EntityModal.tsx) contenant un nouveau composant de formulaire (AssignRubricsToProfilesForm.tsx) pour gérer la sélection des profils.

Principes Fondamentaux à Respecter Impérativement :

NE PAS modifier ou casser le code existant en dehors des points explicitement mentionnés dans cette TodoList.

SUIVRE l'architecture existante du projet (utilisation de EntityModal, DataTable, BulkActionsBar, et l'intégration de nouveaux formulaires via des props de rendu dans EntityModal).

Maintenir la modularité et la réutilisabilité des composants.

Prioriser la clarté du code avec des commentaires explicatifs pour chaque modification significative.

Utiliser react-hot-toast pour toutes les notifications utilisateur.

Contexte des Fichiers Existants (Référence pour l'IA) :

AssignRubricsToProfilesForm.tsx : Le composant de formulaire déjà fourni, qui gère la sélection des profils.

EntityModal.tsx : Le composant de modale générique qui affichera le formulaire d'assignation.

RubricListPage.tsx : La page de liste des rubriques (simulée pour la démo) où l'action groupée sera déclenchée.

toast_system_code_corrected (ou react-hot-toast si déjà installé) : Pour les notifications.

Détail des Exigences et des Tâches (Instructions Spécifiques pour l'IA) :

1. Dans RubricListPage.tsx (Simulé)
Fichier Cible : RubricListPage.tsx

Tâches :

Ajouter le bouton "Assigner à profil(s)" :

Dans la BulkActionsBar (qui s'affiche lorsque des rubriques sont sélectionnées), ajouter un nouvel objet action au tableau actions.

Le label de cette action doit être "Assigner à profil(s)".

L'icon doit être <LinkIcon className="w-4 h-4" /> (assurez-vous que LinkIcon est importé de @heroicons/react/24/outline).

L'onClick de cette action doit appeler openModal(null, "assign-to-profiles").

Le className de cette action peut être "text-indigo-600 hover:bg-indigo-50" pour une cohérence visuelle.

Mettre à jour l'appel à EntityModals :

Dans le composant EntityModals, ajouter une nouvelle prop renderAssignToProfiles.

Cette prop doit être une fonction qui prend (ids, close, submit) en arguments et qui retourne le composant AssignRubricsToProfilesForm.

La structure de l'appel doit être similaire à ceci :

renderAssignToProfiles={(ids, close, submit) => (
  <AssignRubricsToProfilesForm
    selectedRubricIds={ids} // Passer les IDs des rubriques sélectionnées
    onClose={close}
    onSubmit={submit}
  />
)}

S'assurer que AssignRubricsToProfilesForm est correctement importé.

Gestion de la soumission de l'assignation :

Implémenter une fonction handleAssignRubricsToProfiles dans RubricListPage.tsx. Cette fonction sera passée comme onSubmit au AssignRubricsToProfilesForm via EntityModals.

Cette fonction recevra rubricIds: string[] et profilIds: string[] en arguments.

À l'intérieur de handleAssignRubricsToProfiles, afficher un message de succès via toast.success() (ex: toast.success(${rubricIds.length} rubrique(s) assignée(s) à ${profilIds.length} profil(s).);).

Appeler clearSelection() pour désélectionner toutes les rubriques après l'assignation réussie.

Appeler closeModal() pour fermer la modale.

Mettre à jour le modalMode : S'assurer que le type modalMode dans RubricListPage.tsx inclut "assign-to-profiles".

2. Dans EntityModal.tsx
Fichier Cible : EntityModal.tsx

Tâches :

Mettre à jour le type ModalMode : Ajouter "assign-to-profiles" à l'union de types ModalMode.

Ajouter la prop renderAssignToProfiles :

Définir la prop dans l'interface EntityModalsProps :

renderAssignToProfiles?: (selectedRubricIds: string[], onClose: () => void, onSubmit: (rubricIds: string[], profilIds: string[]) => void) => React.ReactNode;

Gérer le nouveau mode dans le switch :

Ajouter un nouveau case pour "assign-to-profiles".

Dans ce case :

Définir le title de la modale (ex: "Assigner des rubriques à des profils de paie").

Définir le content pour rendre renderAssignToProfiles, en lui passant selectedIds (qui sont les IDs des rubriques), onClose, et une fonction onSubmit qui appellera la prop onDeleteConfirm ou une nouvelle prop onAssignConfirm de EntityModals (pour cet usage, onDeleteConfirm peut être réutilisé si sa signature est adaptée, ou une nouvelle prop onAssignConfirm est préférable pour la clarté). Pour simplifier, nous allons passer un callback qui appelle handleAssignRubricsToProfiles défini dans RubricListPage.tsx.

S'assurer que showFooter est false car le composant AssignRubricsToProfilesForm gère ses propres boutons.

3. Dans AssignRubricsToProfilesForm.tsx
Fichier Cible : AssignRubricsToProfilesForm.tsx

Tâches :

Vérification (aucune modification majeure attendue) :

Confirmer que le composant reçoit bien selectedRubricIds via ses props.

Confirmer que la logique de filtre (searchTerm), de sélection (selectedProfils), de désélection individuelle (handleRemoveProfil), et de réinitialisation (handleResetSelection) est déjà fonctionnelle comme décrit.

Confirmer que la soumission du formulaire (onSubmit) passe correctement les selectedRubricIds et les profilIds sélectionnés.

Assurez-vous que les notifications toast.success, toast.info, toast.error sont déjà utilisées pour un feedback utilisateur immédiat.