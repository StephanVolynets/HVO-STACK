import { z } from "zod";

export const feedbackTaskSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  feedbackId: z.number().int(),
  taskId: z.number().int(),
});
