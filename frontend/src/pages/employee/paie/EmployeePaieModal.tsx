import { Tab } from "@headlessui/react";
import { useState } from "react";
import { GenerateBulletinForm } from "./GenerateBulletinForm";
import { BulletinHistoryTable } from "./BulletinHistoryTable";
import { ReevaluateBulletinForm } from "./ReevaluateBulletinForm";
import type { RawEmployee as Employee } from "@/pages/employee/rawEmployee"; // Adjust the import path as necessary


interface Props {
  employee: Employee;
  showTitle?: boolean; // Optional prop to control title visibility
}

export function EmployeePaieModal({ employee }: Props) {
  const tabs = ["Générer", "Historique", "Réévaluer"];
  const [selectedTab, setSelectedTab] = useState(0);
  console.log("👤 Props Employee:", employee);

  return (
    
    <div className="space-y-6 text-sm text-gray-800">
      {/*<h2 className="text-lg font-semibold text-indigo-700">
        Gestion de la paie — {employee.name} {/*{employee.prenom}
      </h2>*/}
      {showTitle && (
        <h2 className="text-lg font-semibold">Gestion de la paie</h2>
      )}

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-2 border-b pb-2">
          {tabs.map((tab, i) => (
            <Tab
              key={i}
              className={({ selected }) =>
                `px-3 py-1 rounded-t border-b-2 ${
                  selected
                    ? "border-indigo-600 text-indigo-700 font-semibold"
                    : "border-transparent text-gray-500 hover:text-indigo-600"
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="pt-2 space-y-4">
          <Tab.Panel>
            <GenerateBulletinForm employeeId={employee.id} />
          </Tab.Panel>
          <Tab.Panel>
            <BulletinHistoryTable employeeId={employee.id} />
          </Tab.Panel>
          <Tab.Panel>
            <ReevaluateBulletinForm employeeId={employee.id} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
