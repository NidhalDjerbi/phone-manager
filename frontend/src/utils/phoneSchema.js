import { z } from "zod";

export const phoneSchema = z.object({
  imei: z
    .string()
    .min(15)
    .max(15)
    .regex(/^\d{15}$/, "IMEI doit contenir 15 chiffres"),
  name: z.string().min(1, "Le nom ne peut pas être vide").max(255),
  brand: z.string(),
  color: z.string(),
  capacity: z
    .number()
    .positive("La capacité doit être supérieure à zéro")
    .refine((val) => val % 2 === 0, "La capacité doit être un multiple de 2"),
});
