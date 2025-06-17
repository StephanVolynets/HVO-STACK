import { z } from "zod";

// --
// Input schema for initializeCreatorFolders
export const initializeCreatorFoldersInputSchema = z.object({
  creatorId: z.string().min(1, "Creator id is required"),
});

//--
// // Input schema for initializeVideoUpload
// export const initializeVideoUploadInputSchema = z.object({
//   creatorId: z.string().min(1, "Creator Folder ID is required"),
// });

// // Output schema for initializeVideoUpload
// export const initializeVideoUploadOutputSchema = z.object({
//   //   sessionId: z.string().min(1, "Session ID is required"),
//   //   uploadUrls: z.object({
//   //     video: z.string().url("Invalid URL format"),
//   //     soundtrack: z.string().url("Invalid URL format"),
//   //   }),
//   folderId: z.string().min(1, "Folder ID is required"),
// });

// --
// Input schema for completeVideoUpload
export const completeVideoUploadInputSchema = z.object({
  creatorId: z.string().min(1, "Creator ID is required"),
  videoTitle: z.string().min(1, "Video title is required"),
  session_folder_id: z.string().min(1, "Folder ID is required"),
  video_file_id: z.string().min(1, "Video file ID is required"),
  soundtrack_file_id: z.string().min(1, "Soundtrack file ID is required"),
});

// --
// Upload file to storage
export const uploadFileOutputSchema = z.object({
  fileId: z.string().min(1, "File ID is required"),
  fileName: z.string().min(1, "File name is required"),
});

// --
// Resources

export const resourceItemSchema = z.object({
  fileId: z.string().min(1, "File ID is required"),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  downloadUrl: z.string().min(1, "Download URL is required"),
});
