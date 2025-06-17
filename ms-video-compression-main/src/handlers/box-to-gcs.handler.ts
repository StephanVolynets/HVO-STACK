import { Request, Response } from "express";
import axios from "axios";
import { storage } from "../services/storage.service";
import config from "../config";
import logger from "../utils/logger";

interface BoxToGCSRequest {
  boxDownloadUrl: string;
  gcsDestinationPath: string;
  fileName: string;
  contentType?: string;
  bucketName?: string;
}

/**
 * Handles incoming Pub/Sub messages for Box to GCS transfers
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
    const data = JSON.parse(Buffer.from(message.data, "base64").toString()) as BoxToGCSRequest;

    logger.info("Received Box to GCS transfer request", {
      gcsDestinationPath: data.gcsDestinationPath,
      boxDownloadUrl: data.boxDownloadUrl,
      fileName: data.fileName,
    });

    // Validate required fields
    if (!data.boxDownloadUrl || !data.gcsDestinationPath) {
      logger.error("Invalid message data: missing required fields");
      res.status(400).send("Bad Request: Missing required fields");
      return;
    }

    // Process the Box to GCS transfer
    await transferBoxToGCS(data);

    // Acknowledge the message
    res.status(204).send();
  } catch (error) {
    logger.error("Error processing Box to GCS transfer", { error });

    // Return a server error but with a 200 status code
    // This prevents Pub/Sub from retrying the message if it's an unrecoverable error
    res.status(200).send();
  }
};

/**
 * Transfers a file from Box to GCS using the provided download URL
 */
const transferBoxToGCS = async (data: BoxToGCSRequest): Promise<void> => {
  try {
    const { boxDownloadUrl, gcsDestinationPath, contentType } = data;
    const bucketName = config.bucketName;

    logger.info("Starting server-to-server transfer from Box to GCS", {
      gcsDestinationPath,
      //   fileName,
      bucketName,
    });

    // Prepare GCS destination
    const bucket = storage.bucket(bucketName);
    // const finalPath = gcsDestinationPath.endsWith('/')
    //   ? `${gcsDestinationPath}${fileName}`
    //   : gcsDestinationPath;

    const file = bucket.file(gcsDestinationPath);

    // Create a write stream to GCS
    const writeStream = file.createWriteStream({
      resumable: true,
      contentType: contentType || "application/octet-stream",
    });

    // Get the file from Box and pipe it directly to GCS
    const response = await axios({
      method: "get",
      url: boxDownloadUrl,
      responseType: "stream",
    });

    // Transfer the file using streams
    await new Promise<void>((resolve, reject) => {
      response.data
        .pipe(writeStream)
        .on("error", (err: Error) => {
          logger.error("Error during file transfer stream", { err });
          reject(err);
        })
        .on("finish", () => {
          logger.info("File transfer stream completed successfully");
          resolve();
        });
    });

    logger.info("Successfully transferred file from Box to GCS", {
      gcsDestinationPath,
      contentType,
    });
  } catch (error) {
    logger.error("Failed to transfer file from Box to GCS", { error });
    throw error;
  }
};
