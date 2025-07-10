import { z } from "zod";

export const phoneSchema = z.object({
  brand: z.string(),
  imei: z.string().min(15, "L'IMEI doit contenir au moins 15 caractères"),
  name: z.string().min(1, "Le nom ne peut pas être vide"),
  color: z.string(),
  capacity: z
    .number({ invalid_type_error: "La capacité doit être un nombre" })
    .int()
    .positive("La capacité doit être supérieure à 0")
    .refine((val) => val % 2 === 0, "La capacité doit être un multiple de 2"),
});
