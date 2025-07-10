// components/ui/form/GenericForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import BaremeField from "./BaremeField";
import RubricMethodCalculator from "./fields/RubricMethodCalculator";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "select" | "textarea" | "bareme" | "rubric_method_calculator";
  options?: { label: string; value: string }[];
  required?: boolean;
  icon?: React.ReactNode;
  // Changement principal : remplacement de 'condition' par 'showIf'
  showIf?: (values: Record<string, any>) => boolean;
  rubriquesDisponibles?: { label: string; value: string }[];
  // Nouvelle propriété pour le texte de l'infobulle
  tooltipText?: string;
  // Propriétés pour les champs
  readOnly?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export interface FormSection {
  title?: string;
  fields: FormField[];
}

interface GenericFormProps {
  sections?: FormSection[];
  fields?: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  backgroundIllustration?: React.ReactNode;
}

const buildSchema = (fields: FormField[]) => {
  const shape: Record<string, any> = {};

  fields.forEach((field) => {
    let validator: any;

    if (field.type === "number") {
      validator = yup.number().typeError("Doit être un nombre");
      if (field.required) {
        validator = validator.required("Ce champ est requis");
      }
      
      // Support des décimales pour les taux
      if (field.name === "taux_employe" || field.name === "taux_employeur" || 
          field.name === "pourcentage" || field.name === "taux_pourcentage" ||
          field.name === "montant_fixe" || field.name === "valeur_defaut") {
        validator = validator.test(
          'is-decimal',
          'Doit être un nombre avec maximum 2 décimales',
          (value: number | undefined) => !value || (Number.isFinite(value) && (value.toString().split('.')[1]?.length || 0) <= 2)
        );
      }
      
      // Validation spécifique pour ordre_application
      if (field.name === "ordre_application") {
        validator = validator
          .test(
            'is-integer',
            'Doit être un nombre entier',
            (value: number | undefined) => !value || Number.isInteger(value)
          )
          .when('type', {
            is: 'salaire',
            then: (schema: yup.NumberSchema) => schema.test(
              'starts-with-1',
              "Pour le type 'Salaire de base', l'ordre d'application doit commencer par 1",
              (value: number | undefined) => !value || value.toString().startsWith('1')
            )
          })
          .when('type', {
            is: 'gain',
            then: (schema: yup.NumberSchema) => schema.test(
              'starts-with-2',
              "Pour le type 'Gain', l'ordre d'application doit commencer par 2",
              (value: number | undefined) => !value || value.toString().startsWith('2')
            )
          })
          .when('type', {
            is: 'deduction',
            then: (schema: yup.NumberSchema) => schema.test(
              'starts-with-3',
              "Pour le type 'Déduction', l'ordre d'application doit commencer par 3",
              (value: number | undefined) => !value || value.toString().startsWith('3')
            )
          });
      }
    } else if (field.type === "email") {
      validator = yup.string().email("Email invalide");
      if (field.required) {
        validator = validator.required("Ce champ est requis");
      }
    } else if (field.type === "rubric_method_calculator") {
      // Validation conditionnelle pour le calculateur de méthode de rubrique
      validator = yup.string();
      
      // Validation de base pour methode_calcul
      shape['methode_calcul'] = yup.string()
        .required("La méthode de calcul est requise");
        
      // Validation conditionnelle selon la méthode de calcul
      shape['montant_fixe'] = yup.number()
        .when('methode_calcul', {
          is: 'montant_fixe',
          then: (schema) => schema
            .required("Le montant fixe est requis")
            .typeError("Doit être un nombre valide")
            .nullable(),
          otherwise: (schema) => schema.nullable()
        });
      
      shape['pourcentage'] = yup.number()
        .when('methode_calcul', {
          is: 'pourcentage',
          then: (schema) => schema
            .required("Le taux de pourcentage est requis")
            .typeError("Doit être un nombre valide")
            .min(0, "Le taux ne peut pas être négatif")
            .max(100, "Le taux ne peut pas dépasser 100%")
            .nullable(),
          otherwise: (schema) => schema.nullable()
        });
      
      // Résolution de la dépendance cyclique avec [[], []]
      shape['base_calcul_standard'] = yup.string()
        .when('methode_calcul', {
          is: 'pourcentage',
          then: (schema) => schema
            .test({
              name: 'base-or-rubriques',
              message: "Vous devez sélectionner une base de calcul ou des rubriques",
              test: function(value) {
                // Accéder au parent pour vérifier les rubriques
                const rubriquesBaseCalcul = this.parent.rubriques_base_calcul;
                // Valide si soit base_calcul_standard est rempli, soit rubriques_base_calcul contient des éléments
                return !!value || (rubriquesBaseCalcul && rubriquesBaseCalcul.length > 0);
              }
            })
            .nullable(),
          otherwise: (schema) => schema.nullable()
        });
        
      shape['rubriques_base_calcul'] = yup.array()
        .when('methode_calcul', {
          is: 'pourcentage',
          then: (schema) => schema
            .test({
              name: 'rubriques-or-base',
              message: "Vous devez sélectionner une base de calcul ou des rubriques",
              test: function(value) {
                // Accéder au parent pour vérifier la base standard
                const baseCalculStandard = this.parent.base_calcul_standard;
                // Valide si soit base_calcul_standard est rempli, soit rubriques_base_calcul contient des éléments
                return !!baseCalculStandard || (value && value.length > 0);
              }
            })
            .nullable(),
          otherwise: (schema) => schema.nullable()
        });
        
      // Validation pour base_calcul_standard_bareme
      shape['base_calcul_standard_bareme'] = yup.string()
        .when('methode_calcul', {
          is: 'bareme_progressif',
          then: (schema) => schema
            .test({
              name: 'base-or-rubriques-bareme',
              message: "Vous devez sélectionner une base de calcul ou des rubriques pour le barème",
              test: function(value) {
                // Accéder au parent pour vérifier les rubriques du barème
                const rubriquesBaseCalculBareme = this.parent.rubriques_base_calcul_bareme;
                // Valide si soit base_calcul_standard_bareme est rempli, soit rubriques_base_calcul_bareme contient des éléments
                return !!value || (rubriquesBaseCalculBareme && rubriquesBaseCalculBareme.length > 0);
              }
            })
            .nullable(),
          otherwise: (schema) => schema.nullable()
        });
        
      // Validation pour rubriques_base_calcul_bareme
      shape['rubriques_base_calcul_bareme'] = yup.array()
        .when('methode_calcul', {
          is: 'bareme_progressif',
          then: (schema) => schema
            .test({
              name: 'rubriques-or-base-bareme',
              message: "Vous devez sélectionner une base de calcul ou des rubriques pour le barème",
              test: function(value) {
                // Accéder au parent pour vérifier la base standard du barème
                const baseCalculStandardBareme = this.parent.base_calcul_standard_bareme;
                // Valide si soit base_calcul_standard_bareme est rempli, soit rubriques_base_calcul_bareme contient des éléments
                return !!baseCalculStandardBareme || (value && value.length > 0);
              }
            })
            .nullable(),
          otherwise: (schema) => schema.nullable()
        });
        
      shape['formule_personnalisee'] = yup.string()
        .when('methode_calcul', {
          is: 'formule_personnalisee',
          then: (schema) => schema
            .required("La formule personnalisée est requise")
            .min(5, "La formule doit contenir au moins 5 caractères")
            .nullable(),
          otherwise: (schema) => schema.nullable()
        });
        
      shape['bareme_progressif'] = yup.array()
        .when('methode_calcul', {
          is: 'bareme_progressif',
          then: (schema) => schema
            .min(1, "Vous devez définir au moins une tranche")
            .nullable(),
          otherwise: (schema) => schema.nullable()
        });
    } else {
      validator = yup.string();
      if (field.required) {
        validator = validator.required("Ce champ est requis");
      }
    }

    if (!shape[field.name]) {
      shape[field.name] = validator;
    }
  });

  return yup.object().shape(shape);
};

