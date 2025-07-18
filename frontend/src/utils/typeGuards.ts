// 📁 src/utils/typeGuards.ts (tu peux créer ce fichier si besoin)
import type { RawEmployee } from "@/pages/employee/rawEmployee"; // Ajuste le chemin d'importation si nécessaire
export function isRawEmployee(entity: unknown): entity is RawEmployee {
  return (
    typeof entity === "object" &&
    entity !== null &&
    "id" in entity &&
    "name" in entity &&
    "matricule" in entity &&
    "societeId" in entity
  );
}
