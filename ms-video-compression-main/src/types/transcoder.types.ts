/**
 * Types for Google Transcoder API responses and notifications
 */

export interface TranscoderJob {
  name: string; // Format: "projects/{project}/locations/{location}/jobs/{job_id}"
  inputUri: string; // GCS URI of the input file
  outputUri: string; // GCS URI of the output directory
  state: TranscoderJobState;
  createTime: string;
  startTime: string;
  endTime: string;
  ttlAfterCompletionDays: number;
  labels?: Record<string, string>;
  error?: TranscoderError;
}

export interface TranscoderError {
  code: number;
  message: string;
  details?: any[];
}

export type TranscoderJobState = "STATE_UNSPECIFIED" | "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED";

export interface TranscoderNotification {
  job: TranscoderJob;
  // Additional fields that might be present in the notification
  jobId?: string;
  projectId?: string;
  location?: string;
}

export interface TranscodingCompletionMessage {
  jobId: string;
  boxFolderId?: string;
  uploadToSonix?: boolean;
  language?: string;
  videoTitle?: string;
  deleteOriginal?: boolean;
  metadata?: {
    videoId?: number;
    rawScriptFolderId?: string;
    customData?: Record<string, string>;
  };
}
