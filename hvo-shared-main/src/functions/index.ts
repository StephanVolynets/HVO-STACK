import { StaffType, TaskStatus, TaskType } from "../schemas";

export function toDisplayName(value: string): string {
  return value
    .toLowerCase() // Convert to lowercase to start with
    .split("_") // Split by underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join words with a space
}

// export function staffRoleToProfession(staffRole: StaffType) {
//   switch (staffRole) {
//     case StaffType.TRANSCRIPTOR:
//       return "Transcription";
//     case StaffType.TRANSLATOR:
//       return "Translation";
//     case StaffType.VOICE_ACTOR:
//       return "Voice Over";
//     case StaffType.AUDIO_ENGINEER:
//       return "Sound Mix";
//     default:
//       return "Unknown";
//   }
// }

export function taskTypeToProfession(taskType: TaskType) {
  switch (taskType) {
    case TaskType.TRANSCRIPTION:
      return "Transcription";
    case TaskType.TRANSLATION:
      return "Translation";
    case TaskType.VOICE_OVER:
      return "Voice Over";
    case TaskType.AUDIO_ENGINEERING:
      return "Sound Mix";
    default:
      return "Unknown";
  }
}
