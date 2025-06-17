import { z } from "zod";
import {
  completeVideoUploadInputSchema,
  initializeCreatorFoldersInputSchema,
  // initializeVideoUploadInputSchema,
  // initializeVideoUploadOutputSchema,
  resourceItemSchema,
  uploadFileOutputSchema,
} from "../schemas";

export interface InitializeCreatorFoldersInputDTO extends z.infer<typeof initializeCreatorFoldersInputSchema> {}

// export interface InitializeVideoUploadInputDTO extends z.infer<typeof initializeVideoUploadInputSchema> {}
// export interface InitializeVideoUploadOutputDTO extends z.infer<typeof initializeVideoUploadOutputSchema> {}

export interface CompleteVideoUploadInputDTO extends z.infer<typeof completeVideoUploadInputSchema> {}

export interface UploadFileOutputDTO extends z.infer<typeof uploadFileOutputSchema> {}

export interface ResourceItemDTO extends z.infer<typeof resourceItemSchema> {}
