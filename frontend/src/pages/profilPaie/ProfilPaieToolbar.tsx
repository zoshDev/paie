import React, { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Menu, { MenuItem } from "../../components/ui/Menu/Menu";
import { PlusIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface ToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAdd: () => void;
  onImport: () => void;
  onExport: () => void;
}

const ProfilPaieToolbar: React.FC<ToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  onAdd,
  onImport,
  onExport
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const toggleActions = () => setIsActionsOpen(prev => !prev);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex items-center space-x-4 w-full mb-6">
      <Input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="flex-1"
      />
      <div className="relative">
        <Button onClick={toggleActions} className="flex items-center">
          <span>Actions</span>
          <ChevronDownIcon className="w-5 h-5 ml-2" />
        </Button>
        <Menu isOpen={isActionsOpen} onClose={() => setIsActionsOpen(false)}>
          <MenuItem onClick={onAdd} icon={<PlusIcon className="w-5 h-5" />}>
            Ajouter un Profil
          </MenuItem>
          <MenuItem onClick={onImport} icon={<ArrowDownTrayIcon className="w-5 h-5" />}>
            Importer
          </MenuItem>
          <MenuItem onClick={onExport} icon={<ArrowUpTrayIcon className="w-5 h-5" />}>
            Exporter
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ProfilPaieToolbar;
