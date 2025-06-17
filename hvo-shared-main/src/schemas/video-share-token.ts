import { z } from "zod";

export const videoShareTokenSchema = z.object({
  id: z.string().uuid(),
  token: z.string(),
  videoId: z.number().int(),
  expiresAt: z.date(),
  used: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createVideoShareTokenSchema = videoShareTokenSchema.omit({
  id: true,
  createdAt: true,
  expiresAt: true,
  used: true,
  updatedAt: true,
});

export const updateVideoShareTokenSchema = videoShareTokenSchema.partial().omit({
  id: true,
  token: true,
  videoId: true,
  expiresAt: true,
  used: true,
  createdAt: true,
});

export const shareVideoDTOSchema = z.object({
  videoId: z.number(),
  emails: z.array(z.string().email()).optional(),
});
