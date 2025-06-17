import { z } from "zod";

import { assistantDTOSchema, assistantSchema } from "../schemas";
import { User } from "./user";

export interface Assistant extends z.infer<typeof assistantSchema> {
  user: User;
  manager: User;
}

export interface AssistantDTO extends z.infer<typeof assistantDTOSchema> {}
