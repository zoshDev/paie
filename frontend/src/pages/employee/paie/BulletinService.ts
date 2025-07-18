// 📄 src/pages/employee/paie/BulletinService.ts

import axios from "@/utils/axiosInstance"; // 🔧 Assure-toi que ce fichier existe
import type { BulletinPaie, BulletinPayload } from "./types";

export const bulletinService = {
  async generateBulletin(payload: BulletinPayload): Promise<BulletinPaie> {
    const response = await axios.post("/bulletins/generate", payload);
    return response.data;
  },

  async getByEmploye(employeId: number): Promise<BulletinPaie[]> {
    const response = await axios.get(`/bulletins/employe/${employeId}`);
    return response.data;
  },

  async reevaluateBulletin(bulletinId: number): Promise<BulletinPaie> {
    const response = await axios.post(`/bulletins/${bulletinId}/reevaluer`);
    return response.data;
  },

  async editBulletin(bulletinId: number, updates: Partial<BulletinPaie>): Promise<BulletinPaie> {
    const response = await axios.patch(`/bulletins/${bulletinId}`, updates);
    return response.data;
  }
};
