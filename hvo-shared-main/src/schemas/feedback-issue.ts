import { z } from "zod";
import { AudioDubPhase, FeedbackIssueStatus, FeedbackPhase, FeedbackStatus } from "./enums";

export const feedbackIssueSchema = z.object({
  id: z.number().int(),
  startTimestamp: z.number().int(),
  endTimestamp: z.number().int(),
  description: z.string(),
  createdAt: z.date(),
  status: z.nativeEnum(FeedbackIssueStatus),
  feedbackId: z.number().int(),
});

// Schema for individual feedback issues
export const feedbackIssueDTOSchema = feedbackIssueSchema.pick({
  id: true,
  startTimestamp: true,
  endTimestamp: true,
  description: true,
  status: true,
});
