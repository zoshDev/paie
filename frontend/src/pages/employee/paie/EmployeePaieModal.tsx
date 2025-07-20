import { Tab } from "@headlessui/react";
import { useState, useEffect } from "react";
import { GenerateBulletinForm } from "./GenerateBulletinForm";
import { BulletinHistoryTable } from "./BulletinHistoryTable";
import { ReevaluateBulletinForm } from "./ReevaluateBulletinForm";
import type { RawEmployee as Employee } from "@/pages/employee/rawEmployee";
import { DocumentPlusIcon, ClockIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

interface Props {
  employee: Employee;
  showTitle?: boolean;
}

export function EmployeePaieModal({ employee, showTitle = false }: Props) {
  // TODO: Remplacer par une vraie condition métier (ex: via React Query)
  const hasBulletin = true; // ← à rendre dynamique plus tard

  const tabs = [
    { label: "Créer Bulletin", icon: DocumentPlusIcon, show: true },
    { label: "Corriger Bulletin", icon: PencilSquareIcon, show: hasBulletin },
    { label: "Historique & Impression", icon: ClockIcon, show: hasBulletin },
  ];

  const visibleTabs = tabs.filter((tab) => tab.show);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    console.log("🧾 Onglet actif :", visibleTabs[selectedTab]?.label);
  }, [selectedTab]);

  return (
    <div className="space-y-6 text-sm text-gray-800">
      {showTitle && (
        <h2 className="text-lg font-semibold">Gestion de la paie</h2>
      )}

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-2 border-b pb-2">
          {visibleTabs.map(({ label, icon: Icon }, i) => (
            <Tab
              key={i}
              className={({ selected }) =>
                `px-3 py-1 rounded-t border-b-2 flex items-center gap-2 ${
                  selected
                    ? "border-indigo-600 text-indigo-700 font-semibold"
                    : "border-transparent text-gray-500 hover:text-indigo-600"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="pt-2 space-y-4">
          {visibleTabs.map(({ label }, i) => (
            <Tab.Panel key={i}>
              {label === "Créer Bulletin" && (
                <GenerateBulletinForm employeeId={employee.id} />
              )}
              {label === "Historique & Impression" && (
                <BulletinHistoryTable employeeId={employee.id} />
              )}
              {label === "Corriger Bulletin" && (
                <ReevaluateBulletinForm employeeId={employee.id} />
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
