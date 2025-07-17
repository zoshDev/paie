import EntityModal from '@/components/ui/Modal/EntityModal';

interface PayrollEntityModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const PayrollEntityModal = ({ open, onClose, title, children }: PayrollEntityModalProps) => {
  return (
    <EntityModal
      open={open}
      onClose={onClose}
      title={title}
    >
      <div className="max-h-[90vh] w-[1000px] overflow-y-auto px-6 pb-6">
        {children}
      </div>
    </EntityModal>
  );
};

export default PayrollEntityModal;
