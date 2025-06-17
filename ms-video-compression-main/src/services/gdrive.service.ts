import axios from "axios";
import https from "https";
import fs from "fs";
import stream from "stream";
import { promisify } from "util";
import { Storage } from "@google-cloud/storage";
import config from "../config";
import logger from "../utils/logger";

// Initialize Google Cloud Storage client
const storage = new Storage();
const pipeline = promisify(stream.pipeline);

export const gdriveToGcsService = {
  // Calculate human-readable file size
  calcSize(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
    );
  },

  // Get link from Google Drive
  async getLink(url) {
    return new Promise((resolve, reject) => {
      try {
        const id = url.match(/(file\/d\/|open\?id=)(.*?)(\/view|$)/)[2];
        const urlx = `https://drive.google.com/uc?id=${id}&authuser=0&export=download`;

        logger.info("Fetching download link", { id, urlx });

        const gd = https.get(urlx);

        gd.on("response", (res) => {
          logger.info("Got initial response");
          res.setEncoding("utf8");
          let body = "";

          res.on("data", (data) => {
            body += data;
          });

          res.on("end", () => {
            axios
              .post(
                urlx,
                {},
                {
                  headers: {
                    "accept-encoding": "gzip, deflate, br",
                    "content-length": 0,
                    "Content-Type":
                      "application/x-www-form-urlencoded;charset=UTF-8",
                    origin: "https://drive.google.com",
                    "user-agent":
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
                    "x-client-data":
                      "CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=",
                    "x-drive-first-party": "DriveWebUi",
                    "x-json-requested": "true",
                  },
                }
              )
              .then((data) => {
                const result = data.data;
                const _json = result.slice(4);
                const dlurl = JSON.parse(_json);

                logger.info("Download URL parsed");

                if (dlurl.downloadUrl === undefined) {
                  logger.error("Link download limit exceeded");
                  return reject(
                    new Error("Download limit exceeded for this file")
                  );
                }

                logger.info("Got download URL", { url: dlurl.downloadUrl });
                resolve(dlurl);
              })
              .catch((error) => {
                logger.error("File not found or other error", { error });
                reject(new Error("File not found or access denied"));
              });
          });
        });

        gd.on("error", (error) => {
          logger.error("Error connecting to Google Drive", { error });
          reject(error);
        });
      } catch (error) {
        logger.error("Error in getLink", { error, url });
        reject(error);
      }
    });
  },

  // Stream file directly from Google Drive to GCS
  async streamToGcs(dlurl, destinationFolder, fileName) {
    return new Promise((resolve, reject) => {
      try {
        logger.info("Initiating streaming transfer");

        // Create headers for Google Drive request
        const headers = {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        };

        // Make a HEAD request first to get content info
        axios
          .head(dlurl.downloadUrl, { headers })
          .then((headRes) => {
            // Get filename from headers if available
            let filename;
            if (headRes.headers["content-disposition"]) {
              const match = headRes.headers["content-disposition"].match(
                /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/
              );
              if (match) {
                filename = decodeURIComponent(match[1]);
              }
            }

            // If no filename in header, generate one from the provided fileName
            if (!filename) {
              filename = fileName || `file_${Date.now()}`;
            }

            // Extract file extension
            let extension = "";
            if (filename.includes(".")) {
              extension = filename.split(".").pop();
            }

            // Create destination path
            const destFileName =
              extension && !fileName.endsWith(`.${extension}`)
                ? `${fileName}.${extension}`
                : fileName;

            const destinationPath = `${destinationFolder}/${destFileName}`;
            const size =
              parseInt(dlurl.sizeBytes, 10) ||
              parseInt(headRes.headers["content-length"] || "0", 10);

            logger.info("Starting streaming transfer", {
              filename,
              size: this.calcSize(size),
              destinationPath,
            });

            // Create a pass-through stream that will track progress
            const progressStream = new stream.Transform({
              transform(chunk, encoding, callback) {
                let bytesProcessed = 0;
                bytesProcessed += chunk.length;

                // Log progress every 5% or 10MB
                if (
                  size &&
                  bytesProcessed %
                    Math.max(Math.floor(size * 0.05), 10 * 1024 * 1024) <
                    chunk.length
                ) {
                  const percentage = Math.round((bytesProcessed / size) * 100);
                  logger.info(`Transfer progress: ${percentage}%`, {
                    current: gdriveToGcsService.calcSize(bytesProcessed),
                    total: gdriveToGcsService.calcSize(size),
                  });
                }

                callback(null, chunk);
              },
            });

            // Create a write stream to GCS
            const bucket = storage.bucket(config.bucketName);
            const file = bucket.file(destinationPath);
            const writeStream = file.createWriteStream({
              resumable: true,
              metadata: {
                contentType:
                  headRes.headers["content-type"] || "application/octet-stream",
                cacheControl: "public, max-age=31536000",
                metadata: {
                  originalFilename: filename,
                  source: "google-drive",
                },
              },
            });

            // Handle write stream errors
            writeStream.on("error", (error) => {
              logger.error("Error in GCS write stream", { error });
              reject(error);
            });

            // Handle write stream completion
            writeStream.on("finish", () => {
              logger.info("Streaming transfer completed", { destinationPath });
              resolve(destinationPath);
            });

            // Start the streaming request to Google Drive
            axios({
              method: "get",
              url: dlurl.downloadUrl,
              responseType: "stream",
              headers,
            })
              .then((response) => {
                // Start the pipeline
                response.data
                  .pipe(progressStream)
                  .pipe(writeStream)
                  .on("error", (error) => {
                    logger.error("Pipeline error", { error });
                    reject(error);
                  });
              })
              .catch((error) => {
                logger.error("Error creating download stream", { error });
                reject(error);
              });
          })
          .catch((error) => {
            logger.error("Error making HEAD request", { error });
            reject(error);
          });
      } catch (error) {
        logger.error("Error in streamToGcs", { error });
        reject(error);
      }
    });
  },

  // Main transfer method - the one you'll call
  async transferResource(filePublicUrl, destinationFolderPath, fileName) {
    const startTime = Date.now();

    try {
      logger.info("Starting Drive to GCS streaming transfer", {
        filePublicUrl,
        destinationFolderPath,
        fileName,
      });

      // Step 1: Get download link
      const downloadInfo = await this.getLink(filePublicUrl);

      // Step 2: Stream directly to GCS
      const gcsPath = await this.streamToGcs(
        downloadInfo,
        destinationFolderPath,
        fileName
      );

      // Log stats
      const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
      const fileSizeMB = (
        parseInt(downloadInfo.sizeBytes, 10) /
        (1024 * 1024)
      ).toFixed(2);

      logger.info("✅ File streaming transfer completed", {
        fileName,
        filePublicUrl,
        destinationPath: gcsPath,
        fileSizeMB,
        durationSec,
      });

      return gcsPath;
    } catch (error) {
      logger.error("❌ Failed to stream file from Drive to GCS", {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        fileName,
        filePublicUrl,
        destinationFolderPath,
      });
      throw error;
    }
  },
};
