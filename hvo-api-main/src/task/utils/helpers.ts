import { AudioDubPhase, TaskType } from "@prisma/client";
import { NotificationGeneratorService } from "src/notifications/services/notifications-generator.service";

const getUploadFolderId = (videoRootFolderId: string, tasktype: TaskType) => {
  switch (tasktype) {
    case TaskType.TRANSCRIPTION:
      return videoRootFolderId;
    case TaskType.TRANSLATION:
      return videoRootFolderId;
    case TaskType.VOICE_OVER:
      return videoRootFolderId;
    case TaskType.AUDIO_ENGINEERING:
      return videoRootFolderId;
  }
};

export const getNextTaskType = (taskType: TaskType) => {
  switch (taskType) {
    case TaskType.TRANSCRIPTION:
      return TaskType.TRANSLATION;
    case TaskType.TRANSLATION:
      return TaskType.VOICE_OVER;
    case TaskType.VOICE_OVER:
      return TaskType.AUDIO_ENGINEERING;
    case TaskType.AUDIO_ENGINEERING:
      return null;
  }
};

export const mapTaskTypeToAudiodubPhase = (taskType: TaskType) => {
  switch (taskType) {
    case TaskType.TRANSCRIPTION:
      return AudioDubPhase.TRANSCRIPTION;
    case TaskType.TRANSLATION:
      return AudioDubPhase.TRANSLATION;
    case TaskType.VOICE_OVER:
      return AudioDubPhase.VOICE_OVER;
    case TaskType.AUDIO_ENGINEERING:
      return AudioDubPhase.AUDIO_ENGINEERING;
  }
};

export const sendNotificationAfterStaffAssigned = async ({
  taskId,
  taskType,
  videoId,
  notificationGeneratorService,
}: {
  taskId?: number;
  taskType: TaskType;
  videoId?: number;
  notificationGeneratorService: NotificationGeneratorService;
}) => {
  switch (taskType) {
    case TaskType.TRANSCRIPTION:
      await notificationGeneratorService.sendRawTranscriptReadyNotification(videoId);
      break;
    case TaskType.TRANSLATION:
      await notificationGeneratorService.sendFinalTranscriptReadyNotification(taskId);
      break;
    case TaskType.VOICE_OVER:
      await notificationGeneratorService.sendTranslationReadyNotification(taskId);
      break;
    case TaskType.AUDIO_ENGINEERING:
      await notificationGeneratorService.sendVoiceOverReadyNotification(taskId);
      break;
  }
};
