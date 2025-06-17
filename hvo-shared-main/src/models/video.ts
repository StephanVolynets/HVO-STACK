import { z } from "zod";
import { Creator } from "./creator";
import {
  addVideoDTOSchema,
  createVideoDTOSchema,
  inboxVideoDTOSchema,
  initiateVideoUploadInputSchema,
  initiateVideoUploadOutputSchema,
  libraryVideoDTOSchema,
  videoPreviewDTOSchema,
  videoPreviewMediaDTOSchema,
  // shortVideoSummaryDTOSchema,
  videoSchema,
  VideoSummaryDTOSchema,
} from "../schemas";
import { AudioDub } from "./audio-dub";
import { VideoProcessingIssue } from "./video-processing-issue";
import { YoutubeChannel } from "./youtube-channel";

export interface Video extends z.infer<typeof videoSchema> {
  creator: Creator;
  audioDubs: AudioDub[];
  // languages: VideoLanguage[];
  // assignments: Assignment[];
  channel: YoutubeChannel | null;
  videoProcessingIssue: VideoProcessingIssue[];
}

export interface CreateVideoDTO extends z.infer<typeof createVideoDTOSchema> {}

export interface VideoSummaryDTO extends z.infer<typeof VideoSummaryDTOSchema> {}

export interface InboxVideoDTO extends z.infer<typeof inboxVideoDTOSchema> {}

// export interface ShortVideoSummaryDTO extends z.infer<typeof shortVideoSummaryDTOSchema> {}

// export interface AssignStaffToVideoDTO extends z.infer<typeof assignStaffToVideoDTOSchema> {}

export interface LibraryVideoDTO extends z.infer<typeof libraryVideoDTOSchema> {}

export interface AddVideoDTO extends z.infer<typeof addVideoDTOSchema> {}

export interface VideoPreviewDTO extends z.infer<typeof videoPreviewDTOSchema> {}
export interface VideoPreviewMediaDTO extends z.infer<typeof videoPreviewMediaDTOSchema> {}

export interface InitiateVideoUploadInputDTO extends z.infer<typeof initiateVideoUploadInputSchema> {}
export interface InitiateVideoUploadOutputDTO extends z.infer<typeof initiateVideoUploadOutputSchema> {}
