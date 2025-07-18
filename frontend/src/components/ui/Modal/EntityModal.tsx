import React from "react";
import DeleteConfirmation from "./DeleteConfirmation";
import EntityViewContent from "./EntityViewContent";
import GenericForm from "../../form/GenericForm";
import type { FormField, FormSection } from "../GenericForm";
import RubricForm from "../../form/RubricForm";
import type { Rubric } from "../../../pages/rubric/types";
import DetailsRenderer from '@/components/ui/DetailsRenderer';
import { EmployeePaieModal } from "@/pages/employee/paie/EmployeePaieModal";
import type { RawEmployee as Employe } from "@/pages/employee/rawEmployee";
import { isRawEmployee } from "@/utils/typeGuards";
interface Entity {
  id: string;
  [key: string]: any;
}

type ModalMode = "view" | "edit" | "delete" | "create" | "bulk-delete" | "configure" | "assign-to-profiles" | "assign-entities" | "duplicate" |"paie-actions" | null;

interface EntityModalsProps<T extends Entity> {
  mode: ModalMode;
  entity: T | null;
  selectedIds: string[]; // pour les opérations de suppression multiple
  formFields?: FormField[];
  sections?: FormSection[];
  onClose: () => void;
  onDeleteConfirm?: (id: string) => void;
  renderEditForm?: (entity: T | null) => React.ReactNode;
  renderView?: (entity: T | null) => React.ReactNode;
  renderAssignToProfiles?: (selectedRubricIds: string[], onClose: () => void, onSubmit: (rubricIds: string[], profilIds: string[]) => void) => React.ReactNode;
  renderAssignmentForm?: (sourceIds: string[], onClose: () => void, onSubmit: (sourceIds: string[], targetIds: string[]) => void) => React.ReactNode;
  renderDuplicateForm?: (entity: T | null, onClose: () => void, onSubmit: (data: Partial<T>) => void) => React.ReactNode;
  entityType?: "rubric" | "employee" | "company" | "payroll" | string;
  onSubmit?: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
}

