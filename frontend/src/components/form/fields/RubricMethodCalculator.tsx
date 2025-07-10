// components/ui/form/RubricMethodCalculator.tsx
import React, { useState, useMemo, useEffect } from "react";
import { 
  BanknotesIcon, 
  CalculatorIcon, 
  ChartBarIcon, 
  CodeBracketIcon,
  FunnelIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import BaremeField from "../BaremeField";
import type { 
  RubricMethodCalculatorProps, 
  MethodeCalcul, 
  SelectOption,
  BaseCalculStandard 
} from "./RubricMethodCalculator.types";

/**
 * Composant de configuration des méthodes de calcul pour les rubriques de paie
 * Gère les quatre types de calcul : montant fixe, pourcentage, barème progressif, formule personnalisée
 */
const RubricMethodCalculator: React.FC<RubricMethodCalculatorProps> = ({
  control,
  register,
  watch,
  errors,
  rubriquesDisponibles,
  setValue,
  isMethodSelectDisabled
}) => {
  // État pour le filtrage des rubriques
  const [filtreRubrique, setFiltreRubrique] = useState("");
  const [filtreRubriqueBareme, setFiltreRubriqueBareme] = useState("");
  
  // État pour la sélection des rubriques (sélection multiple)
  const [rubriquesSelectionnees, setRubriquesSelectionnees] = useState<string[]>([]);
  const [rubriquesBaremeSelectionnees, setRubriquesBaremeSelectionnees] = useState<string[]>([]);
  
  // Surveillance des valeurs du formulaire
  const methodeCalcul = watch('methode_calcul') as MethodeCalcul;
  const baseCalculStandard = watch('base_calcul_standard') as BaseCalculStandard;
  const baseCalculStandardBareme = watch('base_calcul_standard_bareme') as BaseCalculStandard;
  const typeRubrique = watch('type');

  // Récupère la liste complète des rubriques sélectionnées du form
  const rubriquesBaseCalcul = watch('rubriques_base_calcul') || [];
  const rubriquesBaseCalculBareme = watch('rubriques_base_calcul_bareme') || [];

  // Déterminer si la méthode de calcul est désactivée
  const methodSelectDisabled = isMethodSelectDisabled || typeRubrique === "salaire";

  // Initialisation des états locaux avec les valeurs observées
  // Note: La logique de forçage de methode_calcul a été supprimée d'ici et centralisée dans GenericForm.tsx
  // pour éviter les problèmes de "Maximum update depth exceeded" dus aux synchronisations redondantes
  React.useEffect(() => {
    if (JSON.stringify(rubriquesBaseCalcul) !== JSON.stringify(rubriquesSelectionnees)) {
      setRubriquesSelectionnees(rubriquesBaseCalcul);
    }
  }, [JSON.stringify(rubriquesBaseCalcul)]);

  React.useEffect(() => {
    if (JSON.stringify(rubriquesBaseCalculBareme) !== JSON.stringify(rubriquesBaremeSelectionnees)) {
      setRubriquesBaremeSelectionnees(rubriquesBaseCalculBareme);
    }
  }, [JSON.stringify(rubriquesBaseCalculBareme)]);

  // Options de méthode de calcul
  const optionsMethodeCalcul: SelectOption[] = [
    { label: "Montant fixe", value: "montant_fixe" },
    { label: "Pourcentage", value: "pourcentage" },
    { label: "Barème progressif", value: "bareme_progressif" },
    { label: "Formule personnalisée", value: "formule_personnalisee" }
  ];

  // Options de base de calcul standard
  const basesStandard: SelectOption[] = [
    { label: "Salaire brut", value: "salaire_brut" },
    { label: "Salaire net", value: "salaire_net" },
    { label: "Salaire cotisable (CNPS)", value: "salaire_cotisable_cnps" },
    { label: "Revenu net imposable (IRPP)", value: "revenu_net_imposable" }
  ];

  // Filtrage des rubriques disponibles
  const rubriquesFilterees = useMemo(() => {
    if (!filtreRubrique) return rubriquesDisponibles;
    return rubriquesDisponibles.filter(rubrique =>
      rubrique.label.toLowerCase().includes(filtreRubrique.toLowerCase()) ||
      rubrique.value.toLowerCase().includes(filtreRubrique.toLowerCase())
    );
  }, [rubriquesDisponibles, filtreRubrique]);

  const rubriquesBaremeFilterees = useMemo(() => {
    if (!filtreRubriqueBareme) return rubriquesDisponibles;
    return rubriquesDisponibles.filter(rubrique =>
      rubrique.label.toLowerCase().includes(filtreRubriqueBareme.toLowerCase()) ||
      rubrique.value.toLowerCase().includes(filtreRubriqueBareme.toLowerCase())
    );
  }, [rubriquesDisponibles, filtreRubriqueBareme]);

  /**
   * Mise à jour de la méthode de calcul 
   */
  const handleMethodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as MethodeCalcul;
    
    // Si le type est "salaire", forcer la méthode à "montant_fixe"
    if (methodSelectDisabled && value !== "montant_fixe") {
      return; // Ne pas permettre le changement
    }
    
    if (setValue) {
      // Réinitialiser les champs spécifiques à chaque méthode quand on change
      setValue('methode_calcul', value);
      setValue('montant_fixe', null);
      setValue('pourcentage', null);
      setValue('base_calcul_standard', '');
      setValue('rubriques_base_calcul', []);
      setValue('base_calcul_standard_bareme', '');
      setValue('rubriques_base_calcul_bareme', []);
      setValue('bareme_progressif', []);
      setValue('formule_personnalisee', '');
      
      // Réinitialiser également l'état local
      setRubriquesSelectionnees([]);
      setRubriquesBaremeSelectionnees([]);
    }
  };

  /**
   * Gestion de la sélection d'une base standard
   * Désactive automatiquement la sélection des rubriques
   */
  const handleBaseStandardSelection = (value: string) => {
    if (setValue) {
      // Mettre à jour la base standard
      setValue('base_calcul_standard', value);
      
      // Réinitialiser la sélection des rubriques quand on choisit une base standard
      setValue('rubriques_base_calcul', []);
      setRubriquesSelectionnees([]);
    }
  };

  /**
   * Gestion de la sélection d'une base standard pour le barème
   */
  const handleBaseStandardBaremeSelection = (value: string) => {
    if (setValue) {
      // Mettre à jour la base standard pour le barème
      setValue('base_calcul_standard_bareme', value);
      
      // Réinitialiser la sélection des rubriques barème
      setValue('rubriques_base_calcul_bareme', []);
      setRubriquesBaremeSelectionnees([]);
    }
  };

  /**
   * Gestion de la sélection multiple des rubriques
   * Désactive automatiquement la sélection des bases standard
   */
  const handleRubriqueSelection = (rubriqueValue: string) => {
    const isSelected = rubriquesSelectionnees.includes(rubriqueValue);
    const newSelection = isSelected 
      ? rubriquesSelectionnees.filter(r => r !== rubriqueValue)
      : [...rubriquesSelectionnees, rubriqueValue];
    
    // Mettre à jour l'état local et le formulaire
    setRubriquesSelectionnees(newSelection);
    
    if (setValue) {
      setValue('rubriques_base_calcul', newSelection);
      
      // Si on sélectionne une rubrique, on efface la base standard
      if (!isSelected) {
        setValue('base_calcul_standard', '');
      }
    }
  };

  /**
   * Gestion de la sélection multiple des rubriques pour le barème
   */
  const handleRubriqueBaremeSelection = (rubriqueValue: string) => {
    const isSelected = rubriquesBaremeSelectionnees.includes(rubriqueValue);
    const newSelection = isSelected 
      ? rubriquesBaremeSelectionnees.filter(r => r !== rubriqueValue)
      : [...rubriquesBaremeSelectionnees, rubriqueValue];
    
    // Mettre à jour l'état local et le formulaire
    setRubriquesBaremeSelectionnees(newSelection);
    
    if (setValue) {
      setValue('rubriques_base_calcul_bareme', newSelection);
      
      // Si on sélectionne une rubrique, on efface la base standard
      if (!isSelected) {
        setValue('base_calcul_standard_bareme', '');
      }
    }
  };

  /**
   * Réinitialiser la sélection de base de calcul
   */
  const resetBaseCalcul = () => {
    if (setValue) {
      setValue('base_calcul_standard', '');
      setValue('rubriques_base_calcul', []);
      setRubriquesSelectionnees([]);
    }
  };

  /**
   * Réinitialiser la sélection de base de calcul pour le barème
   */
  const resetBaseCalculBareme = () => {
    if (setValue) {
      setValue('base_calcul_standard_bareme', '');
      setValue('rubriques_base_calcul_bareme', []);
      setRubriquesBaremeSelectionnees([]);
    }
  };

  /**
   * Supprime une rubrique sélectionnée
   */
  const supprimerRubriqueSelectionnee = (rubriqueValue: string) => {
    const newSelection = rubriquesSelectionnees.filter(r => r !== rubriqueValue);
    setRubriquesSelectionnees(newSelection);
    if (setValue) {
      setValue('rubriques_base_calcul', newSelection);
    }
  };

  /**
   * Supprime une rubrique sélectionnée pour le barème
   */
  const supprimerRubriqueBaremeSelectionnee = (rubriqueValue: string) => {
    const newSelection = rubriquesBaremeSelectionnees.filter(r => r !== rubriqueValue);
    setRubriquesBaremeSelectionnees(newSelection);
    if (setValue) {
      setValue('rubriques_base_calcul_bareme', newSelection);
    }
  };

  /**
   * Rendu conditionnel du contenu selon la méthode de calcul
   */
  const renderMethodeContent = () => {
    if (!methodeCalcul) return null;

    switch (methodeCalcul) {
      case "montant_fixe":
        return renderMontantFixe();
      case "pourcentage":
        return renderPourcentage();
      case "bareme_progressif":
        return renderBaremeProgressif();
      case "formule_personnalisee":
        return renderFormulePersonnalisee();
      default:
        return null;
    }
  };

  /**
   * Section Montant Fixe
   */
  const renderMontantFixe = () => (
    <fieldset className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <legend className="flex items-center gap-2 text-blue-800 px-2">
        <BanknotesIcon className="h-5 w-5" />
        <h4 className="font-medium">Configuration du montant fixe</h4>
      </legend>
      
      <div className="flex flex-col gap-1">
        <label htmlFor="montant_fixe" className="text-sm font-medium text-gray-700">
          Montant fixe (FCFA)
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="montant_fixe"
          type="number"
          step="0.01"
          min="0"
          {...register('montant_fixe')}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ex: 50000"
        />
        {errors.montant_fixe && (
          <p className="text-red-500 text-xs mt-1">
            {errors.montant_fixe.message as string}
          </p>
        )}
      </div>
    </fieldset>
  );

  /**
   * Section Pourcentage avec sélecteur de base scindé
   */
  const renderPourcentage = () => (
    <fieldset className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
      <legend className="flex items-center gap-2 text-green-800 px-2">
        <CalculatorIcon className="h-5 w-5" />
        <h4 className="font-medium">Configuration du pourcentage</h4>
      </legend>

      {/* Taux de pourcentage */}
      <div className="flex flex-col gap-1">
        <label htmlFor="pourcentage" className="text-sm font-medium text-gray-700">
          Taux (%)
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="pourcentage"
          type="number"
          step="0.01"
          min="0"
          max="100"
          {...register('pourcentage')}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Ex: 15.5"
        />
        {errors.pourcentage && (
          <p className="text-red-500 text-xs mt-1">
            {errors.pourcentage.message as string}
          </p>
        )}
      </div>

      {/* Base de calcul scindée */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h5 className="text-sm font-medium text-gray-700">Base de calcul</h5>
          <button 
            type="button"
            onClick={resetBaseCalcul}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            Réinitialiser
          </button>
        </div>
        
        <p className="text-xs text-gray-600">Choisissez une base standard prédéfinie OU sélectionnez une ou plusieurs rubriques spécifiques pour le calcul.</p>
        
        {/* Bases standard */}
        <div className="space-y-2">
          <h6 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Bases standard
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {basesStandard.map((base) => (
              <label key={base.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="base_calcul_standard"
                  value={base.value}
                  checked={baseCalculStandard === base.value}
                  onChange={(e) => handleBaseStandardSelection(e.target.value)}
                  disabled={rubriquesSelectionnees.length > 0}
                  className="text-green-600 focus:ring-green-500 disabled:opacity-50"
                />
                <span className={`text-sm ${rubriquesSelectionnees.length > 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                  {base.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-200 my-3"></div>

        {/* Rubriques disponibles */}
        <div className="space-y-2">
          <h6 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Rubriques spécifiques
          </h6>
          
          {/* Filtre des rubriques */}
          <div className="relative">
            <FunnelIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filtreRubrique}
              onChange={(e) => setFiltreRubrique(e.target.value)}
              placeholder="Filtrer les rubriques..."
              disabled={!!baseCalculStandard}
              className={`pl-8 pr-3 py-2 text-sm border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${baseCalculStandard ? 'opacity-50 bg-gray-100' : ''}`}
            />
          </div>

          {/* Liste des rubriques filtrées */}
          <div className={`space-y-1 max-h-32 overflow-y-auto border border-gray-200 rounded p-2 ${baseCalculStandard ? 'opacity-50 bg-gray-100' : 'bg-white'}`}>
            {rubriquesFilterees.length > 0 ? (
              rubriquesFilterees.map((rubrique) => (
                <label key={rubrique.value} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={rubriquesSelectionnees.includes(rubrique.value)}
                    onChange={() => handleRubriqueSelection(rubrique.value)}
                    disabled={!!baseCalculStandard}
                    className="text-green-600 focus:ring-green-500 disabled:opacity-50"
                  />
                  <span className={`text-sm flex-1 ${baseCalculStandard ? 'text-gray-400' : 'text-gray-700'}`}>
                    {rubrique.label}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic p-2">
                {filtreRubrique ? "Aucune rubrique trouvée" : "Aucune rubrique disponible"}
              </p>
            )}
          </div>

          {/* Rubriques sélectionnées */}
          {rubriquesSelectionnees.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Rubriques sélectionnées :</p>
              <div className="flex flex-wrap gap-1">
                {rubriquesSelectionnees.map((rubriqueValue) => {
                  const rubrique = rubriquesDisponibles.find(r => r.value === rubriqueValue);
                  return (
                    <span key={rubriqueValue} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {rubrique?.label || rubriqueValue}
                      <button
                        type="button"
                        onClick={() => supprimerRubriqueSelectionnee(rubriqueValue)}
                        className="hover:bg-green-200 rounded-full p-0.5"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
              
              {/* Message d'erreur */}
              {errors.rubriques_base_calcul && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.rubriques_base_calcul.message as string}
                </p>
              )}
            </div>
          )}
          
          {/* Message d'erreur de base de calcul */}
          {!baseCalculStandard && rubriquesSelectionnees.length === 0 && errors.base_calcul_standard && (
            <p className="text-red-500 text-xs mt-1">
              {errors.base_calcul_standard.message as string}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );

  /**
   * Section Barème Progressif
   */
  const renderBaremeProgressif = () => (
    <fieldset className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
      <legend className="flex items-center gap-2 text-orange-800 px-2">
        <ChartBarIcon className="h-5 w-5" />
        <h4 className="font-medium">Configuration du barème progressif</h4>
      </legend>
      
      <BaremeField
        value={watch('bareme_progressif') || []}
        onChange={(value) => {
          if (setValue) {
            setValue('bareme_progressif', value);
          }
        }}
      />
      
      {errors.bareme_progressif && (
        <p className="text-red-500 text-xs mt-1">
          {errors.bareme_progressif.message as string}
        </p>
      )}

      {/* Base de calcul pour le barème */}
      <div className="space-y-3 mt-4 pt-4 border-t border-orange-200">
        <div className="flex justify-between items-center">
          <h5 className="text-sm font-medium text-gray-700">Base de calcul pour le barème</h5>
          <button 
            type="button"
            onClick={resetBaseCalculBareme}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            Réinitialiser
          </button>
        </div>
        
        <p className="text-xs text-gray-600">Choisissez une base standard prédéfinie OU sélectionnez une ou plusieurs rubriques spécifiques pour le barème.</p>
        
        {/* Bases standard pour barème */}
        <div className="space-y-2">
          <h6 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Bases standard
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {basesStandard.map((base) => (
              <label key={base.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="base_calcul_standard_bareme"
                  value={base.value}
                  checked={baseCalculStandardBareme === base.value}
                  onChange={(e) => handleBaseStandardBaremeSelection(e.target.value)}
                  disabled={rubriquesBaremeSelectionnees.length > 0}
                  className="text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                />
                <span className={`text-sm ${rubriquesBaremeSelectionnees.length > 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                  {base.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-200 my-3"></div>

        {/* Rubriques disponibles pour barème */}
        <div className="space-y-2">
          <h6 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Rubriques spécifiques
          </h6>
          
          {/* Filtre des rubriques pour barème */}
          <div className="relative">
            <FunnelIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filtreRubriqueBareme}
              onChange={(e) => setFiltreRubriqueBareme(e.target.value)}
              placeholder="Filtrer les rubriques..."
              disabled={!!baseCalculStandardBareme}
              className={`pl-8 pr-3 py-2 text-sm border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${baseCalculStandardBareme ? 'opacity-50 bg-gray-100' : ''}`}
            />
          </div>

          {/* Liste des rubriques filtrées pour barème */}
          <div className={`space-y-1 max-h-32 overflow-y-auto border border-gray-200 rounded p-2 ${baseCalculStandardBareme ? 'opacity-50 bg-gray-100' : 'bg-white'}`}>
            {rubriquesBaremeFilterees.length > 0 ? (
              rubriquesBaremeFilterees.map((rubrique) => (
                <label key={rubrique.value} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={rubriquesBaremeSelectionnees.includes(rubrique.value)}
                    onChange={() => handleRubriqueBaremeSelection(rubrique.value)}
                    disabled={!!baseCalculStandardBareme}
                    className="text-orange-600 focus:ring-orange-500 disabled:opacity-50"
                  />
                  <span className={`text-sm flex-1 ${baseCalculStandardBareme ? 'text-gray-400' : 'text-gray-700'}`}>
                    {rubrique.label}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic p-2">
                {filtreRubriqueBareme ? "Aucune rubrique trouvée" : "Aucune rubrique disponible"}
              </p>
            )}
          </div>

          {/* Rubriques sélectionnées pour barème */}
          {rubriquesBaremeSelectionnees.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-600">Rubriques sélectionnées :</p>
              <div className="flex flex-wrap gap-1">
                {rubriquesBaremeSelectionnees.map((rubriqueValue) => {
                  const rubrique = rubriquesDisponibles.find(r => r.value === rubriqueValue);
                  return (
                    <span key={rubriqueValue} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {rubrique?.label || rubriqueValue}
                      <button
                        type="button"
                        onClick={() => supprimerRubriqueBaremeSelectionnee(rubriqueValue)}
                        className="hover:bg-orange-200 rounded-full p-0.5"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
              
              {/* Message d'erreur */}
              {errors.rubriques_base_calcul_bareme && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.rubriques_base_calcul_bareme.message as string}
                </p>
              )}
            </div>
          )}
          
          {/* Message d'erreur de base de calcul pour barème */}
          {!baseCalculStandardBareme && rubriquesBaremeSelectionnees.length === 0 && errors.base_calcul_standard_bareme && (
            <p className="text-red-500 text-xs mt-1">
              {errors.base_calcul_standard_bareme.message as string}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );

  /**
   * Section Formule Personnalisée
   */
  const renderFormulePersonnalisee = () => (
    <fieldset className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
      <legend className="flex items-center gap-2 text-purple-800 px-2">
        <CodeBracketIcon className="h-5 w-5" />
        <h4 className="font-medium">Configuration de la formule personnalisée</h4>
      </legend>
      
      <div className="flex flex-col gap-1">
        <label htmlFor="formule_personnalisee" className="text-sm font-medium text-gray-700">
          Formule de calcul
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          id="formule_personnalisee"
          rows={4}
          {...register('formule_personnalisee')}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical font-mono"
          placeholder="Ex: (SALAIRE_BRUT * 0.15) + PRIME_ANCIENNETE"
        />
        
        {/* Aides contextuelles et exemples */}
        <div className="mt-3 p-3 bg-white rounded-lg border border-purple-100 text-xs">
          <h6 className="font-medium text-purple-800 mb-2">Variables disponibles</h6>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <span className="font-medium">Variables de base :</span>
              <ul className="list-disc pl-4 text-gray-600 space-y-1">
                <li>SALAIRE_BRUT</li>
                <li>SALAIRE_NET</li>
                <li>MONTANT_TOTAL_GAINS</li>
                <li>MONTANT_TOTAL_DEDUCTIONS</li>
              </ul>
            </div>
            <div>
              <span className="font-medium">Rubriques spécifiques :</span>
              <ul className="list-disc pl-4 text-gray-600 space-y-1">
                <li>PRIME_ANCIENNETE</li>
                <li>IRPP_CALCULE</li>
                <li>CNPS_CALCULE</li>
                <li>HEURES_SUPPLEMENTAIRES</li>
              </ul>
            </div>
          </div>
          
          <h6 className="font-medium text-purple-800 mb-2">Exemples de formules</h6>
          <div className="space-y-1 text-gray-600">
            <p><code>(SALAIRE_BRUT * 0.05) + PRIME_ANCIENNETE</code> - 5% du salaire brut plus la prime d'ancienneté</p>
            <p><code>SALAIRE_BRUT * 0.0175</code> - 1.75% du salaire brut</p>
            <p><code>MONTANT_TOTAL_GAINS * 0.1</code> - 10% du total des gains</p>
          </div>
          
          <div className="flex justify-center mt-3">
            <button
              type="button"
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
              onClick={() => {
                // Insérer une variable dans le textarea
                const textarea = document.getElementById('formule_personnalisee') as HTMLTextAreaElement;
                if (textarea) {
                  const position = textarea.selectionStart;
                  const currentValue = textarea.value;
                  const newValue = `${currentValue.substring(0, position)}SALAIRE_BRUT${currentValue.substring(position)}`;
                  
                  if (setValue) {
                    setValue('formule_personnalisee', newValue);
                    // Focus et positionner le curseur après la variable insérée
                    setTimeout(() => {
                      textarea.focus();
                      textarea.setSelectionRange(position + 12, position + 12);
                    }, 0);
                  }
                }
              }}
            >
              Insérer une variable
            </button>
          </div>
        </div>
        
        {errors.formule_personnalisee && (
          <p className="text-red-500 text-xs mt-1">
            {errors.formule_personnalisee.message as string}
          </p>
        )}
      </div>
    </fieldset>
  );

  return (
    <div className="space-y-4">
      {/* Sélecteur de méthode de calcul */}
      <div className="flex flex-col gap-1">
        <label htmlFor="methode_calcul" className="text-sm font-medium text-gray-700">
          Méthode de calcul
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          id="methode_calcul"
          {...register('methode_calcul')}
          onChange={handleMethodeChange}
          disabled={methodSelectDisabled}
          className={`border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${methodSelectDisabled ? "opacity-70 bg-gray-100 cursor-not-allowed" : ""}`}
        >
          <option value="">-- Sélectionner une méthode --</option>
          {optionsMethodeCalcul.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {typeRubrique === "salaire" && (
          <p className="text-xs text-amber-600 mt-1">
            Pour les rubriques de type "Salaire de base", seule la méthode "Montant fixe" est disponible.
          </p>
        )}
        {errors.methode_calcul && (
          <p className="text-red-500 text-xs mt-1">
            {errors.methode_calcul.message as string}
          </p>
        )}
      </div>
      
      {/* Contenu conditionnel selon la méthode sélectionnée */}
      {renderMethodeContent()}
      
      {!methodeCalcul && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Sélectionnez d'abord une méthode de calcul pour configurer les paramètres
          </p>
        </div>
      )}
    </div>
  );
};

export default RubricMethodCalculator;