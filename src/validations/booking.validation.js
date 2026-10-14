import { z } from "zod";

export const bookingCreateSchema = z.object({
  clientName: z.string().min(1, "El nombre del cliente es obligatorio"),
  clientEmail: z.string().email("El email no tiene un formato válido"),
  date: z.string().min(1, "La fecha es obligatoria"),
  time: z.string().min(1, "La hora es obligatoria"),
  status: z.enum(["pending", "confirmed", "cancelled"]).optional(),
  services: z
    .array(
      z.object({
        service: z.string().min(1, "El id del servicio es obligatorio"),
        quantity: z.number().int().positive().optional(),
      }),
    )
    .optional(),
});

export const bookingAddServiceSchema = z
  .object({
    quantity: z.number().int().positive().optional(),
  })
  .default({});
