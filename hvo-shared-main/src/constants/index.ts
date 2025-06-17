export const ROLES = ["ADMIN", "VENDOR", "STAFF", "CREATOR", "CREATOR_ASSISTANT", "ADMIN_ASSISTANT"];
export const STAFF_TYPES = ["TRANSCRIPTOR", "TRANSLATOR", "VOICE_ACTOR", "AUDIO_ENGINEER"];
export const TASKS = ["TRANSCRIPTION", "TRANSLATION", "VOICE_OVER", "AUDIO_ENGINEERING"];

export const TIME_PERIOD_FILTERS = ["ALL", "TODAY", "WEEK", "MONTH", "YEAR"];

export const PHASES = ["TRANSCRIPTION", "TRANSLATION", "VOICE_OVER", "AUDIO_ENGINEERING", "UNKNOWN"];

export const TASKS_FILTER_OPTIONS = [
  { value: "all_videos", label: "All Videos" },
  { value: "ready_for_work", label: "Ready for Work" },
  { value: "pending_submission", label: "Pending Submission" },
  { value: "feedback", label: "Feedback" },
  { value: "completed", label: "Completed" },
  { value: "upcoming", label: "Upcoming" },
];
