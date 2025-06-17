import { TaskStatus, TaskType } from "hvo-shared";

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return "#00B27F";
    case TaskStatus.IN_PROGRESS:
      return "#4285F4";
    case TaskStatus.PENDING:
      return "#E9E9E9";
    default:
      return "#E9E9E9";
  }
};

export const getStepNumber = (type: TaskType) => {
  switch (type) {
    case TaskType.TRANSCRIPTION:
      return "1";
    case TaskType.TRANSLATION:
      return "2";
    case TaskType.VOICE_OVER:
      return "3";
    case TaskType.AUDIO_ENGINEERING:
      return "4";
    default:
      return "";
  }
};
