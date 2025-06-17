import { z } from "zod";

import { videoProcessingIssueSchema, videoProcessingIssueDTOSchema } from "../schemas";
import { Video } from "./video";

export interface VideoProcessingIssue extends z.infer<typeof videoProcessingIssueSchema> {
  video: Video;
}

export interface VideoProcessingIssueDTO extends z.infer<typeof videoProcessingIssueDTOSchema> {
  video: Video;
}
