import { Request, Response } from "express";
import * as sonixService from "../services/sonix.service";
import * as storageService from "../services/storage.service";
import { TranscoderNotification } from "../types/transcoder.types";
import config from "../config";
import logger from "../utils/logger";
import axios from "axios";
import { uploadFilesToBox } from "../services/box.service";
import * as transcoderService from "../services/transcoder.service";
import { notifyCompressionCompleted, notifyUploadedToSonix } from "../api";

/**
 * Handles incoming Pub/Sub messages for transcoding completions
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
    const decodedMessage = Buffer.from(message.data, "base64").toString();
    logger.info("Decoded message", { decodedMessage });
    const data = JSON.parse(decodedMessage);

    logger.info("Received transcoding completion notification", { data });

    // Validate that this is a successful job completion notification
    if (!data.job || data.job.state !== "SUCCEEDED") {
      logger.error("Job was not successful", { state: data.job?.state });
      res.status(200).send("Not processing non-successful job");
      return;
    }

    // Process the transcoding completion
    await processTranscodingCompletion(data);

    // Acknowledge the message
    res.status(204).send();
  } catch (error) {
    logger.error("Error processing transcoding completion", {
      error: {
        message: error.message,
        stack: error.stack,
      },
    });

    // Return a server error but with a 200 status code
    // This prevents Pub/Sub from retrying the message if it's an unrecoverable error
    res.status(200).send();
  }
};

/**
 * Processes a transcoding completion notification
 */
const processTranscodingCompletion = async (data: any): Promise<void> => {
  try {
    const { job } = data;

    // Extract job ID from the job name
    // Format: "projects/{project}/locations/{location}/jobs/{job_id}"
    const jobId = job.name.split("/").pop() || "";
    const jobObj = await transcoderService.getTranscodingJob(jobId);
    const videoId = jobObj.labels?.videoid;

    if (!videoId) {
      logger.error("Missing videoId in transcoder job labels", { jobId });
      throw new Error("Missing videoId in transcoder job labels");
    }

    logger.info("Fetching metadata for completed transcoding job", {
      jobId,
      videoId,
    });

    // Call the API endpoint to get the full metadata
    const apiUrl = `${config.api.url}/videos/metadata-for-transcoder-completion/${videoId}`;

    logger.info("Calling API endpoint", { apiUrl });

    const response = await axios.get(apiUrl);

    const { videoTitle, sourceFilesFolderId, videoFolderPath, mp4FolderId, mAndEFolderId } = response.data;

    if (!videoId || !videoTitle || !sourceFilesFolderId || !videoFolderPath) {
      const error = "Missing required metadata in job labels";
      logger.error(error, {
        jobId,
        hasVideoId: !!videoId,
        hasVideoTitle: !!videoTitle,
        hasSourceFilesFolderId: !!sourceFilesFolderId,
        hasVideoFolderPath: !!videoFolderPath,
        labels: job.labels,
      });
      throw new Error(error);
    }

    // Parse output location and determine the exact file path
    // const outputUri = job.outputUri;
    const inputUri = job.inputUri;

    // Extract video folder path from the output URI
    // Format: gs://bucket-name/video-folder-path/compressed/
    // const videoFolderPath = outputUri.replace(`gs://${config.bucketName}/`, "").replace("/compressed/", "");

    // // Construct the transcoded video path - assuming it's outputUri + hd.mp4
    // const transcodedFilePath = `${outputUri.replace("gs://", "")}hd.mp4`;

    logger.info("Processing transcoded video", {
      jobId,
      videoId: +videoId,
      videoTitle,
      videoFolderPath,
    });

    // Step 1: Upload to Sonix for transcription
    try {
      const filePath = `${videoFolderPath}/compressed/hd.mp4`;
      const sonixMediaId = await sonixService.uploadVideoForTranscription(filePath, videoTitle);

      logger.info("Successfully uploaded to Sonix");

      // Notify backend that video has been uploaded to Sonix
      await notifyUploadedToSonix(videoId, sonixMediaId);

      logger.info("Successfully notified backend that video has been uploaded to Sonix");
    } catch (error) {
      logger.error("Error uploading to Sonix", { error });
      // Continue processing even if Sonix upload fails
    }

    // Step 2: Upload to Box
    try {
      await uploadFilesToBox(sourceFilesFolderId, videoFolderPath, videoTitle, mp4FolderId, mAndEFolderId);

      // Notify backend that compression has been completed
      await notifyCompressionCompleted(videoId);
      logger.info("Successfully uploaded files to Box");
    } catch (error) {
      logger.error("Error uploading to Box", { error });
      // Continue processing even if Box upload fails
    }

    // Step 3: Delete original raw video
    try {
      const rawFilePath = `${videoFolderPath}/raw`;
      logger.info("Deleting original raw video", { rawFilePath });

      await storageService.deleteFile(`${rawFilePath}/${videoTitle}.mp4`);
      //   await storageService.deleteFile(rawFilePath);
      logger.info("Successfully deleted raw video");
    } catch (error) {
      logger.error("Error deleting raw video", { error });
      // Continue even if deletion fails
    }

    logger.info("Successfully processed transcoding completion", { jobId });
  } catch (error) {
    logger.error("Failed to process transcoding completion", { error });
    throw error;
  }
};