const EntityModals = <T extends Entity>({
  mode,
  entity,
  selectedIds,
  formFields,
  sections,
  onClose,
  onDeleteConfirm,
  renderEditForm,
  renderView,
  renderAssignToProfiles,
  renderAssignmentForm,
  renderDuplicateForm,
  entityType,
  onSubmit,
  isSubmitting = false
}: EntityModalsProps<T>) => {
  if (!mode) return null;
  if (mode !== "create" && mode !== "bulk-delete" && mode !== "assign-to-profiles" && mode !== "assign-entities" && mode !== "duplicate" && !entity) return null;

  const getTitle = () => {
    switch (mode) {
      case "view": return "Détails de l'élément";
      case "edit": return "Modifier l'élément";
      case "create": return "Ajouter un nouvel élément";
      case "delete": return "Supprimer l'élément";
      case "bulk-delete": return "Suppression multiple";
      case "configure": return "Configurer l'élément";
      case "assign-to-profiles": return "Assigner des rubriques à des profils de paie";
      case "assign-entities": return "Assigner des éléments";
      case "duplicate": return "Opération de Duplication";
      default: return "";
    }
  };

  // Déterminer la taille du modal en fonction du mode et du contenu
  const getModalSize = () => {
    if (mode === "delete" || mode === "bulk-delete") {
      return "max-w-md";
    }
    
    if (mode === "view") {
      return "max-w-xl";
    }

    if (mode === "assign-to-profiles" || mode === "assign-entities") {
      return "max-w-2xl";
    }

    // Pour les formulaires (edit/create), largeur réduite car une seule colonne
    return "max-w-2xl";
  };

  // Rendu du formulaire en fonction du type d'entité
  const renderForm = () => {
    // Si un renderEditForm personnalisé est fourni, l'utiliser
    if (renderEditForm) {
      return renderEditForm(mode === "create" ? null : entity);
    }
    
    // Sinon, utiliser le formulaire approprié selon le type d'entité
    switch (entityType) {
      case "rubric":
        return (
          <RubricForm 
            entity={mode === "create" ? null : entity as unknown as Rubric}
            mode={mode as "create" | "edit"}
            onSubmit={onSubmit || (() => onClose())}
            isSubmitting={isSubmitting}
            onClose={onClose}
          />
        );
      case "paie-actions":
        if (isRawEmployee(entity)) {
          return <EmployeePaieModal employee={entity} />;
        }
        return null;
      default:
        // Formulaire générique par défaut
        const hasForm = !!sections || !!formFields;
        if (!hasForm) return null;
        return (formFields || sections) ? (
          <div className="w-full">
            <GenericForm
              sections={sections}
              fields={formFields}
              initialValues={mode === "create" ? {} : entity || {}}
              onSubmit={(data) => {
                console.log("Submit:", data);
                if (onSubmit) {
                  onSubmit(data);
                } else {
                  onClose();
                }
              }}
              isSubmitting={isSubmitting}
            />
          </div>
        ) : null;
    }
  };

  // Détermine si le footer doit être affiché
  const showFooter = mode !== "assign-to-profiles" && mode !== "assign-entities" && mode !== "duplicate";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-100/20 backdrop-blur-sm p-4">
      <div className={`
        bg-white/95 rounded-lg shadow-xl w-full 
        ${getModalSize()} 
        max-h-[90vh]
        relative transform transition-all duration-300 
        opacity-100 scale-100 animate-fade-slide
        flex flex-col
      `}>
        {/* En-tête fixe */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white/90 rounded-t-lg flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">{getTitle()}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Contenu avec scroll obligatoire */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
          {mode === "view" && entity && (
            <div className="p-6">
              {renderView ? (
                renderView(entity)
              ) : (
                <DetailsRenderer data={entity} />
              )}
            </div>
          )}

          {(mode === "edit" || mode === "create") && (
            <div className="p-6">
              {renderForm()}
            </div>
          )}

          {mode === "delete" && entity && (
            <div className="p-6">
              <DeleteConfirmation
                count={1}
                label="élément"
                message={`Vous êtes sur le point de supprimer l'élément "${entity.name || entity.label || entity.id}".`}
                onCancel={onClose}
                onConfirm={() => {
                  onDeleteConfirm?.(entity.id);
                  onClose();
                }}
              />
            </div>
          )}

          {mode === "bulk-delete" && (
            <div className="p-6">
              <DeleteConfirmation
                ids={selectedIds}
                count={selectedIds.length}
                label="éléments"
                message={`Vous êtes sur le point de supprimer ${selectedIds.length} employés.`}
                onCancel={onClose}
                onConfirm={() => {
                  onDeleteConfirm?.("bulk");
                  onClose();
                }}
              />
            </div>
          )}

          {mode === "assign-to-profiles" && renderAssignToProfiles && (
            <div className="p-6">
              {renderAssignToProfiles(
                selectedIds,
                onClose,
                (rubricIds, profilIds) => {
                  // Cette fonction sera remplacée par onSubmit fourni par le parent
                  if (onSubmit) {
                    // Pour la compatibilité, on passe un objet avec les IDs
                    onSubmit({ rubricIds, profilIds });
                  }
                  onClose();
                }
              )}
            </div>
          )}

          {mode === "assign-entities" && renderAssignmentForm && (
            <div className="p-6">
              {renderAssignmentForm(
                selectedIds,
                onClose,
                (sourceIds, targetIds) => {
                  // Cette fonction sera remplacée par onSubmit fourni par le parent
                  if (onSubmit) {
                    // Pour la compatibilité, on passe un objet avec les IDs
                    onSubmit({ sourceIds, targetIds });
                  }
                  onClose();
                }
              )}
            </div>
          )}
          
          {mode === "duplicate" && renderDuplicateForm && entity && (
            <div className="p-6">
              {renderDuplicateForm(
                entity,
                onClose,
                (data) => {
                  // Cette fonction sera remplacée par onSubmit fourni par le parent
                  if (onSubmit) {
                    onSubmit(data);
                  }
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntityModals;


{/**
  <EntityViewContent
                  fields={Object.entries(entity).map(([key, value]) => ({
                    label: key,
                    value: String(value)
                  }))}
                  illustration={<span className="text-[100px]">🧾</span>}
                /> */}