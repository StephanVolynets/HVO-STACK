import { z } from "zod";

import { AudioDub } from "./audio-dub";
import { approveFeedbackDTOSchema, feedbackDTOSchema, feedbackSchema } from "../schemas";
import { FeedbackTask } from "./feedback-task";
import { FeedbackIssue } from "./feedback-issue";
import { Video } from "./video";
import { Language } from "./language";
export interface Feedback extends z.infer<typeof feedbackSchema> {
  reportedLanguage?: Language | null;
  video?: Video | null;
  audioDub?: AudioDub | null;
  issues: FeedbackIssue[];
  tasks: FeedbackTask[];
}

export interface FeedbackDTO extends z.infer<typeof feedbackDTOSchema> {}

export interface ApproveFeedbackDTO extends z.infer<typeof approveFeedbackDTOSchema> {}
