// import { protos, StorageTransferServiceClient } from "@google-cloud/storage-transfer";
// import { Storage } from "@google-cloud/storage";
// import { google } from "googleapis";
// import { v4 as uuidv4 } from "uuid";
// import config from "../config";
// import logger from "../utils/logger";

// // Create singleton instances
// const transferClient = new StorageTransferServiceClient();
// const storageClient = new Storage();

// // Set up auth for Google Drive API
// const auth = new google.auth.GoogleAuth({
//   scopes: ["https://www.googleapis.com/auth/drive.readonly"],
// });
// // const driveClient = google.drive({ version: "v3", auth });

// /**
//  * Extract file ID from a Google Drive URL
//  */
// export const extractFileIdFromUrl = (url: string): string | null => {
//   // Extract file ID from various Google Drive URL formats
//   const patterns = [
//     /\/file\/d\/([^/]+)/, // https://drive.google.com/file/d/{fileId}/view
//     /id=([^&]+)/, // https://drive.google.com/open?id={fileId}
//     /https:\/\/drive\.google\.com\/[^\/]*\/([a-zA-Z0-9_-]{25,})/, // Various URL formats
//   ];

//   for (const pattern of patterns) {
//     const match = url.match(pattern);
//     if (match && match[1]) {
//       return match[1];
//     }
//   }
//   return null;
// };

// // export const transferResource = async (
// //   filePublicUrl: string,
// //   destinationFolderPath: string,
// //   fileType: "video" | "audio",
// //   videoId: string,
// //   fileName: string
// // ): Promise<string> => {
// //   try {
// //     const startTime = Date.now();

// //     const fileIdMatch = filePublicUrl.match(/\/file\/d\/(.*?)(\/view|\?|$)/);
// //     if (!fileIdMatch || !fileIdMatch[1]) {
// //       throw new Error("Invalid Google Drive shareable link format.");
// //     }

// //     const fileId = fileIdMatch[1];
// //     const bucketName = config.bucketName;
// //     const destFileName = `${videoId}.${fileType === "video" ? "mp4" : "mp3"}`;
// //     const destinationPath = `${destinationFolderPath}/${destFileName}`;

// //     const drive = google.drive({ version: "v3", auth });
// //     const destStream = storageClient.bucket(bucketName).file(destinationPath).createWriteStream({ resumable: true });
// //     const res = await drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });

// //     await new Promise<void>((resolve, reject) => {
// //       res.data.on("end", resolve).on("error", reject).pipe(destStream);
// //     });

// //     const duration = Date.now() - startTime;
// //     logger.info("Transfer completed", {
// //       fileId,
// //       destinationPath,
// //       durationMs: duration,
// //     });

// //     return destinationPath;
// //   } catch (error) {
// //     logger.error("Failed to transfer file from Drive to GCS:", {
// //       error,
// //       filePublicUrl,
// //       destinationFolderPath,
// //     });
// //     throw error;
// //   }
// // };
// export const transferResource = async (
//   filePublicUrl: string,
//   destinationFolderPath: string,
//   fileType: "video" | "audio",
//   videoId: string,
//   fileName: string
// ): Promise<string> => {
//   try {
//     const startTime = Date.now();

//     // Extract file ID from public URL
//     const fileId = extractFileIdFromUrl(filePublicUrl);

//     const bucketName = config.bucketName;

//     // Get original file name from Drive API
//     const drive = google.drive({ version: "v3", auth });
//     const fileMetadata = await drive.files.get({
//       fileId,
//       fields: "name",
//     });

//     const originalName = fileMetadata.data.name || "file";
//     const originalExtension = originalName.split(".").pop() || "bin";
//     const destFileName = `${fileName}.${originalExtension}`;
//     const destinationPath = `${destinationFolderPath}/${destFileName}`;

//     // Start stream transfer
//     const destFile = storageClient.bucket(bucketName).file(destinationPath);
//     const destStream = destFile.createWriteStream({ resumable: true });

//     const res = await drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });

//     let bytesTransferred = 0;

//     await new Promise<void>((resolve, reject) => {
//       res.data
//         .on("data", (chunk) => {
//           bytesTransferred += chunk.length;
//         })
//         .on("end", resolve)
//         .on("error", reject)
//         .pipe(destStream);
//     });

//     const durationMs = Date.now() - startTime;
//     const durationSec = (durationMs / 1000).toFixed(2);
//     const sizeMB = (bytesTransferred / (1024 * 1024)).toFixed(2);

//     logger.info("✅ File transfer completed", {
//       fileId,
//       originalName,
//       destinationPath,
//       fileSizeMB: sizeMB,
//       durationSec,
//     });

//     return destinationPath;
//   } catch (error) {
//     logger.error("❌ Failed to transfer file from Drive to GCS", {
//       error: error instanceof Error ? error.message : String(error),
//       stack: error instanceof Error ? error.stack : undefined,
//       filePublicUrl,
//       destinationFolderPath,
//     });
//     throw error;
//   }
// };

// ///

