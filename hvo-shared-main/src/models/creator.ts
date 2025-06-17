import { z } from "zod";
import { User } from "./user";
import { CreatorLanguage } from "./creator-language";
import {
  createCreatorDTOSchema,
  creatorBasicDTOSchema,
  creatorSchema,
  creatorStatsDTOSchema,
  creatorSummaryDTOSchema,
} from "../schemas";
import { Staff } from "./staff";
import { Video } from "./video";
import { YoutubeChannel } from "./youtube-channel";

export interface Creator extends z.infer<typeof creatorSchema> {
  user: User;
  languages: CreatorLanguage[];
  staffs: Staff[];
  videos: Video[];
  channels: YoutubeChannel[];
}

// DTOs
export interface CreateCreatorDTO extends z.infer<typeof createCreatorDTOSchema> {}

export interface CreatorSummaryDTO extends z.infer<typeof creatorSummaryDTOSchema> {}

export interface CreatorBasicDTO extends z.infer<typeof creatorBasicDTOSchema> {}

export interface CreatorStatsDTO extends z.infer<typeof creatorStatsDTOSchema> {}
