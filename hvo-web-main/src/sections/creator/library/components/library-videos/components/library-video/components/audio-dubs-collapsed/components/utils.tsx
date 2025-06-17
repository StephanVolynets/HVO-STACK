import { AudioDubPhase, AudioDubStatus } from "hvo-shared";
import { Elsie_Swash_Caps } from "next/font/google";

export const getStatusIndicatorColor = (status: AudioDubStatus, isApproved: boolean) => {
  switch (status) {
    case AudioDubStatus.PENDING:
      return "#E9E9E9";
    case AudioDubStatus.IN_PROGRESS:
      return "#4285F4"; //"#FFA500";
    case AudioDubStatus.COMPLETED:
      if (isApproved) {
        return "#00B280";
      } else {
        return "#4285F4";
      }
    case AudioDubStatus.REVIEW:
      if (isApproved) {
        return "#00B280";
      } else {
        return "#4285F4";
      }
    default:
      return "#E9E9E9";
  }
};

export const mapProgressToNumber = (progress: AudioDubPhase): number => {
  switch (progress) {
    case AudioDubPhase.TRANSCRIPTION:
      return 1;
    case AudioDubPhase.TRANSLATION:
      return 2;
    case AudioDubPhase.VOICE_OVER:
      return 3;
    case AudioDubPhase.AUDIO_ENGINEERING:
      return 4;
    // case AudioDubPhase.REVIEW:
    //   return 5;
    default:
      return 0;
  }
};

export const getProgressNumberColor = (
  currentProgress: AudioDubPhase,
  audioDubProgress: AudioDubPhase,
  status: AudioDubStatus
) => {
  if (status === AudioDubStatus.REVIEW) {
    return "common.white";
  }
  if (mapProgressToNumber(currentProgress) <= mapProgressToNumber(audioDubProgress)) {
    return "common.white";
  } else return "primary.main";
};
