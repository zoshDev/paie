import type { FormField } from "./form/form.types";
import type { FixedValueField } from "./fields/FixedValueField";
import { FormulaField } from "./fields/FormulaField";
import { TestField } from "./fields/TestField";
import { IntervalField } from "./fields/IntervalField";

export function getVariableFields(
  type: "Valeur" | "Calcul" | "Test" | "Intervalle",
  availableVariables: { code: string; libelle?: string }[]
): FormField[] {
  switch (type) {
    case "Valeur":
      return [
        {
          name: "valeurFixe",
          label: "Valeur fixe",
          type: "custom",
          component: <FixedValueField />,
        },
      ];
    case "Calcul":
      return [
        {
          name: "formule",
          label: "Formule",
          type: "custom",
          component: <FormulaField availableVariables={availableVariables} />,
        },
      ];
    case "Test":
      return [
        {
          name: "condition",
          label: "Condition",
          type: "custom",
          component: <TestField availableVariables={availableVariables} />,
        },
      ];
    case "Intervalle":
      return [
        {
          name: "intervalle",
          label: "Intervalle",
          type: "custom",
          component: <IntervalField />,
        },
      ];
    default:
      return [];
  }
}