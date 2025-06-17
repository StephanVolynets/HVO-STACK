import { z } from "zod";
import {
  assignStaffDTOSchema,
  inboxTaskDTOSchema,
  libraryTaskDTOSchema,
  staffTaskDTOSchema,
  taskSchema,
  taskVideoDTOSchema,
  updateTaskStaffDTOSchema,
} from "../schemas";
import { AudioDub } from "./audio-dub";
import { TaskStaff } from "./task-staff";
import { Video } from "./video";
import { FeedbackTask } from "./feedback-task";

export interface Task extends z.infer<typeof taskSchema> {
  audioDub: AudioDub;
  staffs: TaskStaff[];
  feedbacks: FeedbackTask[];
  video?: Video | null;
}

export interface InboxTaskDTO extends z.infer<typeof inboxTaskDTOSchema> { }

export interface taskVideoDTO extends z.infer<typeof taskVideoDTOSchema> { }

export interface AssignStaffDTO extends z.infer<typeof assignStaffDTOSchema> { }

export interface UpdateTaskStaffDTO extends z.infer<typeof updateTaskStaffDTOSchema> { }

export interface LibraryTaskDTO extends z.infer<typeof libraryTaskDTOSchema> { }

export interface TaskDTO extends z.infer<typeof staffTaskDTOSchema> { }
