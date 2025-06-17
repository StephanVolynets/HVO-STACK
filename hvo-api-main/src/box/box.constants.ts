// export const BOX_ROOT_FOLDER_IDS = {
//     HVO: 'your_hvo_folder_id',
//     HVO_APP: 'your_hvo_app_folder_id', // New platform folder in HVO_APP
// };

// Workflow stage-specific folder IDs
// export const BOX_FOLDER_IDS = {
//     BACKLOG: 'your_backlog_folder_id',
//     ONGOING: 'your_ongoing_folder_id',
//     COMPLETED: 'your_completed_folder_id',
// };

export const PHASE_FOLDERS_NAMES = {
  BACKLOG: "Backlog",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
};

export const VIDEO_SUBFOLDERS = {
  INTERNAL_FILES: "Internal Files",
  M_AND_E: "M&E",
  MP4: "MP4",
  RAW_AUDIO: "Raw Audio",
  RAW_TRANSCRIPT: "Raw Transcript",
  ENGLISH_TRANSCRIPT: "English Transcript",
  SOURCE_FILES: "Source Files",
  ORIGINAL_TRANSCRIPT: "Original Transcript",
  RAW_SCRIPT: "Raw Script",
  FINAL_SCRIPT: "Final Script",
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
