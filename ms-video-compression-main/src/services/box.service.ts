import { BoxClient, BoxJwtAuth, JwtConfig } from "box-typescript-sdk-gen";
import { decodeBase64 } from "box-typescript-sdk-gen/lib/internal/utils";
import { Readable } from "stream";
import { storage } from "./storage.service";
import config from "../config";
import logger from "../utils/logger";
import { UploadFileRequestBody } from "box-typescript-sdk-gen/lib/managers/uploads.generated";

/**
 * Box Service - Singleton implementation
 */
export class BoxService {
  private client: BoxClient;
  private static instance: BoxService;

  private constructor() {
    // Initialize Box client using JWT authentication
    const jwtConfig: JwtConfig = JwtConfig.fromConfigJsonString(decodeBase64(process.env.BOX_CONFIG_BASE_64 || ""));

    const auth = new BoxJwtAuth({ config: jwtConfig });
    this.client = new BoxClient({ auth });

    logger.info("BoxService instance created");
  }

  /**
   * Gets the singleton instance of BoxService
   */
  public static getInstance(): BoxService {
    if (!BoxService.instance) {
      BoxService.instance = new BoxService();
    }
    return BoxService.instance;
  }

  async uploadFile(folderId: string, fileStream: Readable, fileName: string, contentType?: string): Promise<void> {
    try {
      logger.info("Starting upload to Box", { fileName, folderId });

      // const stream = Readable.from(file.buffer);
      const requestBody: UploadFileRequestBody = {
        attributes: {
          name: fileName,
          parent: { id: folderId },
        },
        file: fileStream as any,
      };

      // Perform the upload
      const response = await this.client.uploads.uploadFile(requestBody);
      const uploadedFile = response.entries[0];

      logger.info("Successfully uploaded file to Box", {
        fileId: uploadedFile.id,
        fileName,
      });

      //   return uploadedFile.id;
      //   return { fileId: uploadedFile.id, fileName: uploadedFile.name };
    } catch (error) {
      logger.error("Error uploading file to Box", {
        error,
        fileName,
        folderId,
      });
      throw error;
    }
  }
}

/**
 * Uploads a file from GCS to Box
 */
export const uploadToBox = async (gcsFilePath: string, boxFolderId: string, fileName: string, contentType?: string): Promise<void> => {
  try {
    logger.info("Uploading file from GCS to Box", {
      gcsFilePath,
      boxFolderId,
      fileName,
    });

    // Get file from GCS
    const bucket = storage.bucket(config.bucketName);
    const file = bucket.file(gcsFilePath);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      const error = `File does not exist in GCS: ${gcsFilePath}`;
      logger.error(error);
      throw new Error(error);
    }

    // Get file metadata
    const [metadata] = await file.getMetadata();
    const fileSize = parseInt(metadata.size, 10);

    if (fileSize === 0) {
      const error = `File exists but has zero bytes: ${gcsFilePath}`;
      logger.error(error);
      throw new Error(error);
    }

    logger.info("Starting upload to Box", {
      fileName,
      fileSizeMB: (fileSize / (1024 * 1024)).toFixed(2),
    });

    // Stream the file from GCS
    const fileStream = file.createReadStream();

    // Get Box service instance and upload
    const boxService = BoxService.getInstance();
    await boxService.uploadFile(boxFolderId, fileStream, fileName, contentType);

    // logger.info("Successfully uploaded file to Box", { boxFileId, fileName });

    // return boxFileId;
  } catch (error) {
    logger.error("Error uploading file to Box", {
      error,
      gcsFilePath,
      fileName,
    });
    throw error;
  }
};

/**
 * Uploads multiple files from GCS to Box
 */
export const uploadFilesToBox = async (sourceFilesFolderId: string, videoFolderPath: string, videoTitle: string, mp4FolderId: string, mAndEFolderId: string): Promise<void> => {
  try {
    logger.info("Preparing to upload files to Box", {
      sourceFilesFolderId,
      videoFolderPath,
      videoTitle,
    });

    // Define paths
    const compressedVideoPath = `${videoFolderPath}/compressed/hd.mp4`;
    const meAudioFilePath = `${videoFolderPath}/me-audio/${videoTitle}-m&e.wav`;

    // Upload compressed video
    await uploadToBox(compressedVideoPath, mp4FolderId, `${videoTitle}.mp4`, "video/mp4");

    // Upload M&E audio file
    await uploadToBox(meAudioFilePath, mAndEFolderId, `${videoTitle}-m&e.wav`, "audio/wav");

    logger.info("All files successfully uploaded to Box", { videoTitle });
  } catch (error) {
    logger.error("Error in bulk upload to Box", {
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
      },
      videoFolderPath,
      videoTitle,
      sourceFilesFolderId,
      mp4FolderId,
      mAndEFolderId,
    });
    throw error;
  }
};

// /**
//  * Copies a file from Box to GCS
//  */
// export const copyFromBoxToGCS = async (
//   boxFileId: string,
//   gcsDestinationPath: string,
//   bucketName: string = config.bucketName
// ): Promise<string> => {
//   try {
//     logger.info("Copying file from Box to GCS", {
//       boxFileId,
//       gcsDestinationPath,
//     });

//     // Get Box service instance and download stream
//     const boxService = BoxService.getInstance();
//     const boxStream = await boxService.downloadFile(boxFileId);

//     // Upload to GCS
//     const bucket = storage.bucket(bucketName);
//     const file = bucket.file(gcsDestinationPath);

//     await new Promise<void>((resolve, reject) => {
//       const writeStream = file.createWriteStream();

//       boxStream
//         .pipe(writeStream)
//         .on("error", (err) => {
//           logger.error("Error streaming from Box to GCS", { err });
//           reject(err);
//         })
//         .on("finish", () => {
//           resolve();
//         });
//     });

//     const gcsUri = `gs://${bucketName}/${gcsDestinationPath}`;
//     logger.info("Successfully copied file from Box to GCS", {
//       boxFileId,
//       gcsUri,
//     });

//     return gcsUri;
//   } catch (error) {
//     logger.error("Error copying from Box to GCS", {
//       error,
//       boxFileId,
//       gcsDestinationPath,
//     });
//     throw error;
//   }
// };
