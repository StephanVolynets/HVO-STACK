import { z } from "zod";

export const taskStaffSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  taskId: z.number().int(),
  staffId: z.number().int(),
});
