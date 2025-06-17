import { z } from "zod";

export const vendorSchema = z.object({
  id: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
});
