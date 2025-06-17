import { z } from "zod";
import { Creator } from "./creator";
import { Video } from "./video";
import { youtubeChannelBasicDTOSchema, youtubeChannelSchema } from "../schemas";

export interface YoutubeChannel extends z.infer<typeof youtubeChannelSchema> {
  creator: Creator;
  videos: Video[];
}

export interface YoutubeChannelBasicDTO extends z.infer<typeof youtubeChannelBasicDTOSchema> {}
