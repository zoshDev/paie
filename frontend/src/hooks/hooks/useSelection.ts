
import { useState } from 'react';

export function useSelection<T extends { id: string | number }>(data: T[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectedId = (id: string | number) => {
    const strId = String(id);
    setSelectedIds((prev) =>
      prev.includes(strId) ? prev.filter((i) => i !== strId) : [...prev, strId]
    );
  };

  const toggleAllSelected = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((item) => String(item.id)));
    }
  };

  const isAllSelected = selectedIds.length === data.length;

  return { selectedIds, toggleSelectedId, toggleAllSelected, isAllSelected };
}
