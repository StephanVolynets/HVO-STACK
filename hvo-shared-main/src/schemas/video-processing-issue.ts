import { z } from "zod";
import { VideoProcessingStage } from "./enums";
import { VideoProcessingIssueStatus } from "./enums";

export const videoProcessingIssueSchema = z.object({
  id: z.number().int(),
  videoId: z.number().int(),
  stage: z.nativeEnum(VideoProcessingStage),
  status: z.nativeEnum(VideoProcessingIssueStatus),
  errorMessage: z.string(),
  errorDetails: z.any(),
  createdAt: z.date(),
  updatedAt: z.date(),
  resolvedAt: z.date().nullish(),
});

export const videoProcessingIssueDTOSchema = videoProcessingIssueSchema.pick({
  videoId: true,
  stage: true,
  errorMessage: true,
  errorDetails: true,
});
