import { z } from "zod";
import { FormType, StaffType, VideoStatus } from "./enums";
import { inboxAudioDubDTOSchema, libraryAudioDubDTOSchema, previewAudioDubDTOShema } from "./audio-dub";
import { creatorBasicDTOSchema } from "./creator";
import { inboxTaskDTOSchema } from "./task";

export const videoSchema = z.object({
  id: z.number().int(),
  youtube_url: z.string().nullish(),
  title: z.string(),
  description: z.string().nullish(),
  thumbnail_url: z.string().nullish(),
  status: z.nativeEnum(VideoStatus),
  form_type: z.nativeEnum(FormType).nullish(),
  isInitialized: z.boolean(),
  expected_by: z.date().nullish(),
  root_folder_id: z.string().nullish(),
  deliverables_folder_id: z.string().nullish(),
  source_files_folder_id: z.string().nullish(),
  raw_script_folder_id: z.string().nullish(),
  raw_audio_folder_id: z.string().nullish(),
  mp4_folder_id: z.string().nullish(),
  m_and_e_folder_id: z.string().nullish(),
  created_at: z.date(),
  updated_at: z.date(),
  sonixMediaId: z.string().nullish(),
  isVideoResourceUploaded: z.boolean(),
  isAudioResourceUploaded: z.boolean(),
  creator_id: z.number().int(),
  isRawTranscriptReady: z.boolean().nullish(),
  transcription_task_id: z.number().int().nullish(),
  youtubeChannelId: z.number().int().nullish(),
});

export const VideoSummaryDTOSchema = videoSchema
  .pick({
    id: true,
    title: true,
    description: true,
    thumbnail_url: true,
  })
  .extend({
    creator: creatorBasicDTOSchema,
  });

// Create Video DTO
export const createVideoDTOSchema = videoSchema
  .pick({
    youtube_url: true,
    title: true,
    description: true,
    creator_id: true,
    form_type: true,
    expected_by: true,
    youtubeChannelId: true,
  })
  .extend({
    languageIds: z.array(z.number().int()).nonempty({ message: "Language IDs cannot be empty" }),
    //
    youtube_url: z.string().url({ message: "Invalid YouTube URL" }).optional(),
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    creator_id: z.number().int().min(1, { message: "Creator ID is required" }),
  });

export const inboxVideoDTOSchema = videoSchema
  .pick({
    id: true,
    title: true,
    description: true,
    thumbnail_url: true,
    status: true,
    root_folder_id: true,
    expected_by: true,
  })
  .extend({
    creator: creatorBasicDTOSchema,
    audioDubs: z.array(inboxAudioDubDTOSchema),
    transcriptionTask: inboxTaskDTOSchema,
  });

// export const shortVideoSummaryDTOSchema = videoSchema.pick({
//   id: true,
//   title: true,
// });

// export const assignStaffToVideoDTOSchema = z.object({
//   videoId: z.number().int(),
//   staffId: z.number().int(),
//   staffType: z.nativeEnum(StaffType),
// });

export const libraryVideoDTOSchema = videoSchema
  .pick({
    id: true,
    title: true,
    isInitialized: true,
    description: true,
    thumbnail_url: true,
    status: true,
    root_folder_id: true,
    deliverables_folder_id: true,
  })
  .extend({
    audioDubs: z.array(libraryAudioDubDTOSchema),
    rootFolderId: z.string().optional(),
  });

// Add Video
// export const addVideoDTOSchema = videoSchema
//   .pick({
//     title: true,
//     description: true,
//     youtube_url: true,
//     // creator_id: true,
//   })
//   .extend({
//     description: z.string().optional(),
//     youtube_url: z.string().optional(),
//     //
//     video_file_id: z.string().min(1, { message: "Video is required" }),
//     soundtrack_file_id: z.string().min(1, { message: "Soundtrack is required" }),
//     session_folder_id: z.string().min(1, { message: "Folder ID is required" }),
//     // creator_id: z.number().int().min(1, { message: "Creator ID is required" }),
//   });

export const addVideoDTOSchema = videoSchema
  .pick({
    title: true,
    description: true,
    form_type: true,
    expected_by: true,
    youtubeChannelId: true,
  })
  .extend({
    description: z.string().optional(),
    //
    session_id: z.string().min(1, { message: "Session id is required" }),
    video_file_id: z.string().min(1, { message: "Video is required" }), // Only for validation
    soundtrack_file_id: z.string().min(1, { message: "Soundtrack is required" }), // Only for validation
    // If user has entered Google Drive or YT URL then the microservice has to upload it to the upload url.
    uploadUrls: z
      .object({
        video: z.string().optional(),
        meAudio: z.string().optional(),
      })
      .optional(),
  });

// Video Preview
export const videoPreviewDTOSchema = videoSchema
  .pick({
    id: true,
    title: true,
    description: true,
    thumbnail_url: true,
  })
  .extend({
    audioDubs: z.array(previewAudioDubDTOShema),
  });

export const videoPreviewMediaDTOSchema = z.object({
  videoSrc: z.string(),
  audioTracks: z.array(
    z.object({
      languageId: z.number().int(),
      src: z.string(),
      available: z.boolean(),
    })
  ),
});

// /

// Input schema for initiateVideoUpload
export const initiateVideoUploadInputSchema = z.object({
  creatorId: z.string().min(1, "Creator Folder ID is required"),
});

// Output schema for initiateVideoUpload
export const initiateVideoUploadOutputSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  uploadUrls: z.object({
    video: z.string().url("Invalid URL format"),
    meAudio: z.string().url("Invalid URL format"),
  }),
});
