import { z } from "zod";

export const creatorLanguageSchema = z.object({
  creator_id: z.number().int(),
  language_id: z.number().int(),
  active: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});
