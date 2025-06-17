import { z } from "zod";
import {
  createStaffDTOSchema,
  selectStaffDTOSchema,
  staffDTOSchema,
  staffFeedbackDTOSchema,
  staffSchema,
  staffSummaryDTOSchema,
  staffTaskDTOSchema,
  staffVideoDTOSchema,
} from "../schemas";
import { User } from "./user";
import { Language } from "./language";
import { Creator } from "./creator";
import { TaskStaff } from "./task-staff";

export interface Staff extends z.infer<typeof staffSchema> {
  user: User;
  language?: Language | null;
  defaultCreator?: Creator | null;
  tasks: TaskStaff[];
}

export interface CreateStaffDTO extends z.infer<typeof createStaffDTOSchema> {}

export interface StaffSummaryDTO extends z.infer<typeof staffSummaryDTOSchema> {}

export interface StaffDTO extends z.infer<typeof staffDTOSchema> {}

export interface SelectStaffDTO extends z.infer<typeof selectStaffDTOSchema> {}

// ------- New staff DTO Schemas -------
export interface StaffVideoDTO extends z.infer<typeof staffVideoDTOSchema> {}
export interface StaffTaskDTO extends z.infer<typeof staffTaskDTOSchema> {}
export interface StaffFeedbackDTO extends z.infer<typeof staffFeedbackDTOSchema> {}
