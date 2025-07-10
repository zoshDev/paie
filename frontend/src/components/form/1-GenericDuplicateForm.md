Prompt pour l'IA de Codage : Création et Intégration du Composant Générique de Duplication (GenericDuplicateForm)
Objectif Général : Implémenter un composant React générique et réutilisable nommé GenericDuplicateForm.tsx qui gérera le processus de duplication de n'importe quelle entité. Cette fonctionnalité sera initialement intégrée à la page des profils de paie (ProfilPaieListPage.tsx), permettant de dupliquer un profil existant et d'en créer une nouvelle instance immédiatement modifiable.

Principes Fondamentaux à Respecter Impérativement :

Généricité : Le composant GenericDuplicateForm doit être conçu pour fonctionner avec n'importe quel type d'entités T (profils, rubriques, etc.), en utilisant des props pour la configuration.

Réutilisabilité : Le code doit être modulaire et facile à intégrer.

Cohérence UI/UX : L'interface utilisateur doit être intuitive et suivre les conventions visuelles de l'application (Tailwind CSS).

Clarté du Code : Utiliser des commentaires exhaustifs en français pour expliquer la logique, les props et les choix de conception.

Performance : Optimiser les re-rendus en utilisant useMemo et useCallback si pertinent.

Notifications : Utiliser react-hot-toast pour toutes les notifications utilisateur.

Conservation des fonctionnalités existantes : Aucune fonctionnalité existante ne doit être cassée ou modifiée involontairement.

