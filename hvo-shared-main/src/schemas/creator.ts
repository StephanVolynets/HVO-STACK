import { z } from "zod";
import { createUserDTOSchema, userSchema } from "./user";

export const creatorSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  description: z.string().nullish(),
  youtube_channel_link: z.string().nullish(),
  rate: z.number(),
  videos_in_queue: z.number().int(),
  videos_in_progress: z.number().int(),
  videos_completed: z.number().int(),
  created_at: z.date(),
  updated_at: z.date(),
});

// DTOs
export const createCreatorDTOSchema = creatorSchema
  .pick({
    username: true,
    description: true,
    youtube_channel_link: true,
    // rate: true,
  })
  .merge(createUserDTOSchema.omit({ role: true }))
  .extend({
    full_name: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string().min(1, { message: "Username is required" }),
    // youtube_channel_link: z.string().min(1, { message: "YouTube channel link is required" }),
    // rate: z.number().min(0.01, { message: "Rate must be a positive number" }),
    language_ids: z.array(z.number().int()).min(1, { message: "At least one language is required" }),
    // description: z.string().optional(),
    multiple_speakers: z.boolean(),
    channels: z
      .array(
        z.object({
          name: z.string().min(1, { message: "Channel name is required" }),
          link: z.string().min(1, { message: "Channel link is required" }),
        })
      )
      .min(1, { message: "At least one channel is required" }),
  });

const pickedUserSchema = userSchema.pick({
  id: true,
  full_name: true,
  photo_url: true,
});
const pickedCreatorSchema = creatorSchema.pick({
  username: true,
  videos_in_queue: true,
  videos_in_progress: true,
  videos_completed: true,
});
export const creatorSummaryDTOSchema = pickedCreatorSchema.merge(pickedUserSchema);

// CreatorBasicDTO

export const creatorBasicDTOSchema = pickedUserSchema
  .extend({
    username: z.string(),
  })
  .extend({
    photoUrl: z.string().nullish(),
  });

// Stats
export const creatorStatsDTOSchema = creatorSchema.pick({
  videos_in_queue: true,
  videos_in_progress: true,
  videos_completed: true,
});
