import { z } from "zod";
import { feedbackIssueSchema, submitFeedbackDTOSchema } from "../schemas";

export interface SubmitFeedbackDTO extends z.infer<typeof submitFeedbackDTOSchema> {}
// export type FeedbackIssue = z.infer<typeof feedbackIssueSchema>;
