import axios from "axios";
import https from "https";
import fs from "fs";
import path from "path";
import { Storage } from "@google-cloud/storage";
import config from "../config";
import logger from "../utils/logger";

// Initialize Google Cloud Storage client
const storage = new Storage();

export const gdriveToGcsService = {
  // Calculate human-readable file size
  calcSize(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
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
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    origin: "https://drive.google.com",
                    "user-agent":
                      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
                    "x-client-data": "CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=",
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
                  return reject(new Error("Download limit exceeded for this file"));
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

  // Download file and upload to GCS
  async downloadAndUpload(dlurl, destinationFolder, fileName) {
    return new Promise((resolve, reject) => {
      try {
        const req = https.get(dlurl.downloadUrl);

        logger.info("Waiting for server response...");

        req.on("response", async (res) => {
          logger.info("Server response OK");

          const size = parseInt(dlurl.sizeBytes, 10);
          let currentSize = 0;

          // Get filename from headers if available
          let filename;
          if (res.headers["content-disposition"]) {
            const match = res.headers["content-disposition"].match(
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
          const destFileName = extension && !fileName.endsWith(`.${extension}`) ? `${fileName}.${extension}` : fileName;

          const destinationPath = `${destinationFolder}/${destFileName}`;
          const tempPath = `/tmp/${destFileName}`;

          logger.info("Downloading file", {
            filename,
            size: this.calcSize(size),
            tempPath,
          });

          // Create temporary file
          const file = fs.createWriteStream(tempPath);
          res.pipe(file);

          res.on("data", (chunk) => {
            currentSize += chunk.length;

            // Log progress every 5% or 10MB
            if (currentSize % Math.max(Math.floor(size * 0.05), 10 * 1024 * 1024) < chunk.length) {
              const percentage = Math.round((currentSize / size) * 100);
              logger.info(`Download progress: ${percentage}%`, {
                current: this.calcSize(currentSize),
                total: this.calcSize(size),
              });
            }
          });

          res.on("end", async () => {
            file.close();
            logger.info("Download completed", { tempPath });

            try {
              // Upload to GCS
                logger.info("Uploading to GCS", { destinationPath });
                await storage.bucket(config.bucketName).upload(tempPath, {
                  destination: destinationPath,
                  resumable: true,
                  metadata: {
                    cacheControl: "public, max-age=31536000",
                  },
                });

                // Clean up temp file
                fs.unlink(tempPath, (err) => {
                  if (err) {
                    logger.warn("Failed to delete temp file", { tempPath, err });
                  }
                });

              //   logger.info("Upload to GCS completed", { destinationPath });
              resolve(destinationPath);
            } catch (uploadError) {
              logger.error("Failed to upload to GCS", { uploadError });
              // Clean up temp file on error
              fs.unlink(tempPath, () => {});
              reject(uploadError);
            }
          });

          res.on("error", (error) => {
            file.close();
            fs.unlink(tempPath, () => {});
            logger.error("Error during download", { error });
            reject(error);
          });
        });

        req.on("error", (error) => {
          logger.error("Error initiating download", { error });
          reject(error);
        });
      } catch (error) {
        logger.error("Error in downloadAndUpload", { error });
        reject(error);
      }
    });
  },

  // Main transfer method - the one you'll call
  async transferResource(filePublicUrl, destinationFolderPath, fileName) {
    const startTime = Date.now();

    try {
      logger.info("Starting Drive to GCS transfer", {
        filePublicUrl,
        destinationFolderPath,
        fileName,
      });

      // Step 1: Get download link
      const downloadInfo = await this.getLink(filePublicUrl);

      // Step 2: Download and upload
      const gcsPath = await this.downloadAndUpload(downloadInfo, destinationFolderPath, fileName);

      // Log stats
      const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
      const fileSizeMB = (parseInt(downloadInfo.sizeBytes, 10) / (1024 * 1024)).toFixed(2);

      logger.info("✅ File transfer completed", {
        fileName,
        filePublicUrl,
        destinationPath: gcsPath,
        fileSizeMB,
        durationSec,
      });

      return gcsPath;
    } catch (error) {
      logger.error("❌ Failed to transfer file from Drive to GCS", {
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
