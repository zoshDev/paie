import React from "react";
import type { FormSection, FormField } from "./form/form.types";

interface GenericFormLiteProps {
  sections: FormSection[];
  initialValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  onValueChange?: (data: Record<string, any>) => void;
  isModal?: boolean;
  modalTitle?: string;
}

export default function GenericFormLite({
  sections,
  initialValues = {},
  onSubmit,
  onCancel,
  onValueChange,
  isModal,
  modalTitle,
}: GenericFormLiteProps) {
  const [values, setValues] = React.useState<Record<string, any>>(initialValues);

  const handleChange = (name: string, value: any) => {
    const updated = { ...values, [name]: value };
    setValues(updated);
    onValueChange?.(updated);
  };

  const renderField = (field: FormField): React.ReactNode => {
    const value = values[field.name];
    const { name, label, required, placeholder, options, component } = field;

    if (field.showWhen && !field.showWhen(values)) return null;

    switch (field.type) {
      case "text":
      case "number":
      case "email":
      case "password":
      case "date":
      case "hidden":
        return (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-sm font-semibold mb-1">{label}</label>
            <input
              id={name}
              type={field.type}
              required={required}
              placeholder={placeholder}
              value={value ?? ""}
              onChange={(e) => handleChange(name, e.target.value)}
              className="border rounded px-3 py-2 shadow-sm"
            />
          </div>
        );

      case "textarea":
        return (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-sm font-semibold mb-1">{label}</label>
            <textarea
              id={name}
              required={required}
              placeholder={placeholder}
              value={value ?? ""}
              onChange={(e) => handleChange(name, e.target.value)}
              rows={4}
              className="border rounded px-3 py-2 shadow-sm resize-none"
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={name} className="flex items-center gap-2">
            <input
              id={name}
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(name, e.target.checked)}
            />
            <label htmlFor={name} className="text-sm">{label}</label>
          </div>
        );

      case "radio":
        return (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-semibold mb-1">{label}</label>
            {options?.map((opt) => (
              <label key={opt.value} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => handleChange(name, opt.value)}
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case "select":
        return (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-sm font-semibold mb-1">{label}</label>
            <select
              id={name}
              required={required}
              value={value ?? ""}
              onChange={(e) => handleChange(name, e.target.value)}
              className="border rounded px-3 py-2 shadow-sm bg-white"
            >
              <option value="">-- Sélectionner --</option>
              {options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "multiselect":
        return (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-sm font-semibold mb-1">{label}</label>
            <select
              id={name}
              multiple
              value={value ?? []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                handleChange(name, selected);
              }}
              className="border rounded px-3 py-2 shadow-sm bg-white"
            >
              {options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        );

      case "custom":
        return (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-semibold mb-1">{label}</label>
            <div className="border rounded bg-gray-50 p-3 shadow-sm">
              {typeof component === "function" ? component() : component}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(values); }} className={`space-y-8 ${isModal ? "p-6 max-w-screen-md mx-auto" : ""}`}>
      {isModal && modalTitle && <h2 className="text-2xl font-semibold">{modalTitle}</h2>}

      {sections.map((section, idx) => (
        <fieldset key={idx} className="space-y-6">
          <legend className="text-lg font-medium border-b pb-1">{section.title}</legend>
          <div className={`grid gap-6 grid-cols-${section.columns ?? 1}`}>
            {section.fields.map(renderField)}
          </div>
        </fieldset>
      ))}

      <div className="flex justify-end gap-4 pt-6">
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Valider</button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
