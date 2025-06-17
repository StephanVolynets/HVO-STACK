import { StaffType, TaskType } from "hvo-shared";

export const mapStaffTypeToTaskType = (staffType: StaffType) => {
  switch (staffType) {
    case StaffType.TRANSCRIPTOR:
      return TaskType.TRANSCRIPTION;
    case StaffType.TRANSLATOR:
      return TaskType.TRANSLATION;
    case StaffType.VOICE_ACTOR:
      return TaskType.VOICE_OVER;
    case StaffType.AUDIO_ENGINEER:
      return TaskType.AUDIO_ENGINEERING;
  }
};

export const mappTaskTypeToStaffType = (taskType: TaskType): StaffType => {
  switch (taskType) {
    case TaskType.TRANSCRIPTION:
      return StaffType.TRANSCRIPTOR;
    case TaskType.TRANSLATION:
      return StaffType.TRANSLATOR;
    case TaskType.VOICE_OVER:
      return StaffType.VOICE_ACTOR;
    case TaskType.AUDIO_ENGINEERING:
      return StaffType.AUDIO_ENGINEER;
  }
};

// export function addStatusFilter(where: any, status: string | undefined): void {
//   switch (status) {
//     case "IN-PROGRESS":
//       where.status = "IN_PROGRESS"
//     case "PENDING":
//       where.status = "PENDING";
//     case "FEEDBACK":
//       where.status = "FEEDBACK";
//   }
// }
