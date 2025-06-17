import { z } from "zod";
import { feedbackTaskSchema } from "../schemas";
import { Feedback } from "./feedback";
import { Task } from "./task";

export interface FeedbackTask extends z.infer<typeof feedbackTaskSchema> {
  feedback: Feedback;
  task: Task;
}
