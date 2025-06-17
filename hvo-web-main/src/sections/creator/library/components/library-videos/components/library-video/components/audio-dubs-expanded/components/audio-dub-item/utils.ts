import { AudioDubPhase, AudioDubStatus } from "hvo-shared";
import { mapProgressToNumber } from "../../../audio-dubs-collapsed/components/utils";

export const mapAudioDubProgressToDisplayName = (progress: AudioDubPhase): string => {
  switch (progress) {
    case AudioDubPhase.TRANSCRIPTION:
      return "Transcription";
    case AudioDubPhase.TRANSLATION:
      return "Translation";
    case AudioDubPhase.VOICE_OVER:
      return "Recording";
    case AudioDubPhase.AUDIO_ENGINEERING:
      return "Mixing";
    default:
      return progress;
  }
};

// export const getNumberBackgroundColor = (
//   currentProgress: AudioDubProgress,
//   audioDubProgress: AudioDubProgress,
//   status: AudioDubStatus
// ) => {
//   if (currentProgress === audioDubProgress && status === AudioDubStatus.IN_PROGRESS) {
//     return "common.blue"; // Active
//   }
//   if (mapProgressToNumber(currentProgress) < mapProgressToNumber(audioDubProgress)) {
//     return "common.green"; // Completed
//   } else {
//     return "#E9E9E9"; // Pending
//   }
// };

export const getNumberBackgroundColor = (
  currentProgress: AudioDubPhase,
  stepProgress: AudioDubPhase,
  status: AudioDubStatus
) => {
  if (status === AudioDubStatus.REVIEW) {
    return "common.green"; // Completed
  }

  if (currentProgress === stepProgress) {
    return "common.blue"; // Active
  }
  if (mapProgressToNumber(stepProgress) < mapProgressToNumber(currentProgress)) {
    return "common.green"; // Completed
  } else {
    return "#E9E9E9"; // Pending
  }
};

export const isStepCompleted = (
  currentPhase: AudioDubPhase,
  stepPhase: AudioDubPhase,
  status: AudioDubStatus,
  isApproved: boolean
) => {
  if (status === AudioDubStatus.REVIEW && isApproved) {
    return true;
  }

  return mapProgressToNumber(stepPhase) < mapProgressToNumber(currentPhase);
};
