import { SubmitFeedbackDTO } from "hvo-shared";

export const getDefaultFormValues = (): SubmitFeedbackDTO => {
  const defaultValues = {
    videoId: -1,
    languageId: null,
    phase: null,
    description: null,
    timestamp: null,
  };

  return defaultValues as unknown as SubmitFeedbackDTO;
};

export const mapPhaseToNumber = (phase: string): string => {
  console.log("PHASE -> ", phase);
  switch (phase) {
    case "TRANSCRIPTION":
      return "1";
    case "TRANSLATION":
      return "2";
    case "VOICE_OVER":
      return "3";
    case "AUDIO_ENGINEERING":
      return "4";
    case "UNKNOWN":
      return "?";
    default:
      return "";
  }
};
