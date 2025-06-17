import axios from "axios";
import { storage } from "./storage.service";
import * as storageService from "./storage.service";
import config from "../config";
import logger from "../utils/logger";

// Create Sonix API client
const sonixClient = axios.create({
  baseURL: config.sonix.apiUrl,
  headers: {
    Authorization: `Bearer ${config.sonix.apiKey}`,
    "Content-Type": "application/json",
  },
});

/**
 * Uploads a video from GCS to Sonix for transcription using signed URL method
 */
export const uploadVideoForTranscription = async (
  gcsFilePath: string,
  fileName: string,
  language: string = "en"
): Promise<string> => {
  try {
    logger.info("Uploading video to Sonix for transcription", {
      gcsFilePath,
    });

    // Generate a signed URL with 1-hour expiration
    const signedUrl = await storageService.getSignedUrl(
      gcsFilePath,
      60 * 60 * 1000, // 1 hour
      config.bucketName
    );

    logger.info("Created signed URL for Sonix upload");

    // Submit to Sonix using the file_url parameter
    const response = await sonixClient.post(`${config.sonix.apiUrl}/media`, {
      file_url: signedUrl,
      language,
      name: fileName,
    });

    const mediaId = response.data.id;
    logger.info("Successfully uploaded video to Sonix", { mediaId });

    return mediaId;
  } catch (error) {
    logger.error("Error uploading video to Sonix", { error, gcsFilePath });
    throw error;
  }
};

/**
 * Gets the status of a transcription job
 */
export const getTranscriptionStatus = async (mediaId: string): Promise<any> => {
  try {
    const response = await sonixClient.get(`/v1/media/${mediaId}`);
    return response.data;
  } catch (error) {
    logger.error("Error getting transcription status", { mediaId, error });
    throw error;
  }
};
