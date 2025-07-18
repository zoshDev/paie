import type { RawEmployee } from "@/pages/employee/rawEmployee";

export function toEmployee(raw: RawEmployee) {
  return {
    ...raw,
    id: String(raw.id), // ✅ conversion en string
  };
}

export function toEntity(e: RawEmployee): { id: string } & RawEmployee {
  return { ...e, id: String(e.id) };
}
