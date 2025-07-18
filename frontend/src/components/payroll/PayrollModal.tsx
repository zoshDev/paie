import React from "react";
import type { RawEmployee } from "@/pages/employee/rawEmployee";
import { EmployeePaieModal } from "@/pages/employee/paie/EmployeePaieModal";

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: RawEmployee | null;
}

const PayrollModal: React.FC<PayrollModalProps> = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-100/20 backdrop-blur-sm p-4">
      <div className="bg-white/95 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white/90 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">
            Gestion de la paie — {employee.matricule} ({employee.name})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-6">
          <EmployeePaieModal employee={employee} showTitle={false} />
        </div>
      </div>
    </div>
  );
};

export default PayrollModal;
