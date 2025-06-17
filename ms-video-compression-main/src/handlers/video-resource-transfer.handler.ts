import { Request, Response } from "express";
// import * as gdriveToGcsService from "../services/gdrive-to-gcs.service";
import * as gdriveToGcsService from "../services/gdrive.service";
import logger from "../utils/logger";
import { notifyResourceUploaded } from "../api";
import { downloadAndUpload, downloadAndUploadWithYoutubei } from "../services/yt-to-gcs.service";

interface UploadResourceRequest {
  videoId: string;
  videoTitle: string;
  externalUrl: string;
  destinationFolderPath: string;
  resourceType: "video" | "audio";
}

/**
 * Handles incoming Pub/Sub messages for uploading external resources (video/audio)
 * to GCS from sources like Google Drive or YouTube
 */
export const handleMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract and validate the Pub/Sub message
    if (!req.body.message) {
      logger.error("[VideoResourceTransferHandler] Invalid Pub/Sub message: missing message property");
      res.status(400).send("Bad Request: Invalid Pub/Sub message format");
      return;
    }

    // Decode the message data from base64
    const message = req.body.message;
    const data = JSON.parse(Buffer.from(message.data, "base64").toString());

    logger.info("Received external resource upload request", { data });

    // Validate required fields
    if (!data.videoId || !data.videoTitle || !data.externalUrl || !data.destinationFolderPath || !data.resourceType) {
      logger.error("Invalid message data: missing required fields", { data });
      res.status(400).send("Bad Request: Missing required fields");
      return;
    }

    // // Process the upload request
    // await processResourceUpload(data);
    // Acknowledge the message immediately
    res.status(204).send();

    // Continue processing in the background
    processResourceUpload(data)
      .then(() => {
        logger.info("Completed processing resource upload", {
          videoId: data.videoId,
          resourceType: data.resourceType,
        });
      })
      .catch((error) => {
        logger.error("Error in background processing of resource upload", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          videoId: data.videoId,
          resourceType: data.resourceType,
        });
      });

    // Acknowledge the message
    // res.status(204).send();
  } catch (error) {
    logger.error("Error processing external resource upload request", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Return a server error but with a 200 status code
    // This prevents Pub/Sub from retrying the message if it's an unrecoverable error
    res.status(200).send();
  }
};

/**
 * Processes an external resource upload request
 */
const processResourceUpload = async (data: UploadResourceRequest): Promise<void> => {
  try {
    const { videoId, videoTitle, externalUrl, destinationFolderPath, resourceType } = data;

    // Determine the source type (Google Drive or YouTube)
    if (isGoogleDriveUrl(externalUrl)) {
      logger.info("Processing Google Drive resource", { videoId, resourceType, url: externalUrl });

      // await gdriveToGcsService.transferResource(externalUrl, destinationFolderPath, videoTitle);
      const fileName = resourceType === "video" ? videoTitle : `${videoTitle}-m&e`;
      await gdriveToGcsService.gdriveToGcsService.transferResource(externalUrl, destinationFolderPath, fileName);

      await notifyResourceUploaded(videoId, resourceType);
    } else if (isYouTubeUrl(externalUrl)) {
      console.log(externalUrl, "URL");
      logger.info("YouTube URL detected, download not implemented yet", {
        videoId,
        resourceType,
        url: externalUrl,
      });
      await downloadAndUploadWithYoutubei(externalUrl, destinationFolderPath, videoTitle);
      await notifyResourceUploaded(videoId, resourceType);
      // Implementation
    } else {
      logger.warn("Unsupported external URL format", { url: externalUrl });
      throw new Error(`Unsupported URL format: ${externalUrl}`);
    }
  } catch (error) {
    logger.error("Failed to process resource upload", { error: error.message, data });
    throw error;
  }
};

/**
 * Checks if a URL is from Google Drive
 */
const isGoogleDriveUrl = (url: string): boolean => {
  return url.includes("drive.google.com") || url.includes("docs.google.com");
};

/**
 * Checks if a URL is from YouTube
 */
const isYouTubeUrl = (url: string): boolean => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};
