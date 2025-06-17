import { z } from "zod";
import {
  approveAudioDubDTOSchema,
  audioDubSchema,
  inboxAudioDubDTOSchema,
  libraryAudioDubDTOSchema,
  previewAudioDubDTOShema,
  taskAudioDubDTOSchema,
} from "../schemas";
import { Video } from "./video";
import { Language } from "./language";
import { Task } from "./task";

export interface AudioDub extends z.infer<typeof audioDubSchema> {
  video: Video;
  language: Language;
  tasks: Task[];
}

export interface InboxAudioDubDTO extends z.infer<typeof inboxAudioDubDTOSchema> {}

export interface LibraryAudioDubDTO extends z.infer<typeof libraryAudioDubDTOSchema> {}

export interface TaskAudioDubDTO extends z.infer<typeof taskAudioDubDTOSchema> {}

export interface PreviewAudioDubDTO extends z.infer<typeof previewAudioDubDTOShema> {}

export interface ApproveDubDto extends z.infer<typeof approveAudioDubDTOSchema> {}
