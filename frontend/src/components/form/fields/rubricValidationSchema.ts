// validation/rubricValidationSchema.ts
import * as yup from "yup";

/**
 * Schéma de validation Yup pour les rubriques avec gestion conditionnelle
 * des méthodes de calcul via le composant RubricMethodCalculator
 */
export const rubricValidationSchema = yup.object().shape({
  // Champs de base
  code: yup.string().required("Le code est requis"),
  nom: yup.string().required("Le nom est requis"),
  type: yup.string()
    .oneOf(["salaire", "gain", "deduction"], "Type invalide")
    .required("Le type est requis"),
  description: yup.string(),
  
  // Ordre d'application avec validation selon le type
  ordre_application: yup.number()
    .typeError("L'ordre d'application doit être un nombre")
    .integer("L'ordre d'application doit être un nombre entier")
    .min(1, "L'ordre d'application doit être positif")
    .required("L'ordre d'application est requis")
    .test(
      'type-prefix',
      "L'ordre d'application doit respecter la convention de préfixe selon le type de rubrique",
      function(value, context) {
        const { type } = context.parent;
        
        if (!value || !type) return true;
        
        const valueStr = value.toString();
        
        if (type === "salaire" && !valueStr.startsWith('1')) {
          return this.createError({
            message: "Pour le type 'Salaire', l'ordre d'application doit commencer par 1 (ex: 100, 101...)"
          });
        }
        
        if (type === "gain" && !valueStr.startsWith('2')) {
          return this.createError({
            message: "Pour le type 'Gain', l'ordre d'application doit commencer par 2 (ex: 200, 201...)"
          });
        }
        
        if (type === "deduction" && !valueStr.startsWith('3')) {
          return this.createError({
            message: "Pour le type 'Déduction', l'ordre d'application doit commencer par 3 (ex: 300, 301...)"
          });
        }
        
        return true;
      }
    ),
  
  // Champs conditionnels pour "qui paie"
  qui_paie: yup.string().oneOf(["employe", "employeur", "les_deux"]),
  taux_employe: yup.number()
    .typeError("Le taux employé doit être un nombre")
    .min(0, "Le taux ne peut pas être négatif")
    .max(100, "Le taux ne peut pas dépasser 100%")
    .when(["qui_paie", "type"], {
      is: (qui_paie: string, type: string) => 
        (qui_paie === "employe" || qui_paie === "les_deux") && type === "deduction",
      then: (schema) => schema.required("Le taux employé est requis"),
      otherwise: (schema) => schema.notRequired()
    }),
  taux_employeur: yup.number()
    .typeError("Le taux employeur doit être un nombre")
    .min(0, "Le taux ne peut pas être négatif")
    .max(100, "Le taux ne peut pas dépasser 100%")
    .when(["qui_paie", "type"], {
      is: (qui_paie: string, type: string) => 
        (qui_paie === "employeur" || qui_paie === "les_deux") && type === "deduction",
      then: (schema) => schema.required("Le taux employeur est requis"),
      otherwise: (schema) => schema.notRequired()
    }),

  // Méthode de calcul
  methode_calcul: yup.string()
    .oneOf(["montant_fixe", "pourcentage", "bareme_progressif", "formule_personnalisee"])
    .required("La méthode de calcul est requise"),

  // Validation conditionnelle pour chaque méthode de calcul
  
  // Montant fixe
  montant_fixe: yup.number()
    .typeError("Le montant doit être un nombre")
    .min(0, "Le montant doit être positif")
    .when("methode_calcul", {
      is: "montant_fixe",
      then: (schema) => schema.required("Le montant fixe est requis"),
      otherwise: (schema) => schema.notRequired()
    }),

  // Pourcentage
  pourcentage: yup.number()
    .typeError("Le taux doit être un nombre")
    .min(0, "Le taux ne peut pas être négatif")
    .max(100, "Le taux ne peut pas dépasser 100%")
    .when("methode_calcul", {
      is: "pourcentage",
      then: (schema) => schema.required("Le taux de pourcentage est requis"),
      otherwise: (schema) => schema.notRequired()
    }),

  // Base de calcul pour le pourcentage (exclusivité entre standard et rubriques)
  base_calcul_standard: yup.string()
    .oneOf(["salaire_brut", "salaire_net", "salaire_cotisable_cnps", "revenu_net_imposable"])
    .when(["methode_calcul", "rubriques_base_calcul"], {
      is: (methode: string, rubriques: string[]) => 
        methode === "pourcentage" && (!rubriques || rubriques.length === 0),
      then: (schema) => schema.required("Sélectionnez une base de calcul standard ou des rubriques spécifiques"),
      otherwise: (schema) => schema.notRequired()
    }),

  rubriques_base_calcul: yup.array()
    .of(yup.string())
    .when(["methode_calcul", "base_calcul_standard"], {
      is: (methode: string, baseStandard: string) => 
        methode === "pourcentage" && !baseStandard,
      then: (schema) => schema.min(1, "Sélectionnez au moins une rubrique ou une base standard"),
      otherwise: (schema) => schema.notRequired()
    }),

  // Base de calcul pour le barème progressif (exclusivité entre standard et rubriques)
  base_calcul_standard_bareme: yup.string()
    .oneOf(["salaire_brut", "salaire_net", "salaire_cotisable_cnps", "revenu_net_imposable"])
    .when(["methode_calcul", "rubriques_base_calcul_bareme"], {
      is: (methode: string, rubriques: string[]) => 
        methode === "bareme_progressif" && (!rubriques || rubriques.length === 0),
      then: (schema) => schema.required("Sélectionnez une base de calcul standard ou des rubriques spécifiques pour le barème"),
      otherwise: (schema) => schema.notRequired()
    }),

  rubriques_base_calcul_bareme: yup.array()
    .of(yup.string())
    .when(["methode_calcul", "base_calcul_standard_bareme"], {
      is: (methode: string, baseStandard: string) => 
        methode === "bareme_progressif" && !baseStandard,
      then: (schema) => schema.min(1, "Sélectionnez au moins une rubrique ou une base standard pour le barème"),
      otherwise: (schema) => schema.notRequired()
    }),

  // Validation pour s'assurer qu'on ne peut pas avoir les deux en même temps (pour pourcentage)
  _base_calcul_exclusivity: yup.mixed()
    .test("base-calcul-exclusivity", "Vous ne pouvez pas sélectionner à la fois une base standard et des rubriques spécifiques", function(value) {
      const { base_calcul_standard, rubriques_base_calcul, methode_calcul } = this.parent;
      
      if (methode_calcul !== "pourcentage") return true;
      
      const hasBaseStandard = !!base_calcul_standard;
      const hasRubriques = rubriques_base_calcul && rubriques_base_calcul.length > 0;
      
      // Erreur si les deux sont sélectionnés
      if (hasBaseStandard && hasRubriques) {
        return false;
      }
      
      // OK si au moins un des deux est sélectionné
      return true;
    }),

  // Validation pour s'assurer qu'on ne peut pas avoir les deux en même temps (pour barème)
  _base_calcul_bareme_exclusivity: yup.mixed()
    .test("base-calcul-bareme-exclusivity", "Vous ne pouvez pas sélectionner à la fois une base standard et des rubriques spécifiques pour le barème", function(value) {
      const { base_calcul_standard_bareme, rubriques_base_calcul_bareme, methode_calcul } = this.parent;
      
      if (methode_calcul !== "bareme_progressif") return true;
      
      const hasBaseStandard = !!base_calcul_standard_bareme;
      const hasRubriques = rubriques_base_calcul_bareme && rubriques_base_calcul_bareme.length > 0;
      
      // Erreur si les deux sont sélectionnés
      if (hasBaseStandard && hasRubriques) {
        return false;
      }
      
      // OK si au moins un des deux est sélectionné
      return true;
    }),

  // Barème progressif
  bareme_progressif: yup.array()
    .when("methode_calcul", {
      is: "bareme_progressif",
      then: (schema) => schema
        .min(1, "Au moins une tranche est requise")
        .test("tranches-no-overlap", "Les tranches ne doivent pas se chevaucher", function(tranches) {
          if (!tranches || tranches.length <= 1) return true;
          
          // Trier les tranches par valeur minimum
          const sortedTranches = [...tranches].sort((a, b) => (a.min || 0) - (b.min || 0));
          
          // Vérifier qu'il n'y a pas de chevauchement
          for (let i = 0; i < sortedTranches.length - 1; i++) {
            const current = sortedTranches[i];
            const next = sortedTranches[i + 1];
            
            if (current.max && next.min && current.max >= next.min) {
              return this.createError({
                message: `Chevauchement détecté entre les tranches ${current.min}-${current.max} et ${next.min}-${next.max}`,
                path: `bareme_progressif[${i}]`
              });
            }
          }
          
          return true;
        }),
      otherwise: (schema) => schema.notRequired()
    }),

  // Formule personnalisée
  formule_personnalisee: yup.string()
    .min(1, "La formule ne peut pas être vide")
    .test("valid-formula", "La formule contient des caractères invalides", function(value) {
      if (!value) return true;
      
      // Validation basique : vérifier que la formule contient au moins des caractères alphanumériques
      const validCharsRegex = /^[a-zA-Z0-9_+\-*/.() ]+$/;
      return validCharsRegex.test(value);
    })
    .when("methode_calcul", {
      is: "formule_personnalisee",
      then: (schema) => schema.required("La formule personnalisée est requise"),
      otherwise: (schema) => schema.notRequired()
    }),
    
  valeur_defaut: yup.number()
    .typeError("La valeur par défaut doit être un nombre")
    .min(0, "La valeur par défaut ne peut pas être négative")
    .nullable()
    .when("methode_calcul", {
      is: "montant_fixe",
      then: (schema) => schema.required("La valeur par défaut est requise pour le montant fixe"),
      otherwise: (schema) => schema.notRequired()
    }),
});

/**
 * Fonction utilitaire pour valider une rubrique selon sa méthode de calcul
 */
export const validateRubricData = async (data: any) => {
  try {
    await rubricValidationSchema.validate(data, { abortEarly: false });
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        isValid: false,
        errors: error.inner.map(err => ({
          path: err.path,
          message: err.message
        }))
      };
    }
    throw error;
  }
};

export default rubricValidationSchema;