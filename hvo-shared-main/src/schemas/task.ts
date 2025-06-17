import { z } from "zod";
import { AudioDubProgress, TaskStatus, TaskType } from "./enums";
import { staffDTOSchema } from "./staff";
import { libraryAudioDubDTOSchema, taskAudioDubDTOSchema } from "./audio-dub";
import { VideoSummaryDTOSchema } from "./video";
import { has } from "lodash";

export const taskSchema = z.object({
  id: z.number().int(),
  status: z.nativeEnum(TaskStatus),
  type: z.nativeEnum(TaskType),
  autoUploadedPendingSubmission: z.boolean(),
  resources_folder_id: z.string().nullish(),
  uploaded_files_folder_id: z.string().nullish(),
  expected_delivery_date: z.date().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  audioDubId: z.number().int().nullish(),
});

// Task DTO
export const inboxTaskDTOSchema = taskSchema
  .pick({
    id: true,
    status: true,
    type: true,
    expected_delivery_date: true,
  })
  .extend({
    staffs: z.array(staffDTOSchema),
  });

// Task Video DTO
export const taskVideoDTOSchema = z.object({
  taskId: z.number().int(),
  videoTitle: z.string(),
});

// Asign Staff DTO
export const assignStaffDTOSchema = z.object({
  taskId: z.number().int(),
  staffId: z.number().int(),
});

// Update Staff on Task DTO
export const updateTaskStaffDTOSchema = z.object({
  updates: z.array(
    z.object({
      taskId: z.number().int(),
      staffIds: z.array(z.number().int()),
      expectedDeliveryDate: z.date().nullish(),
    })
  ),
});

// Library
export const libraryTaskDTOSchema = taskSchema.pick({
  id: true,
  status: true,
  type: true,
});

// Staff > Tasks
export const staffTaskDTOSchemaDeprecated = taskSchema
  .pick({
    id: true,
    status: true,
    type: true,
    resources_folder_id: true,
    uploaded_files_folder_id: true,
    expected_delivery_date: true,
  })
  .extend({
    video: VideoSummaryDTOSchema,
    audioDub: taskAudioDubDTOSchema,
    hasFeedback: z.boolean().optional(),
  });

  // export const staffTaskDTOSchemaDeprecated = taskSchema
  // .pick({
  //   id: true,
  //   status: true,
  //   type: true,
  //   resources_folder_id: true,
  //   uploaded_files_folder_id: true,
  //   expected_delivery_date: true,
  // })
  // .extend({
  //   video: VideoSummaryDTOSchema,
  //   audioDub: taskAudioDubDTOSchema,
  //   hasFeedback: z.boolean().optional(),
  // });
