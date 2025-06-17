import { z } from "zod";
import { FeedbackPhase } from "./enums";

// // Schema for individual feedback issues
// export const feedbackIssueSchema = z.object({
//   startTimestamp: z.number().int(),
//   endTimestamp: z.number().int(),
//   description: z.string()
// });

// // Schema for the entire feedback submission
// export const submitFeedbackDTOSchema = z.object({
//   videoId: z.number().int(),
//   languageId: z.number().int(),
//   issues: z.array(feedbackIssueSchema).min(1)
// });
