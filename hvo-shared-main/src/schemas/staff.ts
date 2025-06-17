import { z } from "zod";
import { StaffType, TaskStatus } from "./enums";
import { createUserDTOSchema, userSchema } from "./user";
import { languageDTOSchema } from "./language";
import { videoSchema, VideoSummaryDTOSchema } from "./video";
import { taskSchema } from "./task";
import { feedbackSchema } from "./feedback";
import { feedbackIssueSchema } from "./feedback-issue";

export const staffSchema = z.object({
  id: z.number().int(),
  staff_type: z.nativeEnum(StaffType),
  rate: z.number(),
  language_id: z.number().int().nullish(),
  default_creator_id: z.number().int().nullish(),
  created_at: z.date(),
  updated_at: z.date(),
});

// DTOs
export const createStaffDTOSchema = staffSchema
  .pick({
    staff_type: true,
    language_id: true,
  })
  .merge(createUserDTOSchema.omit({ role: true }))
  .extend({
    full_name: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    staff_type: z.nativeEnum(StaffType).nullable(),
    // default_creator_id: z.number().int().nullable(),
    language_id: z.number().int().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    // Check if staffType is not 'Sound-Engineer' and languageId is missing
    if (data.staff_type !== StaffType.AUDIO_ENGINEER && !data.language_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Language ID is required for staff types other than Sound-Engineer",
        path: ["languageId"],
      });
    }
  });

// Summary DTO
const pickedUserSchema = userSchema.pick({
  id: true,
  full_name: true,
  photo_url: true,
});

const pickedStaffSchema = staffSchema.pick({
  staff_type: true,
});

export const staffSummaryDTOSchema = pickedStaffSchema.merge(pickedUserSchema).extend({
  language: languageDTOSchema,
  videos: z.array(VideoSummaryDTOSchema),
});

export const staffDTOSchema = pickedUserSchema;

// Select Staff DTO
export const selectStaffDTOSchema = pickedUserSchema.extend({
  isSelected: z.boolean(),
});


// ------- New staff DTO Schemas -------
// export const videoTaskDTOSchema = z.object({
//   taskId: z.number().int(),
//   languageName: z.string(),
//   languageCode: z.string(),
//   status: z.nativeEnum(TaskStatus),
// })

export const staffVideoDTOSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  hasActiveFeedback: z.boolean(),
  tasks: z.array(z.object({
    taskId: z.number().int(),
    languageId: z.number().int(),
    languageName: z.string(),
    languageCode: z.string(),
    status: z.nativeEnum(TaskStatus),
    uploadedFilesFolderId: z.string(),
  })),
})

export const staffTaskDTOSchema = taskSchema.pick({ // DELETE
  id: true,
  status: true,
  resources_folder_id: true,
  uploaded_files_folder_id: true,
  expected_delivery_date: true,
}).extend({
  videoId: z.number().int(),
  resourcesCount: z.number(),
  feedbacksCount: z.number(),
})

export const staffFeedbackDTOSchema = feedbackSchema.pick({
  id: true,
  status: true,
}).extend({
  issues: z.array(feedbackIssueSchema.pick({
    id: true,
    status: true,
    description: true,
    startTimestamp: true,
    endTimestamp: true,
  })),
})