// export const initiateTransfer = async (
//   filePublicUrl: string,
//   destinationFolderPath: string,
//   fileType: "video" | "audio",
//   videoId: string
// ): Promise<string> => {
//   try {
//     const directUrl = convertToDirectDownloadLink(filePublicUrl);
//     const projectId = config.projectId;
//     const bucketName = config.bucketName;
//     const topicName = `projects/${projectId}/topics/${config.driveToGcsCompletionsTopic}`;
//     // const jobName = `video/${videoId}/${fileType}`;
//     const description = `video/${videoId}/${fileType}`;

//     const listUrl = await generatePublicTsvListFile(filePublicUrl, bucketName, videoId, fileType);

//     const now = new Date();
//     const startTime = {
//       year: now.getFullYear(),
//       month: now.getMonth() + 1,
//       day: now.getDate(),
//       hour: now.getHours(),
//       minute: now.getMinutes() + 1, // schedule 1 min from now
//     };

//     const job: protos.google.storagetransfer.v1.ITransferJob = {
//       projectId,
//       description,
//       transferSpec: {
//         // httpDataSource: {
//         //   listUrl: directUrl,
//         // },
//         httpDataSource: {
//           listUrl,
//         },
//         gcsDataSink: {
//           bucketName,
//           path: destinationFolderPath,
//         },
//         objectConditions: {},
//         transferOptions: {
//           overwriteObjectsAlreadyExistingInSink: true,
//         },
//       },
//       schedule: {
//         scheduleStartDate: startTime,
//       },
//       status: "ENABLED",
//       notificationConfig: {
//         pubsubTopic: topicName,
//         eventTypes: [
//           protos.google.storagetransfer.v1.NotificationConfig.EventType.TRANSFER_OPERATION_SUCCESS,
//           protos.google.storagetransfer.v1.NotificationConfig.EventType.TRANSFER_OPERATION_FAILED,
//         ],
//         payloadFormat: "JSON",
//       },
//       // name: jobName, // used to identify job on pubsub
//     };

//     logger.info("Creating transfer job", {
//       // jobName,
//       description,
//       listUrl,
//       projectId,
//       bucketName,
//       destinationFolderPath,
//       fileType,
//       videoId,
//       directUrl,
//     });

//     const [createdJob] = await transferClient.createTransferJob({ transferJob: job });

//     if (!createdJob.name) {
//       throw new Error("Failed to create transfer job: No job name returned");
//     }

//     logger.info("Transfer job created successfully", { jobName: createdJob.name });
//     return createdJob.name;
//   } catch (error) {
//     logger.error("Failed to create transfer job", {
//       error: error instanceof Error ? error.message : String(error),
//       stack: error instanceof Error ? error.stack : undefined,
//       filePublicUrl,
//       destinationFolderPath,
//       fileType,
//       videoId,
//     });
//     throw error;
//   }
// };

// // ---
// const storage = new Storage();

// export const generatePublicTsvListFile = async (
//   driveShareLink: string,
//   bucketName: string,
//   videoId: string,
//   fileType: "video" | "audio"
// ): Promise<string> => {
//   // const fileIdMatch = driveShareLink.match(/\/file\/d\/(.*?)(\/view|\?|$)/);
//   // if (!fileIdMatch || !fileIdMatch[1]) {
//   //   throw new Error("Invalid Google Drive shareable link format.");
//   // }

//   // const fileId = fileIdMatch[1];
//   // const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

//   const directDownloadUrl = convertToDirectDownloadLink(driveShareLink);
//   const tsvContent = `TsvHttpData-1.0\n${directDownloadUrl}`;

//   const tsvFilename = `gdrive-lists/${videoId}-${fileType}.tsv`;
//   const file = storage.bucket(bucketName).file(tsvFilename);

//   await file.save(tsvContent, {
//     resumable: false,
//     contentType: "text/plain",
//     predefinedAcl: "publicRead", // 👈 makes it publicly accessible
//   });

//   const publicUrl = `https://storage.googleapis.com/${bucketName}/${tsvFilename}`;

//   return publicUrl;
// };

// /**
//  * Initiates a transfer from Google Drive to GCS using Storage Transfer Service
//  */
// // export const initiateTransfer1 = async (
// //   fileId: string,
// //   destinationFolderPath: string,
// //   fileName: string | null,
// //   fileType: "video" | "soundtrack",
// //   videoId: string
// // ): Promise<string> => {
// //   try {
// //     logger.info("Initiating Drive to GCS transfer", { fileId, destinationFolderPath, fileType });

// //     // Get file metadata first to verify access and get name if not provided
// //     // let actualFileName = fileName;
// //     // try {
// //     //   const fileInfo = await driveClient.files.get({
// //     //     fileId,
// //     //     fields: "name,mimeType,size",
// //     //     supportsAllDrives: true,
// //     //   });

