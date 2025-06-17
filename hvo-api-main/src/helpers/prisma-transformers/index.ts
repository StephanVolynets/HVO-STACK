import { AudioDubStatus } from "@prisma/client";
import { AudioDubPhase, TaskType } from "hvo-shared";

export const fromAudioDubPhaseToTaskType = (phase: AudioDubPhase): TaskType => {
  switch (phase) {
    case AudioDubPhase.TRANSCRIPTION:
      return TaskType.TRANSCRIPTION;
    case AudioDubPhase.TRANSLATION:
      return TaskType.TRANSLATION;
    case AudioDubPhase.VOICE_OVER:
      return TaskType.VOICE_OVER;
    case AudioDubPhase.AUDIO_ENGINEERING:
      return TaskType.AUDIO_ENGINEERING;
  }
};
