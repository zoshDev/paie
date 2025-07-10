import React from 'react';

interface DetailsRendererProps {
  data: Record<string, any>;
  fieldLabels?: Record<string, string>; // optionnel : libellés personnalisés
}

const DetailsRenderer: React.FC<DetailsRendererProps> = ({ data, fieldLabels = {} }) => {
  return (
    <div className="space-y-2 text-sm">
      {Object.entries(data).map(([key, value]) => {
        const label = fieldLabels[key] ??
          key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

        const displayValue = Array.isArray(value)
          ? value.map((v) =>
              typeof v === 'object' ? JSON.stringify(v) : v
            ).join(', ')
          : typeof value === 'object'
          ? JSON.stringify(value)
          : value;

        return (
          <div key={key} className="flex justify-between">
            <span className="font-medium text-gray-700">{label}:</span>
            <span className="text-gray-900">{displayValue || '—'}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DetailsRenderer;
