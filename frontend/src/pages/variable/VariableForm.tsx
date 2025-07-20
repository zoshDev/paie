import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import type { FormField } from "./form/form.types";
import { FixedValueField } from "./fields/FixedValueField";
import { FormulaField } from "./fields/FormulaField";
import { TestField } from "./fields/TestField";
import { IntervalField } from "./fields/IntervalField";

// ✅ Types
const schema = z.object({
  code: z.string().min(2, "Code requis"),
  libelle: z.string().min(2, "Libellé requis"),
  typeVariable: z.enum(["Valeur", "Calcul", "Test", "Intervalle"]),
  valeurFixe: z.string().optional(),
  formule: z.string().optional(),
  condition: z.any().optional(),
  intervalle: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

const availableVariables = [
  { code: "TX_IR", libelle: "Taux IR" },
  { code: "SALAIRE_NET", libelle: "Salaire net" },
  { code: "COTISATION", libelle: "Cotisation sociale" },
];

export default function VariableForm({ initialValues, onSubmit }: {
  initialValues?: Partial<FormData>;
  onSubmit: (data: FormData) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues ?? {
      code: "",
      libelle: "",
      typeVariable: "Valeur",
    },
  });

  const typeVariable = watch("typeVariable");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto space-y-8 p-6 bg-white border rounded shadow"
    >
      <h2 className="text-2xl font-semibold text-indigo-800">Variable métier</h2>

      {/* ✅ Section 1 - Infos générales */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-gray-700 border-b pb-1">
          Informations générales
        </legend>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="code" className="text-sm font-semibold">Code</label>
            <input
              id="code"
              {...register("code")}
              className="border px-3 py-2 rounded"
              placeholder="EX: TX_IR"
            />
            {errors.code && <p className="text-red-600 text-sm">{errors.code.message}</p>}
          </div>

          <div className="flex flex-col">
            <label htmlFor="libelle" className="text-sm font-semibold">Libellé</label>
            <input
              id="libelle"
              {...register("libelle")}
              className="border px-3 py-2 rounded"
              placeholder="EX: Taux IR"
            />
            {errors.libelle && <p className="text-red-600 text-sm">{errors.libelle.message}</p>}
          </div>

          <div className="flex flex-col col-span-2">
            <label htmlFor="typeVariable" className="text-sm font-semibold">Type</label>
            <select
              id="typeVariable"
              {...register("typeVariable")}
              className="border px-3 py-2 rounded"
            >
              <option value="Valeur">Valeur fixe</option>
              <option value="Calcul">Formule</option>
              <option value="Test">Conditionnelle</option>
              <option value="Intervalle">Par tranches</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* ✅ Section 2 - Champ métier dynamique */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-gray-700 border-b pb-1">
          Paramétrage métier
        </legend>

        {typeVariable === "Valeur" && (
          <Controller
            name="valeurFixe"
            control={control}
            render={({ field }) => <FixedValueField {...field} />}
          />
        )}

        {typeVariable === "Calcul" && (
          <Controller
            name="formule"
            control={control}
            render={({ field }) => (
              <FormulaField {...field} availableVariables={availableVariables} />
            )}
          />
        )}

        {typeVariable === "Test" && (
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <TestField {...field} availableVariables={availableVariables} />
            )}
          />
        )}

        {typeVariable === "Intervalle" && (
          <Controller
            name="intervalle"
            control={control}
            render={({ field }) => <IntervalField {...field} />}
          />
        )}
      </fieldset>

      {/* ✅ Actions */}
      <div className="flex justify-end pt-6 gap-4">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Valider
        </button>
      </div>
    </form>
  );
}
