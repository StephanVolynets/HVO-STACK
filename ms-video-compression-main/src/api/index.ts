import axios from "axios";
import config from "../config";
import logger from "../utils/logger";

const api = axios.create({
  baseURL: config.api.url,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Notifies the backend that a video or audio resource has been uploaded
 */
export const notifyResourceUploaded = async (videoId: string, resourceType: "video" | "audio"): Promise<void> => {
  try {
    await api.post(`/videos/video-resource-uploaded/${videoId}`, {
      resourceType,
    });
  } catch (error) {
    logger.error("❌ Failed to notify backend about uploaded resource", {
      videoId,
      resourceType,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

export const notifyUploadedToSonix = async (videoId: string, mediaId: string): Promise<void> => {
  try {
    await api.post(`/transcription/uploaded-to-sonix/${videoId}`, {
      mediaId,
    });
  } catch (error) {
    logger.error("❌ Failed to notify backend about Sonix upload", {
      videoId,
      mediaId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

export const notifyCompressionCompleted = async (videoId: string): Promise<void> => {
  try {
    await api.post(`/videos/compression-completed/${videoId}`);
  } catch (error) {
    logger.error("❌ Failed to notify backend about compression completion", {
      videoId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
