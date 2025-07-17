import Modal from '@/components/ui/Modal';
import {
  TabGroup,
  TabList,
  TabPanels,
  TabPanel
} from '@headlessui/react';
import EvaluationPreview from './EvaluationPreview';
import BulletinForm from './BulletinForm';
import BulletinHistory from './BulletinHistory';
import type { Employee } from '@/pages/employee/types';

interface PayrollModalProps {
  open: boolean;
  onClose: () => void;
  employee: Employee;
}





const PayrollModal = ({ open, onClose, employee }: PayrollModalProps) => {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">
          Fiche de Paie — {employee.name}
        </h2>

        <TabGroup>
          <TabList className="flex space-x-4 border-b pb-2">
            <button className="px-4 py-1 text-sm font-medium border rounded bg-gray-50 hover:bg-gray-100">
              Évaluation
            </button>
            <button className="px-4 py-1 text-sm font-medium border rounded bg-gray-50 hover:bg-gray-100">
              Génération
            </button>
            <button className="px-4 py-1 text-sm font-medium border rounded bg-gray-50 hover:bg-gray-100">
              Historique
            </button>
          </TabList>
          <TabPanels>
            <TabPanel>
              <EvaluationPreview employee={employee} />
            </TabPanel>
            <TabPanel>
              <BulletinForm employee={employee} />
            </TabPanel>
            <TabPanel>
              <BulletinHistory employeId={employee.id} />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </Modal>
  );
};

export default PayrollModal;
