import { AudioDubPhase, AudioDubStatus, TaskType } from "@prisma/client";
import { Storage } from "@google-cloud/storage";
import { FeedbackPhase } from "hvo-shared";
import { renameFileInGCS, renameFolderInGCS } from "src/helpers/gcs-utils/gcs-utils";
import { NotificationGeneratorService } from "src/notifications/services/notifications-generator.service";

export const getThumbnailUrl = (videoUrl: string) => {
  const vIndex = videoUrl.indexOf("v=");
  const videoId = videoUrl.substring(vIndex + 2, vIndex + 13); // Get 11 characters after 'v='

  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
};

export const getEnumTaskType = (taskType: string): TaskType => {
  switch (taskType) {
    case "TRANSCRIPTION":
      return TaskType.TRANSCRIPTION;
    case "TRANSLATION":
      return TaskType.TRANSLATION;
    case "VOICE_OVER":
      return TaskType.VOICE_OVER;
    case "AUDIO_ENGINEERING":
      return TaskType.AUDIO_ENGINEERING;
    default:
      throw new Error("Invalid task type");
  }
};

export function getTimePeriodFilter(timePeriod: string): { gte: Date } | undefined {
  const now = new Date();

  switch (timePeriod) {
    case "TODAY":
      // Return the start of the current day
      return { gte: new Date(now.setHours(0, 0, 0, 0)) };

    case "WEEK":
      // Return the start of the current week (7 days ago)
      return { gte: new Date(now.setDate(now.getDate() - 7)) };

    case "MONTH":
      // Return the start of the current month (30 days ago)
      return { gte: new Date(now.setMonth(now.getMonth() - 1)) };

    case "YEAR":
      // Return the start of the current year (365 days ago)
      return { gte: new Date(now.setFullYear(now.getFullYear() - 1)) };

    default:
      // If no valid time period is provided, return undefined (no filter applied)
      return undefined;
  }
}

export const generateLanguages = () => {
  const numberOfLanguages = Math.floor(Math.random() * 6) + 2; // Random size between 2 and 7
  const languages = [];

  for (let i = 0; i < numberOfLanguages; i++) {
    languages.push(Math.floor(Math.random() * 67) + 1); // Random integer between 1 and 67
  }

  return languages;
};

// export const mapFeedbackPhaseToTaskType = (phase: FeedbackPhase): TaskType => {
//     switch (phase) {
//       case FeedbackPhase.TRANSCRIPTION:
//         return TaskType.TRANSCRIPTION;
//       case FeedbackPhase.TRANSLATION:
//         return TaskType.TRANSLATION;
//       case FeedbackPhase.VOICE_OVER:
//         return TaskType.VOICE_OVER;
//       case FeedbackPhase.AUDIO_ENGINEERING:
//         return TaskType.AUDIO_ENGINEERING;
//       default:
//         throw new Error("Invalid feedback phase");
//     }
// }

export const typeOrder = {
  TRANSCRIPTION: 1,
  TRANSLATION: 2,
  VOICE_OVER: 3,
  AUDIO_ENGINEERING: 4,
};

export const renameVideoInGCS = async (storage: Storage, creatorUsername: string, sessionId: string, videoId: number, bucketName: string, isVideoExternal: boolean, isAudioExternal: boolean, audioExists: boolean) => {
  const sessionFolderPath = `videos/${creatorUsername}/${sessionId}/`;
  const targetFolderPath = `videos/${creatorUsername}/${videoId}/`;

  // Rename all files from session folder to target folder
  await renameFolderInGCS(storage, sessionFolderPath, targetFolderPath, bucketName);

  // Rename specific files
  if (!isVideoExternal) {
    const rawVideoPath = `${targetFolderPath}raw/video.mp4`;
    const newRawVideoPath = `${targetFolderPath}raw/${videoId}.mp4`;
    await renameFileInGCS(storage, rawVideoPath, newRawVideoPath, bucketName);
  }

  if (!isAudioExternal && audioExists) {
    const meAudioPath = `${targetFolderPath}me-audio/audio.wav`;
    const newMeAudioPath = `${targetFolderPath}me-audio/${videoId}-m&e.wav`;
    await renameFileInGCS(storage, meAudioPath, newMeAudioPath, bucketName);
  }
};

export const sendNotificationAfterFeedbackApproved = async (taskId: number, taskType: TaskType, videoId: number, notificationGeneratorService: NotificationGeneratorService, filterLanguageId?: number) => {
  console.log(`[sendNotificationAfterFeedbackApproved] taskId: ${taskId}, taskType: ${taskType}, videoId: ${videoId}`);
  switch (taskType) {
    case TaskType.TRANSCRIPTION:
      await notificationGeneratorService.sendRawTranscriptReadyNotification(videoId);
      break;
    case TaskType.TRANSLATION:
      await notificationGeneratorService.sendFinalTranscriptReadyNotification(taskId, filterLanguageId);
      break;
    case TaskType.VOICE_OVER:
      await notificationGeneratorService.sendTranslationReadyNotification(taskId);
      break;
    case TaskType.AUDIO_ENGINEERING:
      await notificationGeneratorService.sendVoiceOverReadyNotification(taskId);
      break;
  }
};
