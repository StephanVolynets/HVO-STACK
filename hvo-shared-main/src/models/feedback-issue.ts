import { z } from "zod";

import { AudioDub } from "./audio-dub";
import { feedbackDTOSchema, feedbackIssueDTOSchema, feedbackIssueSchema, feedbackSchema } from "../schemas";
import { Feedback } from "./feedback";

export interface FeedbackIssue extends z.infer<typeof feedbackIssueSchema> {
  feedback: Feedback;
}

export interface FeedbackIssueDTO extends z.infer<typeof feedbackIssueDTOSchema> {}