// //     //   // If no filename provided, use the original one from Drive
// //     //   if (!actualFileName && fileInfo.data.name) {
// //     //     actualFileName = fileInfo.data.name;
// //     //     logger.info("Using original filename from Drive", { fileName: actualFileName });
// //     //   }
// //     // } catch (error) {
// //     //   logger.error("Failed to access Google Drive file", { fileId, error });
// //     //   throw new Error(`Unable to access Google Drive file: ${error.message}`);
// //     // }

// //     // Ensure we have a filename
// //     // if (!actualFileName) {
// //     //   actualFileName = `${fileType}_${uuidv4()}`;
// //     // }

// //     // Clean up filename - remove special characters and spaces
// //     // const sanitizedFileName = actualFileName.replace(/[^\w\s.-]/g, "").replace(/\s+/g, "_");

// //     // Create destination path in GCS bucket
// //     // Format: {folder}/{fileType}/{uuid}_{filename}
// //     // const uniqueId = uuidv4().slice(0, 8); // Use shorter UUID for filenames
// //     // const destinationPath = `${destinationFolder}/${fileType}/${uniqueId}_${sanitizedFileName}`;

// //     // Create transfer job using the StorageTransferServiceClient
// //     const projectId = config.projectId;
// //     const bucketName = config.bucketName;

// //     // Format the parent resource
// //     const parent = `projects/${projectId}`;

// //     // Create the transfer job request
// //     const transferJob: protos.google.storagetransfer.v1.ITransferJob = {
// //       // name: `projects/${projectId}/transferJobs/${uuidv4()}`,
// //       name: `video/${videoId}`,
// //       description: `Transfer Drive file ${fileId} to GCS (${destinationPath})`,
// //       status: "ENABLED",
// //       projectId: projectId,
// //       transferSpec: {
// //         objectConditions: {
// //           includePrefixes: [fileId],
// //         },
// //         transferOptions: {
// //           deleteObjectsFromSourceAfterTransfer: false,
// //         },
// //         gcsDataSink: {
// //           bucketName: bucketName,
// //           path: destinationPath,
// //         },
// //         // googleDriveSource: {
// //         //   driveId: "shared-with-me",
// //         // },
// //       },
// //       // Set up Pub/Sub notification
// //       notificationConfig: {
// //         pubsubTopic: `projects/${projectId}/topics/${config.driveToGcsCompletionsTopic}`,
// //         eventTypes: [
// //           protos.google.storagetransfer.v1.NotificationConfig.EventType.TRANSFER_OPERATION_SUCCESS,
// //           protos.google.storagetransfer.v1.NotificationConfig.EventType.TRANSFER_OPERATION_FAILED,
// //         ],
// //         payloadFormat: "JSON",
// //       },
// //     };

// //     logger.info("Creating transfer job", {
// //       projectId,
// //       bucketName,
// //       destinationPath,
// //     });

// //     // Create the transfer job using StorageTransferServiceClient
// //     const [response] = await transferClient.createTransferJob({
// //       transferJob: transferJob,
// //     });

// //     if (!response.name) {
// //       throw new Error("Failed to create transfer job: No job name returned");
// //     }

// //     const jobName = response.name;
// //     logger.info("Transfer job created successfully", { jobName });

// //     return jobName;
// //   } catch (error) {
// //     logger.error("Error creating Drive to GCS transfer", { error });
// //     throw error;
// //   }
// // };

// /**
//  * Gets the status of a transfer job
//  */
// export const getTransferStatus = async (jobName: string): Promise<any> => {
//   try {
//     // First try to get the job details
//     const [jobDetails] = await transferClient.getTransferJob({
//       jobName,
//       projectId: config.projectId,
//     });

//     return {
//       status: jobDetails.status || "STATUS_UNSPECIFIED",
//       done: jobDetails.status === "ENABLED" || jobDetails.status === "DISABLED",
//       jobDetails,
//     };
//   } catch (error) {
//     logger.error("Error getting transfer status", { jobName, error });
//     throw error;
//   }
// };

// /**
//  * Get the GCS URI for a completed transfer
//  */
// export const getTransferredFileUri = async (jobName: string): Promise<string | null> => {
//   try {
//     const status = await getTransferStatus(jobName);

//     if (status.done && !status.error) {
//       // Retrieve job details to get the destination path
//       const [jobDetails] = await transferClient.getTransferJob({
//         jobName,
//         projectId: config.projectId,
//       });

//       if (jobDetails.transferSpec?.gcsDataSink) {
//         const bucket = jobDetails.transferSpec.gcsDataSink.bucketName;
//         const path = jobDetails.transferSpec.gcsDataSink.path;
//         return `gs://${bucket}/${path}`;
//       }
//     }

//     return null;
//   } catch (error) {
//     logger.error("Error getting transferred file URI", { jobName, error });
//     return null;
//   }
// };

// // ----
// const convertToDirectDownloadLink = (shareableLink: string) => {
//   const fileIdMatch = shareableLink.match(/\/file\/d\/(.*?)(\/view|\?)/);
//   if (fileIdMatch && fileIdMatch[1]) {
//     return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
//   } else {
//     throw new Error("Invalid Google Drive shareable link format.");
//   }
// };