Contexte des Fichiers Existants (Référence pour l'IA) :

EntityModal.tsx : La modale générique qui affichera GenericDuplicateForm.

ProfilPaieForm.tsx : Un exemple de formulaire spécifique à une entité qui sera rendu par GenericDuplicateForm.

ProfilPaieListPage.tsx : La page principale où la fonctionnalité de duplication sera initiée pour les profils de paie.

ProfilPaie interface (située dans ../../pages/profilPaie/types.ts ou similaire) : Structure de l'entité de profil de paie.

react-hot-toast (assumé installé).

Détail des Exigences et des Tâches (Instructions Spécifiques pour l'IA) :

1. Création du Composant GenericDuplicateForm.tsx
Fichier Cible : components/form/GenericDuplicateForm.tsx (ou un chemin logique).

Props du Composant (Interface GenericDuplicateFormProps<T>) :

entityToDuplicate: T : L'objet complet de l'entité originale à dupliquer. T doit être un type générique avec au moins un id: string.

onClose: () => void : Fonction à appeler pour fermer la modale.

onDuplicateSubmit: (duplicatedData: Partial<T>) => void : Callback principal. Appelé lorsque l'utilisateur soumet le formulaire. duplicatedData contient les valeurs finales (avec le nouveau code et nom), mais sans l'ID de la nouvelle entité, car l'ID sera généré par le backend ou le parent.

isSubmitting?: boolean : Booléen pour désactiver les boutons pendant la soumission.

renderEntityForm: (initialData: Partial<T>, onSubmit: (data: Partial<T>) => void, isSubmitting: boolean, onClose: () => void) => React.ReactNode :

Une prop cruciale pour la généricité. C'est une fonction fournie par le parent qui sait comment rendre le formulaire spécifique à l'entité (ProfilPaieForm, RubricForm, etc.).

GenericDuplicateForm lui passera les initialData préparées, un onSubmit interne (qui appellera onDuplicateSubmit), l'état isSubmitting, et onClose.

generateNewCode: (originalCode: string | undefined) => string :

Fonction fournie par le parent pour générer le nouveau code suggéré. Ex: (code) => code ? codeCOPIE{Date.now().toString().slice(-4)}:NOUVEAU_CODE_${Date.now().toString().slice(-4)}``

generateNewName?: (originalName: string | undefined) => string :

Fonction optionnelle pour générer le nouveau nom suggéré. Ex: (name) => name ? Copie de ${name}:Nouvelle Entité Copiée``. Si non fournie, le nom original sera copié tel quel.

codeFieldName?: keyof T : (Par défaut 'code') Le nom de la clé du champ "code" dans l'objet T.

nameFieldName?: keyof T : (Par défaut 'nom') Le nom de la clé du champ "nom" dans l'objet T.

modalTitle?: string : Titre personnalisé pour le haut de la modale de duplication (ex: "Dupliquer le profil de paie").

introText?: string : Court texte explicatif sous le titre.

Logique Interne et UI/UX :

Utiliser useState et useMemo pour la gestion des données préparées (la copie de entityToDuplicate avec les nouveaux code/nom).

Utiliser react-hook-form pour gérer les champs du formulaire (au minimum le code et le nom) affichés dans GenericDuplicateForm avant de passer la main à renderEntityForm. Ces champs sont là pour que l'utilisateur puisse ajuster le code/nom avant la création finale.

Le GenericDuplicateForm doit afficher son propre titre (modalTitle) et texte d'introduction (introText) de manière proéminente à l'intérieur de son propre rendu.

Afficher les champs "Code" et "Nom" avec les valeurs suggérées et permettre leur modification par l'utilisateur. Ces champs doivent être liés via react-hook-form (ex: register et watch).

Le composant renderEntityForm doit être rendu, en lui passant les données préparées comme initialData, le onSubmit interne de GenericDuplicateForm et l'état isSubmitting.

Gestion de la soumission :

Le onSubmit du formulaire spécifique (renderEntityForm) sera intercepté par GenericDuplicateForm.

Une fois ce formulaire interne soumis, le GenericDuplicateForm appellera son prop onDuplicateSubmit avec les données complètes du formulaire, y compris les modifications apportées par l'utilisateur aux champs Code et Nom.

Boutons : "Annuler" (appelle onClose) et "Créer la copie" (déclenche la soumission, désactivé si isSubmitting).

Notifications : Afficher des toasts pour le succès/échec de la soumission.

2. Mise à Jour de EntityModal.tsx
Fichier Cible : components/ui/Modal/EntityModal.tsx

Tâches :

Mettre à jour le type ModalMode : Ajouter "duplicate" à l'union de types ModalMode.

Ajouter la prop renderDuplicateForm :

Définir la prop dans l'interface EntityModalsProps :

renderDuplicateForm?: (entity: T | null, onClose: () => void, onSubmit: (data: Partial<T>) => void) => React.ReactNode;

Gérer le nouveau mode dans le switch :

Ajouter un nouveau case pour "duplicate".

Dans ce case :

Définir le title de la modale comme un titre générique et clair (ex: "Opération de Duplication"). C'est le titre de la modale elle-même, et le GenericDuplicateForm affichera son titre spécifique à l'intérieur de son contenu.

Définir le content pour rendre renderDuplicateForm, en lui passant entity (l'original), onClose, et le handleFormSubmit de EntityModal comme callback de soumission.

S'assurer que showFooter est false car le composant GenericDuplicateForm gère ses propres boutons.

3. Mise à Jour de ProfilPaieListPage.tsx
Fichier Cible : ProfilPaieListPage.tsx

Tâches :

Importation : Importer GenericDuplicateForm et DocumentDuplicateIcon (remplaçant Cog6ToothIcon) de @heroicons/react/24/outline.

Modifier le bouton "Configurer" pour la duplication :

Dans les columns du DataTable, localiser le bouton qui déclenche l'action de duplication (qui était précédemment assigné à l'icône Cog6ToothIcon si présente, ou qui sera ajouté).

Remplacer l'icône de ce bouton par DocumentDuplicateIcon.

Modifier son onClick pour qu'il appelle openModal(profil, "duplicate").

Le title du bouton doit être "Dupliquer le profil".

Implémenter renderDuplicateForm :

Créer une fonction renderDuplicateForm dans ProfilPaieListPage.tsx.

Cette fonction sera passée à la prop renderDuplicateForm de EntityModals.

À l'intérieur de cette fonction, instancier GenericDuplicateForm, en lui passant les props spécifiques aux profils de paie :

renderDuplicateForm={(entityToDupl, close, submit) => (
  <GenericDuplicateForm<ProfilPaie> // Spécifier le type générique
    entityToDuplicate={entityToDupl as ProfilPaie} // Assurer le bon type
    onClose={close}
    onDuplicateSubmit={handleProfilPaieSubmit} // Votre fonction existante de création/édition
    isSubmitting={isSubmitting}
    renderEntityForm={(initialData, formSubmit, formSubmitting, formClose) => (
      <ProfilPaieForm
        initialData={initialData}
        onSubmit={formSubmit} // Important : propager l'onSubmit interne
        isSubmitting={formSubmitting}
        mode="create" // Le formulaire est toujours en mode "création" pour une duplication
        onClose={formClose}
      />
    )}
    generateNewCode={(originalCode) => originalCode ? `${originalCode}_C_${Date.now().toString().slice(-4)}` : `NEW_PROF_C_${Date.now().toString().slice(-4)}`}
    generateNewName={(originalName) => originalName ? `Copie de ${originalName}` : `Nouveau Profil Copié`}
    modalTitle="Dupliquer le Profil de Paie"
    introText="Modifiez le code et le nom de la copie avant de la créer."
  />
)}

Mettre à jour handleProfilPaieSubmit :

Modifier la fonction handleProfilPaieSubmit (qui gère la création/édition des profils) pour qu'après avoir ajouté la nouvelle entité dupliquée à la liste (setProfilsPaie(prev => [...prev, newProfil])), elle ne ferme pas la modale directement.

Au lieu de closeModal(), elle devrait appeler openModal(newProfil, "edit"). Cela ouvrira immédiatement la modale en mode édition pour le profil nouvellement créé (la copie), permettant l'ajustement direct.

Important : S'assurer que newProfil a bien l'ID généré par le frontend pour pouvoir le passer en mode édition.

Exigences Additionnelles (pour tous les nouveaux composants/fichiers)
Fichiers de Test : Pour chaque nouveau composant ou fichier de logique métier créé (GenericDuplicateForm.tsx), inclure un fichier de test associé (ex: GenericDuplicateForm.test.tsx ou GenericDuplicateForm.spec.tsx). Ces tests devront couvrir les cas d'utilisation principaux et les props, en utilisant une bibliothèque de test standard (ex: @testing-library/react, Jest).

Fichiers README.md : Pour chaque nouveau composant significatif (comme GenericDuplicateForm.tsx), créer un fichier README.md dans le même dossier que le composant. Ce README doit être bien détaillé et digeste, incluant :

Une brève description de l'objectif du composant.

Les props qu'il accepte, avec leur type et leur description.

Des exemples d'utilisation simples.

Toute information pertinente sur sa logique interne ou ses dépendances.