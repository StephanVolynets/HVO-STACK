import { protos, StorageTransferServiceClient } from "@google-cloud/storage-transfer";
import { Storage } from "@google-cloud/storage";
import { google } from "googleapis";
import config from "../config";
import logger from "../utils/logger";
import axios from "axios";

// Create singleton instances
const storageClient = new Storage();

export const transferResource = async (
  filePublicUrl: string,
  destinationFolderPath: string,
  fileName: string
): Promise<string> => {
  try {
    const startTime = Date.now();

    const downloadUrl = convertToDirectDownloadLink(filePublicUrl);
    logger.info("Download URL: ", downloadUrl);
    const bucketName = config.bucketName;

    // Get original file name from Drive API
    const originalExtension = await getFileExtensionFromUrl(downloadUrl);
    logger.info("Original extension: ", originalExtension);

    const destFileName = `${fileName}.${originalExtension}`;
    const destinationPath = `${destinationFolderPath}/${destFileName}`;

    // Start stream transfer
    const destFile = storageClient.bucket(bucketName).file(destinationPath);
    const destStream = destFile.createWriteStream({ resumable: true });

    const response = await axios.get(downloadUrl, { responseType: "stream" });

    let bytesTransferred = 0;
    await new Promise<void>((resolve, reject) => {
      response.data
        .on("data", (chunk: Buffer) => {
          bytesTransferred += chunk.length;
        })
        .on("end", resolve)
        .on("error", reject)
        .pipe(destStream);
    });

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
    const fileSizeMB = (bytesTransferred / (1024 * 1024)).toFixed(2);

    logger.info("✅ File transfer completed", {
      fileName,
      filePublicUrl,
      destinationPath,
      fileSizeMB,
      durationSec,
    });

    return destinationPath;
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
};

const convertToDirectDownloadLink = (shareableLink: string) => {
  const fileIdMatch = shareableLink.match(/\/file\/d\/(.*?)(\/view|\?)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
  } else {
    throw new Error("Invalid Google Drive shareable link format.");
  }
};

export const getFileExtensionFromUrl = async (url: string): Promise<string> => {
  const defaultExtension = "bin";

  const mimeMap: Record<string, string> = {
    "video/mp4": "mp4",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/webm": "webm",
    "video/webm": "webm",
    "audio/ogg": "ogg",
    "video/ogg": "ogv",
    "video/quicktime": "mov",
  };

  try {
    const res = await axios.get(url, { responseType: "stream" });

    // Try content-disposition
    const disposition = res.headers["content-disposition"];
    if (disposition) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match) {
        const filename = match[1].replace(/['"]/g, "");
        const ext = filename.split(".").pop();
        if (ext) return ext;
      }
    }

    // Fallback to MIME type
    const contentType = res.headers["content-type"];
    const extension = mimeMap[contentType] || defaultExtension;

    logger.info("Resolved extension via stream headers", { url, contentType, extension });

    return extension;
  } catch (error) {
    logger.warn("[getFileExtensionFromUrl] Fallback to .bin", {
      url,
      error: error instanceof Error ? error.message : String(error),
    });

    return defaultExtension;
  }
};

// export const getFileExtensionFromUrl = async (url: string): Promise<string> => {
//   const defaultExtension = "bin";

//   const mimeMap: Record<string, string> = {
//     "video/mp4": "mp4",
//     "audio/mpeg": "mp3",
//     "audio/wav": "wav",
//     "audio/x-wav": "wav",
//     "audio/webm": "webm",
//     "video/webm": "webm",
//     "audio/ogg": "ogg",
//     "video/ogg": "ogv",
//     "video/quicktime": "mov",
//   };

//   try {
//     const head = await axios.head(url);
//     const contentType = head.headers["content-type"];

//     const extension = mimeMap[contentType] || defaultExtension;

//     logger.info("Resolved MIME type from URL", { url, contentType, extension });

//     return extension;
//   } catch (error) {
//     logger.warn("[Prepearing GDrive Download] Couldn't determine file type, defaulting to .bin", {
//       url,
//       error: error instanceof Error ? error.message : String(error),
//     });

//     return defaultExtension;
//   }
// };

export const getRealDownloadUrl = async (fileId: string): Promise<{ downloadUrl: string; sizeBytes?: string }> => {
  const exportUrl = `https://drive.google.com/uc?id=${fileId}&authuser=0&export=download`;

  // First call to get the page (required for session cookies / token prep)
  await axios.get(exportUrl);

  // Then make the Drive UI-like POST request
  const res = await axios.post(
    exportUrl,
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
  );

  const json = JSON.parse(res.data.slice(4)); // Remove )]}'
  return {
    downloadUrl: json.downloadUrl,
    sizeBytes: json.sizeBytes,
  };
};
