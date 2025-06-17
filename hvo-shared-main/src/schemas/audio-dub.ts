import { z } from "zod";
import { AudioDubPhase, AudioDubProgress, AudioDubStatus } from "./enums";
import { inboxTaskDTOSchema, libraryTaskDTOSchema } from "./task";

export const audioDubSchema = z.object({
  id: z.number().int(),
  status: z.nativeEnum(AudioDubStatus),
  phase: z.nativeEnum(AudioDubPhase),
  createdAt: z.date(),
  updatedAt: z.date(),
  root_folder_id: z.string().nullish(),
  final_folder_id: z.string().nullish(),
  translatedTitle: z.string().nullish(),
  translatedDescription: z.string().nullish(),
  approved: z.boolean().nullish(),
  videoId: z.number().int(),
  languageId: z.number().int(),
});

export const inboxAudioDubDTOSchema = audioDubSchema
  .pick({
    id: true,
    phase: true,
    status: true,
    approved: true,
    translatedTitle: true,
    translatedDescription: true,
  })
  .extend({
    language: z.object({
      name: z.string(),
      // flag_url: z.string(),
      code: z.string(),
    }),
    tasks: z.array(inboxTaskDTOSchema),
  });

export const libraryAudioDubDTOSchema = audioDubSchema
  .pick({
    id: true,
    phase: true,
    status: true,
    approved: true,
    translatedTitle: true,
    translatedDescription: true,
    final_folder_id: true,
  })
  .extend({
    language: z.object({
      name: z.string(),
      // flag_url: z.string(),
      code: z.string(),
    }),
    tasks: z.array(libraryTaskDTOSchema),
  });

export const taskAudioDubDTOSchema = audioDubSchema
  .pick({
    id: true,
    phase: true,
    status: true,
    approved: true,
    translatedTitle: true,
    translatedDescription: true,
  })
  .extend({
    language: z.object({
      name: z.string(),
      code: z.string(),
    }),
  });

// Video Preview
export const previewAudioDubDTOShema = audioDubSchema
  .pick({
    id: true,
    status: true,
  })
  .extend({
    language: z.object({
      id: z.number().int(),
      name: z.string(),
      code: z.string(),
    }),
    available: z.boolean(),
  });

// Approve Audio Dub
export const approveAudioDubDTOSchema = z.object({
  title: z.string(),
  description: z.string(),
});
