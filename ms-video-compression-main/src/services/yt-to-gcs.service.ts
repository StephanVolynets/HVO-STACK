import { Storage } from "@google-cloud/storage";
import ytdl from "@distube/ytdl-core";
import * as fs from "fs";
import * as path from "path";
import config from "../config";
import logger from "../utils/logger";
import { Innertube } from "youtubei.js";

// Initialize storage once
const storage = new Storage();

export async function downloadAndUpload(filePublicUrl: string, destinationFolderPath: string, fileName: string): Promise<string> {
  try {
    const bucketName = config.bucketName;
    const destinationPath = `${destinationFolderPath}/${fileName}.mp4`;

    // Get video stream from ytdl
    const videoStream = ytdl(filePublicUrl, {
      quality: "highest",
      filter: "videoandaudio",
    });

    // Create write stream to GCS
    const bucket = storage.bucket(bucketName);
    const destFile = bucket.file(destinationPath);
    const destStream = destFile.createWriteStream({ resumable: true });

    // Stream directly to GCS
    await new Promise<void>((resolve, reject) => {
      videoStream.on("error", reject).pipe(destStream).on("finish", resolve).on("error", reject);
    });

    return `gs://${bucketName}/${destinationPath}`;
  } catch (error) {
    console.error("Error in downloadAndUpload:", error);
    throw error;
  }
}

export async function downloadAndUploadWithYoutubei(filePublicUrl: string, destinationFolderPath: string, fileName: string): Promise<string> {
  try {
    logger.info(filePublicUrl, "URL");
    const bucketName = config.bucketName;
    const destinationPath = `${destinationFolderPath}/${fileName}.mp4`;

    // Make POST request to Cobalt service
    const cobaltResponse = await fetch("http://34.132.209.227:9000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        url: filePublicUrl,
      }),
    });

    // Add error logging
    if (!cobaltResponse.ok) {
      const errorText = await cobaltResponse.text();
      logger.error(`Cobalt service error: Status ${cobaltResponse.status}, Response: ${errorText}`);
      throw new Error(`Cobalt service failed with status ${cobaltResponse.status}`);
    }

    const cobaltData = await cobaltResponse.json();
    logger.info("Cobalt response:", cobaltData);
    if (!cobaltData.url) {
      throw new Error("Failed to get video URL from Cobalt service");
    }

    // Create write stream to GCS
    const bucket = storage.bucket(bucketName);
    const destFile = bucket.file(destinationPath);
    const destStream = destFile.createWriteStream({ resumable: true });

    // Stream from Cobalt URL to GCS
    const videoResponse = await fetch(cobaltData.url);
    if (!videoResponse.body) {
      throw new Error("No response body from video URL");
    }

    // Stream directly to GCS
    await new Promise<void>((resolve, reject) => {
      if (!videoResponse.body) {
        reject(new Error("No response body"));
        return;
      }

      const reader = videoResponse.body.getReader();
      const pump = async () => {
        try {
          const { done, value } = await reader.read();
          if (done) {
            destStream.end();
            resolve();
            return;
          }
          destStream.write(value);
          pump();
        } catch (err) {
          reject(err);
        }
      };
      pump();
    });

    return `gs://${bucketName}/${destinationPath}`;
  } catch (error) {
    console.error("Error in downloadAndUploadWithYoutubei:", error);
    throw error;
  }
}
