// components/ui/EntityViewContent.tsx
import React from "react";
import {
  UserIcon,
  DocumentTextIcon,
  BuildingOffice2Icon,
  TagIcon
} from "@heroicons/react/24/outline";

interface FieldDisplay {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
}

interface EntityViewContentProps {
  title?: string;
  fields: FieldDisplay[];
  illustration?: React.ReactNode;
  entityType?: "employee" | "rubrique" | "societe" | "profil" | string;
}

const getDefaultIllustration = (entityType?: string) => {
  switch (entityType) {
    case "employee": return <UserIcon className="w-32 h-32 text-indigo-100" />;
    case "rubrique": return <TagIcon className="w-32 h-32 text-indigo-100" />;
    case "societe": return <BuildingOffice2Icon className="w-32 h-32 text-indigo-100" />;
    case "profil": return <DocumentTextIcon className="w-32 h-32 text-indigo-100" />;
    default: return <DocumentTextIcon className="w-32 h-32 text-indigo-100" />;
  }
};

const EntityViewContent: React.FC<EntityViewContentProps> = ({
  title,
  fields,
  illustration,
  entityType
}) => {
  return (
    <div className="relative p-4 space-y-4 min-h-[200px]">
      {illustration || entityType ? (
        <div className="absolute inset-0 flex justify-center items-center z-0 opacity-10 pointer-events-none">
          {illustration || getDefaultIllustration(entityType)}
        </div>
      ) : null}

      {title && <h2 className="text-lg font-semibold text-gray-800 z-10 relative">{title}</h2>}

      <div className="space-y-2 relative z-10">
        {fields.map((f, idx) => (
          <div key={idx} className="text-sm flex items-start gap-2">
            {f.icon && <div className="text-gray-400 mt-0.5">{f.icon}</div>}
            <p className="text-gray-700">
              <span className="font-medium">{f.label}: </span>
              <span className="text-gray-800">{f.value}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntityViewContent;
