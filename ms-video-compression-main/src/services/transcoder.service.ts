import { TranscoderServiceClient } from '@google-cloud/video-transcoder';
import config from '../config';
import logger from '../utils/logger';
import { storage } from "../services/storage.service";

// Create a singleton instance of the Transcoder client
const transcoderClient = new TranscoderServiceClient();

/**
 * Creates a transcoding job in Google Transcoder API
 */
export const createTranscodingJob = async (
  videoFolderPath: string,
  videoTitle: string,
  videoId: string,
  sourceFilesFolderId: string
): Promise<string> => {
  try {
    logger.info('Creating transcoding job', { videoTitle, videoFolderPath });
    
    // Sanitize the video title for safe file paths
    const sanitizedVideoTitle = sanitizeFilename(videoTitle);
        
    // Define original and sanitized paths
    const originalInputFilePath = `${videoFolderPath}/raw/${videoTitle}.mp4`;
    const sanitizedInputFilePath = `${videoFolderPath}/raw/${sanitizedVideoTitle}.mp4`;
    
    // Rename file in GCS if needed (if title contains problematic characters)
    if (videoTitle !== sanitizedVideoTitle) {
      logger.info('Video title contains problematic characters, renaming file', { 
        originalTitle: videoTitle, 
        sanitizedTitle: sanitizedVideoTitle 
      });
      
      await renameFileIfNeeded(
        config.bucketName,
        originalInputFilePath,
        sanitizedInputFilePath
      );
    }


    // Wait for the file to be available in GCS (handle propagation delays)
    logger.info('Waiting for input file to be available before creating transcoding job');
    await waitForFileToExist(
      config.bucketName,
      sanitizedInputFilePath,
      120000, // 2 minutes timeout
      3000    // Check every 3 seconds
    );

    const outputFilePath = `${videoFolderPath}/compressed/`;

    const fullInputUri = `gs://${config.bucketName}/${sanitizedInputFilePath}`;
    const fullOutputUri = `gs://${config.bucketName}/${outputFilePath}`;


    const labels = {
      videoid: videoId,
    };

    logger.info('Job parameters', {
      inputUri: fullInputUri,
      outputUri: fullOutputUri,
      bucketName: config.bucketName,
      labels,
    });

    const [job] = await transcoderClient.createJob({
      parent: transcoderClient.locationPath(config.projectId, config.region),
      job: {
        inputUri: fullInputUri,
        outputUri: fullOutputUri,
        templateId: 'preset/web-hd',
        labels,
        config: {
          elementaryStreams: [
            {
              key: 'video-stream',
              videoStream: {
                h264: {
                  heightPixels: 720,
                  widthPixels: 1280,
                  bitrateBps: 2500000,
                  frameRate: 60,
                },
              },
            },
            {
              key: 'audio-stream',
              audioStream: {
                codec: 'aac',
                bitrateBps: 128000,
              },
            },
          ],
          muxStreams: [
            {
              key: 'hd',
              elementaryStreams: ['video-stream', 'audio-stream'],
            },
          ],
          pubsubDestination: {
            topic: `projects/${config.projectId}/topics/${config.videoTranscodingCompletionsTopic}`,
          },
        },
        // config: {
        // pubsubDestination: {
        //   topic: `projects/${config.projectId}/topics/${config.videoTranscodingCompletionsTopic}`,
        // },
        // },
      }, // Ako go trgnesh ova any ke treba vo config da stoi pubsubDestination
    });

    const jobId = job.name?.split('/').pop() || '';
    logger.info('Created transcoding job successfully', { jobId });

    return jobId;
  } catch (error) {
    logger.error('Error creating transcoding job', { error });
    throw error;
  }
};

/**
 * Gets the status of a transcoding job
 */
