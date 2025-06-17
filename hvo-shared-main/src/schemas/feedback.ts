import { z } from "zod";
import { AudioDubPhase, FeedbackPhase, FeedbackStatus } from "./enums";
import { feedbackIssueDTOSchema } from "./feedback-issue";
// export const feedbackSchema = z.object({
//   id: z.number().int(),
//   timestamp: z.number().int(),
//   creatorDescription: z.string(),
//   vendorDescription: z.string().nullish(),
//   creatorPhase: z.nativeEnum(FeedbackPhase),
//   vendorPhase: z.nativeEnum(AudioDubPhase),
//   createdAt: z.date(),
//   status: z.nativeEnum(FeedbackStatus),
//   audioDubId: z.number().int(),
// });

export const feedbackSchema = z.object({
  id: z.number().int(),
  // vendorPhase: z.nativeEnum(AudioDubPhase).nullish(),
  originPhase: z.nativeEnum(AudioDubPhase).nullish(),
  createdAt: z.date(),
  status: z.nativeEnum(FeedbackStatus),
  reportedLanguageId: z.number().int().nullish(),
  videoId: z.number().int().nullish(),
  audioDubId: z.number().int().nullish(),
});

// export const feedbackDTOSchema = feedbackSchema
//   .omit({
//     audioDubId: true,
//   })
//   .extend({
//     language: z.object({
//       name: z.string(),
//       code: z.string(),
//     }),
//   });

export const feedbackDTOSchema = feedbackSchema
  .omit({
    audioDubId: true, // Remove since we'll include language info instead
  })
  .extend({
    language: z.object({
      name: z.string(),
      code: z.string(),
    }),
    issues: z.array(feedbackIssueDTOSchema),
  });

// Schema for the entire feedback submission
export const submitFeedbackDTOSchema = z.object({
  videoId: z.number().int(),
  languageId: z.number().int(),
  issues: z.array(feedbackIssueDTOSchema.omit({ id: true, status: true })).min(1),
});

export const approveFeedbackDTOSchema = z.object({
  phase: z.nativeEnum(AudioDubPhase),
});
