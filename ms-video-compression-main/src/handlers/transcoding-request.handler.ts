import { Request, Response } from "express";
import * as transcoderService from "../services/transcoder.service";
import logger from "../utils/logger";

interface TranscodingRequest {
  videoFolderPath: string;
  videoTitle: string;
  videoId: string;
  sourceFilesFolderId: string;
}

/**
 * Handles incoming Pub/Sub messages for video transcoding requests
 */
export const handleMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract and validate the Pub/Sub message
    if (!req.body.message) {
      logger.error("Invalid Pub/Sub message: missing message property");
      res.status(400).send("Bad Request: Invalid Pub/Sub message format");
      return;
    }

    // Decode the message data from base64
    const message = req.body.message;
    const data = JSON.parse(Buffer.from(message.data, "base64").toString());

    logger.info("Received transcoding request", { data });

    // Validate required fields
    if (!data.videoFolderPath || !data.videoTitle || !data.videoId || !data.sourceFilesFolderId) {
      logger.error("Invalid message data: missing required fields", { data });
      res.status(400).send("Bad Request: Missing required fields");
      return;
    }

    // Process the transcoding request
    await processTranscodingRequest(data);

    // Acknowledge the message
    res.status(204).send();
  } catch (error) {
    logger.error("Error processing transcoding request", { error });

    // Return a server error but with a 200 status code
    // This prevents Pub/Sub from retrying the message if it's an unrecoverable error
    res.status(200).send();
  }
};

/**
 * Processes a transcoding request
 */
const processTranscodingRequest = async (data: TranscodingRequest): Promise<void> => {
  try {
    // Create a transcoding job in Google Transcoder API
    const jobId = await transcoderService.createTranscodingJob(
      data.videoFolderPath,
      data.videoTitle,
      data.videoId,
      data.sourceFilesFolderId
    );

    logger.info("Successfully created transcoding job", {
      jobId,
      videoTitle: data.videoTitle,
    });
  } catch (error) {
    logger.error("Failed to create transcoding job", { error });
    throw error;
  }
};
