// src/schemas/auth/login.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, 'Pseudonyme requis'),
  password: z.string().min(6, 'Mot de passe requis'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