export const getTranscodingJob = async (jobId: string): Promise<any> => {
  try {
    const jobName = transcoderClient.jobPath(
      config.projectId,
      config.region,
      jobId
    );

    const [job] = await transcoderClient.getJob({ name: jobName });
    return job;
  } catch (error) {
    logger.error('Error getting transcoding job', { jobId, error });
    throw error;
  }
};

// ------------------------------------------------------------

/**
 * Renames a file in GCS if the name contains problematic characters
 */
const renameFileIfNeeded = async (
  bucketName: string,
  originalPath: string,
  newPath: string
): Promise<void> => {
  if (originalPath === newPath) {
    logger.info('No file rename needed', { originalPath });
    return;
  }

  try {
    const bucket = storage.bucket(bucketName);
    const sourceFile = bucket.file(originalPath);
    const destinationFile = bucket.file(newPath);

    // Check if source file exists
    const [exists] = await sourceFile.exists();
    if (!exists) {
      throw new Error(`Source file does not exist: ${originalPath}`);
    }

    // Check if destination already exists
    const [destExists] = await destinationFile.exists();
    if (destExists) {
      logger.info('Destination file already exists, skipping rename', { newPath });
      return;
    }

    // Copy to new location
    await sourceFile.copy(destinationFile);
    
    // Delete original file
    await sourceFile.delete();
    
    logger.info('Successfully renamed file in GCS', { 
      from: originalPath, 
      to: newPath 
    });
  } catch (error) {
    logger.error('Error renaming file in GCS', { 
      originalPath, 
      newPath, 
      error 
    });
    throw error;
  }
};


/**
 * Sanitizes filename for GCS compatibility
 * Removes problematic characters that can cause issues with GCS paths
 */
const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[?<>\\:*|"]/g, '')           // Remove problematic characters (?<>\\:*|")
    .replace(/[^\w\s.-]/g, '')             // Remove remaining special chars, keep alphanumeric, spaces, dots, hyphens
    .replace(/\s+/g, '_')                  // Replace spaces with underscores
    .replace(/_{2,}/g, '_')                // Replace multiple underscores with single
    .replace(/^[._]+|[._]+$/g, '')         // Remove leading/trailing dots/underscores
    .trim();
};


/**
 * Waits for a file to exist in GCS with retry logic
 */
const waitForFileToExist = async (
  bucketName: string,
  filePath: string,
  maxWaitTime: number = 120000, // 2 minutes default
  checkInterval: number = 3000   // 3 seconds between checks
): Promise<boolean> => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filePath);
  const startTime = Date.now();
  
  logger.info('Waiting for file to exist in GCS', { 
    filePath, 
    maxWaitTime: `${maxWaitTime/1000}s`,
    checkInterval: `${checkInterval/1000}s`
  });
  
  // Wait for 1 minute before starting file existence checks
  logger.info('Initial wait period before checking file existence', { 
    filePath, 
    initialWaitTime: '60s' 
  });
  await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute wait
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      const [exists] = await file.exists();
      if (exists) {
        const elapsedTime = Date.now() - startTime;
        logger.info('File confirmed to exist in GCS', { 
          filePath, 
          elapsedTime: `${elapsedTime/1000}s` 
        });
        return true;
      }
    } catch (error) {
      logger.warn('File existence check failed, retrying...', { 
        filePath, 
        error: error.message 
      });
    }
    
    const elapsedTime = Date.now() - startTime;
    logger.info('File not yet available, waiting...', { 
      filePath, 
      elapsedTime: `${elapsedTime/1000}s`,
      remainingTime: `${(maxWaitTime - elapsedTime)/1000}s`
    });
    
    await new Promise(resolve => setTimeout(resolve, checkInterval));
  }
  
  const totalWaitTime = Date.now() - startTime;
  logger.error('File did not become available within timeout', { 
    filePath, 
    totalWaitTime: `${totalWaitTime/1000}s` 
  });
  throw new Error(`File ${filePath} not found within ${maxWaitTime/1000} seconds`);
};