const GenericForm: React.FC<GenericFormProps> = ({
  sections,
  fields = [],
  initialValues = {},
  onSubmit,
  submitLabel = "Enregistrer",
  isSubmitting = false,
  backgroundIllustration
}) => {
  const flatFields = sections ? sections.flatMap((s) => s.fields) : fields;
  const schema = buildSchema(flatFields);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    control
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues
  });

  const values = watch();

  React.useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  // Nouvel useEffect centralisé pour gérer le forçage conditionnel de methode_calcul et la synchronisation de valeur_defaut
  // Ce useEffect centralise toute la logique pour éviter les problèmes de "Maximum update depth exceeded"
  // qui étaient causés par des synchronisations redondantes entre GenericForm et RubricMethodCalculator
  React.useEffect(() => {
    const rubricType = watch('type');
    const methodeCalcul = watch('methode_calcul');
    const montantFixe = watch('montant_fixe');
    const valeurDefaut = watch('valeur_defaut');
    
    // 1. Forçage de methode_calcul à "montant_fixe" pour les rubriques de type "salaire"
    if (rubricType === 'salaire' && methodeCalcul !== 'montant_fixe') {
      // Forçage de la méthode à "montant_fixe" pour le type "salaire"
      setValue('methode_calcul', 'montant_fixe', { shouldValidate: true });
      
      // Réinitialisation des champs spécifiques aux autres méthodes de calcul
      setValue('pourcentage', undefined);
      setValue('base_calcul_standard', undefined);
      setValue('rubriques_base_calcul', []);
      setValue('base_calcul_standard_bareme', undefined);
      setValue('rubriques_base_calcul_bareme', []);
      setValue('bareme_progressif', []);
      setValue('formule_personnalisee', undefined);
    }
    
    // 2. Synchronisation de valeur_defaut avec montant_fixe quand la méthode est "montant_fixe"
    if (methodeCalcul === 'montant_fixe') {
      // Mettre à jour valeur_defaut UNIQUEMENT si montantFixe est valide et différent de valeurDefaut
      if (montantFixe !== undefined && montantFixe !== null && montantFixe !== valeurDefaut) {
        setValue('valeur_defaut', montantFixe, { shouldValidate: true });
      }
      // Si montantFixe est vide/invalide, effacer valeur_defaut uniquement si pas déjà vide
      else if ((montantFixe === undefined || montantFixe === null) && valeurDefaut !== undefined && valeurDefaut !== null) {
        setValue('valeur_defaut', undefined);
      }
    } 
    // 3. Effacer valeur_defaut si la méthode n'est pas "montant_fixe"
    else if (methodeCalcul !== 'montant_fixe' && valeurDefaut !== undefined && valeurDefaut !== null) {
      setValue('valeur_defaut', undefined);
    }
    
  }, [watch, setValue, watch('type'), watch('methode_calcul'), watch('montant_fixe'), watch('valeur_defaut')]);

  const submit: SubmitHandler<any> = (data) => {
    // Log des données avant la soumission
    console.log("Données du formulaire soumises:", data);
    onSubmit(data);
  };

  const renderFields = (formFields: FormField[]) => (
    <div className="space-y-4">
      {formFields.map((field) => {
        // Mise à jour de la logique conditionnelle avec showIf
        if (field.showIf && !field.showIf(values)) {
          return null;
        }

        return (
          <div key={field.name} className="flex flex-col gap-1 relative w-full">
            <label htmlFor={field.name} className="text-sm font-medium text-gray-700 flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              
              {/* Infobulle */}
              {field.tooltipText && (
                <div className="group relative inline-block">
                  <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-500 cursor-help" />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 -right-4 top-6 w-56 pointer-events-none">
                    {field.tooltipText}
                    <div className="tooltip-arrow absolute -top-1 right-5 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                  </div>
                </div>
              )}
            </label>

            <div className="relative">
              {field.icon && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
                  {field.icon}
                </div>
              )}

              {field.type === "bareme" ? (
                <BaremeField
                  value={values[field.name] || []}
                  onChange={(val) => setValue(field.name, val)}
                />
              ) : field.type === "rubric_method_calculator" ? (
                <RubricMethodCalculator
                  control={control}
                  register={register}
                  watch={watch}
                  errors={errors}
                  rubriquesDisponibles={field.rubriquesDisponibles || []}
                  setValue={setValue}
                  isMethodSelectDisabled={values.type === 'salaire'}
                />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  {...register(field.name)}
                  disabled={field.disabled}
                  className={`border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${field.icon ? "pl-10" : ""} ${field.disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
                >
                  <option value="">-- Sélectionner --</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  {...register(field.name)}
                  rows={3}
                  placeholder={field.placeholder}
                  readOnly={field.readOnly}
                  className={`border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical ${field.icon ? "pl-10" : ""} ${field.readOnly ? "opacity-75 bg-gray-50" : ""}`}
                />
              ) : (
                <input
                  id={field.name}
                  type={field.type}
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  readOnly={field.readOnly}
                  disabled={field.disabled}
                  className={`border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${field.icon ? "pl-10" : ""} ${field.readOnly || field.disabled ? "opacity-75 bg-gray-50" : ""}`}
                  step={field.type === "number" && (field.name === "taux_employe" || field.name === "taux_employeur" || field.name === "pourcentage" || field.name === "taux_pourcentage" || field.name === "montant_fixe" || field.name === "valeur_defaut") ? "0.01" : undefined}
                />
              )}
            </div>

            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative">
      {backgroundIllustration && (
        <div className="absolute inset-0 flex justify-center items-center opacity-5 pointer-events-none z-0">
          {backgroundIllustration}
        </div>
      )}
      <form onSubmit={handleSubmit(submit)} className="space-y-6 relative z-10">
        {sections
          ? sections.map((section, idx) => (
              <div key={idx} className="space-y-4 p-5 bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
                {section.title && (
                  <h3 className="text-lg font-semibold border-b pb-2 text-gray-700 flex items-center">
                    <span className="inline-block w-1 h-5 bg-indigo-500 rounded-full mr-2"></span>
                    {section.title}
                  </h3>
                )}
                {renderFields(section.fields)}
              </div>
            ))
          : renderFields(fields)}

        <div className="text-right pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? "Enregistrement..." : submitLabel}
          </button>
        </div>
        
        {/* Débogage conditionnel - Seulement en développement */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Données actuelles du formulaire</h4>
            </div>
            <pre className="text-xs bg-white p-3 rounded border border-gray-200 max-h-60 overflow-auto">
              {JSON.stringify(values, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </div>
  );
};

export default GenericForm;