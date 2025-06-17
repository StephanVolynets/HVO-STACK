export const CREATOR_FOLDERS = {
  BACKLOG: "Backlog",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  STAGING: "Staging",
};

export const VIDEO_SUBFOLDERS = {
  INTERNAL_FILES: "Internal Files",
  // Internal Files:
  M_AND_E: "M&E",
  MP4: "MP4",
  RAW_TRANSCRIPT: "Raw Transcript",
  RAW_AUDIO: "Raw Audio",
  // Deliverables:
  ENGLISH_TRANSCRIPT: "English Script",
  FINAL_SCRIPT: "Final Script",
  MIXED_AUDIO: "Mixed Audio",
  // Obsolete:
  SOURCE_FILES: "Source Files",
  ORIGINAL_TRANSCRIPT: "Original Transcript",
  RAW_SCRIPT: "Raw Script",
  SCRIPT: "Script",
  STUDIO: "Studio",
  DELIVERABLES: "Deliverables",
};

// Enumeration for the folder stages, ensuring consistency
export enum FolderStage {
  BACKLOG = "backlog",
  ONGOING = "ongoing",
  COMPLETED = "completed",
}

// Other relevant constants can be added here as needed, such as:
export const BOX_UPLOAD_SETTINGS = {
  MAX_FILE_SIZE_MB: 100, // Example setting: max upload size in MB
  ALLOWED_FILE_TYPES: ["wav", "srt", "docx", "mp4"], // Allowed file types for upload
};
