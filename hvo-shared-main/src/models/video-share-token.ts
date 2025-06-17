import { z } from "zod";

import { createVideoShareTokenSchema, shareVideoDTOSchema, videoShareTokenSchema } from "../schemas";
import { Video } from "./video";

export interface VideoShareToken extends z.infer<typeof videoShareTokenSchema> {
  video: Video;
}

export interface VideoShareTokenDTO extends z.infer<typeof createVideoShareTokenSchema> {
  video: Video;
}
export type ShareVideoDTO = z.infer<typeof shareVideoDTOSchema>;
