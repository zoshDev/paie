import { create } from "zustand";
import type { Employee } from "./types";

interface EmployeeState{
    employees: Employee[];
    setEmployees: (employees: Employee[]) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
    employees: [],
    setEmployees: (employees) => set({ employees }),
}));