import { Storage } from "@google-cloud/storage";
import config from "../config";
import logger from "../utils/logger";

// Create a singleton instance of the Storage client
export const storage = new Storage();

/**
 * Deletes a file from GCS
 */
export const deleteFile = async (filePath: string, bucketName: string = config.bucketName): Promise<void> => {
  try {
    logger.info("Deleting file from GCS", { filePath, bucketName });

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);

    await file.delete();

    logger.info("Successfully deleted file from GCS", { filePath });
  } catch (error) {
    logger.error("Error deleting file from GCS", { error, filePath });
    throw error;
  }
};

// /**
//  * Copies a file within GCS
//  */
// export const copyFile = async (
//   sourcePath: string,
//   destinationPath: string,
//   bucketName: string = config.bucketName
// ): Promise<void> => {
//   try {
//     logger.info('Copying file within GCS', {
//       sourcePath,
//       destinationPath,
//       bucketName
//     });

//     const bucket = storage.bucket(bucketName);
//     const sourceFile = bucket.file(sourcePath);

//     await sourceFile.copy(destinationPath);

//     logger.info('Successfully copied file in GCS', {
//       sourcePath,
//       destinationPath
//     });
//   } catch (error) {
//     logger.error('Error copying file in GCS', { error, sourcePath, destinationPath });
//     throw error;
//   }
// };

/**
 * Checks if a file exists in GCS
 */
export const fileExists = async (filePath: string, bucketName: string = config.bucketName): Promise<boolean> => {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);

    const [exists] = await file.exists();
    return exists;
  } catch (error) {
    logger.error("Error checking if file exists in GCS", { error, filePath });
    throw error;
  }
};

/**
 * Creates a signed URL for a file
 */
export const getSignedUrl = async (
  filePath: string,
  expirationMs: number = 24 * 60 * 60 * 1000, // 24 hours
  bucketName: string = config.bucketName
): Promise<string> => {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filePath);

    // Check if the file exists
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("File does not exist");
    }

    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + expirationMs,
    });

    return signedUrl;
  } catch (error) {
    logger.error("Error creating signed URL", {
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
      },
      filePath,
      bucketName,
      expirationMs,
    });
    throw error;
  }
};
