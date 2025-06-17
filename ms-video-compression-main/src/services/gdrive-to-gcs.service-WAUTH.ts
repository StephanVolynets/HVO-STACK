// import { protos, StorageTransferServiceClient } from "@google-cloud/storage-transfer";
// import { Storage } from "@google-cloud/storage";
// import { google } from "googleapis";
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

// export const transferResource = async (
//   filePublicUrl: string,
//   destinationFolderPath: string,
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

// // const convertToDirectDownloadLink = (shareableLink: string) => {
// //   const fileIdMatch = shareableLink.match(/\/file\/d\/(.*?)(\/view|\?)/);
// //   if (fileIdMatch && fileIdMatch[1]) {
// //     return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
// //   } else {
// //     throw new Error("Invalid Google Drive shareable link format.");
// //   }
// // };
