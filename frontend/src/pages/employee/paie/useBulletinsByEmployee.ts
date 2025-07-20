import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { BulletinPaie } from "@/types/payroll"; // adapte le chemin si nécessaire

export function useBulletinsByEmployee(employeeId: string) {
  return useQuery({
    queryKey: ["bulletins", employeeId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/bulletins?employeeId=${employeeId}`);
      return data as BulletinPaie[];
    },
    enabled: !!employeeId,
  });
}
