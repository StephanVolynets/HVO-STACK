import { z } from "zod";

export const youtubeChannelSchema = z.object({
  id: z.number().int(),
  channel_id: z.string(),
  title: z.string(),
  url: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  creator_id: z.number().int(),
});

export const youtubeChannelBasicDTOSchema = youtubeChannelSchema.pick({
  id: true,
  title: true,
});
