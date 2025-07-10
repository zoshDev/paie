import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Interface pour les props du composant générique de duplication
export interface GenericDuplicateFormProps<T> {
  // L'objet complet de l'entité originale à dupliquer
  entityToDuplicate: T;
  
  // Fonction à appeler pour fermer la modale
  onClose: () => void;
  
  // Callback principal appelé lorsque l'utilisateur soumet le formulaire
  onDuplicateSubmit: (duplicatedData: Partial<T>) => void;
  
  // Booléen pour désactiver les boutons pendant la soumission
  isSubmitting?: boolean;
  
  // Fonction de rendu du formulaire spécifique à l'entité
  renderEntityForm: (
    initialData: Partial<T>, 
    onSubmit: (data: Partial<T>) => void, 
    isSubmitting: boolean, 
    onClose: () => void
  ) => React.ReactNode;
  
  // Fonction pour générer le nouveau code suggéré
  generateNewCode: (originalCode: string | undefined) => string;
  
  // Fonction optionnelle pour générer le nouveau nom suggéré
  generateNewName?: (originalName: string | undefined) => string;
  
  // Nom de la clé du champ "code" dans l'objet T
  codeFieldName?: keyof T;
  
  // Nom de la clé du champ "nom" dans l'objet T
  nameFieldName?: keyof T;
  
  // Titre personnalisé pour le haut de la modale
  modalTitle?: string;
  
  // Court texte explicatif sous le titre
  introText?: string;
}

// Composant générique de duplication
const GenericDuplicateForm = <T extends { id: string }>({
  entityToDuplicate,
  onClose,
  onDuplicateSubmit,
  isSubmitting = false,
  renderEntityForm,
  generateNewCode,
  generateNewName,
  codeFieldName = 'code' as keyof T,
  nameFieldName = 'nom' as keyof T,
  modalTitle = "Dupliquer l'élément",
  introText = "Modifiez le code et le nom de la copie avant de la créer."
}: GenericDuplicateFormProps<T>) => {
  // Préparation des données initiales pour le formulaire de duplication
  const initialDuplicateData = useMemo(() => {
    // On crée une copie de l'entité originale sans son ID
    const { id, ...entityWithoutId } = entityToDuplicate;
    
    // On prépare les nouvelles valeurs pour le code et le nom
    const originalCode = entityToDuplicate[codeFieldName] as string | undefined;
    const originalName = entityToDuplicate[nameFieldName] as string | undefined;
    
    // On génère le nouveau code avec la fonction fournie
    const newCode = generateNewCode(originalCode);
    
    // On génère le nouveau nom avec la fonction fournie ou on garde l'original
    const newName = generateNewName 
      ? generateNewName(originalName) 
      : originalName;
    
    // On retourne l'entité sans ID mais avec les nouveaux code et nom
    return {
      ...entityWithoutId,
      [codeFieldName]: newCode,
      [nameFieldName]: newName
    } as Partial<T>;
  }, [entityToDuplicate, codeFieldName, nameFieldName, generateNewCode, generateNewName]);
  
  // Configuration de react-hook-form
  const { register, handleSubmit, watch, formState: { errors } } = useForm<{
    [key: string]: string;
  }>({
    defaultValues: {
      [codeFieldName as string]: initialDuplicateData[codeFieldName] as string,
      [nameFieldName as string]: initialDuplicateData[nameFieldName] as string
    }
  });
  
  // Les valeurs actuelles des champs code et nom
  const currentCode = watch(codeFieldName as string);
  const currentName = watch(nameFieldName as string);
  
  // Fonction de soumission du formulaire principal (code et nom)
  const onSubmitCodeAndName = (data: { [key: string]: string }) => {
    // On met à jour les données initiales avec les nouvelles valeurs de code et nom
    const updatedInitialData = {
      ...initialDuplicateData,
      [codeFieldName]: data[codeFieldName as string],
      [nameFieldName]: data[nameFieldName as string]
    };
    
    // On passe les données mises à jour au formulaire spécifique à l'entité
    try {
      // Fonction qui sera appelée par le formulaire spécifique lors de sa soumission
      const handleEntityFormSubmit = (entityData: Partial<T>) => {
        try {
          // On appelle le callback fourni par le parent avec les données finales
          onDuplicateSubmit(entityData);
          toast.success("Duplication réussie !");
        } catch (error) {
          console.error("Erreur lors de la duplication :", error);
          toast.error("Erreur lors de la duplication");
        }
      };
      
      // On rend le formulaire spécifique avec les données mises à jour
      return renderEntityForm(
        updatedInitialData,
        handleEntityFormSubmit,
        isSubmitting,
        onClose
      );
    } catch (error) {
      console.error("Erreur lors de la préparation du formulaire :", error);
      toast.error("Erreur lors de la préparation du formulaire");
      return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Titre et texte d'introduction */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{modalTitle}</h2>
        {introText && <p className="text-gray-600 text-sm">{introText}</p>}
      </div>
      
      {/* Formulaire pour le code et le nom */}
      <form onSubmit={handleSubmit(onSubmitCodeAndName)} className="space-y-4 mb-6">
        {/* Champ Code */}
        <div>
          <label 
            htmlFor={codeFieldName as string}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Code
          </label>
          <input
            id={codeFieldName as string}
            type="text"
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
              ${errors[codeFieldName as string] ? 'border-red-300' : 'border-gray-300'}
            `}
            disabled={isSubmitting}
            {...register(codeFieldName as string, { required: "Le code est obligatoire" })}
          />
          {errors[codeFieldName as string] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[codeFieldName as string]?.message}
            </p>
          )}
        </div>
        
        {/* Champ Nom */}
        <div>
          <label 
            htmlFor={nameFieldName as string}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nom
          </label>
          <input
            id={nameFieldName as string}
            type="text"
            className={`
              w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
              ${errors[nameFieldName as string] ? 'border-red-300' : 'border-gray-300'}
            `}
            disabled={isSubmitting}
            {...register(nameFieldName as string, { required: "Le nom est obligatoire" })}
          />
          {errors[nameFieldName as string] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[nameFieldName as string]?.message}
            </p>
          )}
        </div>
        
        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isSubmitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isSubmitting}
          >
            Créer la copie
          </button>
        </div>
      </form>
      
      {/* Rendu du formulaire spécifique à l'entité */}
      {onSubmitCodeAndName({
        [codeFieldName as string]: currentCode,
        [nameFieldName as string]: currentName
      })}
    </div>
  );
};

export default GenericDuplicateForm; 