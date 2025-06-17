import { BitFieldResolvable, GatewayIntentsString } from "discord.js";

export const NOTIFICATION_TYPES = {
  VIDEO_SUBMISSION: "video_submission",
  STAFF_ASSIGNMENT: "staff_assignment",
  TRANSCRIPTION_READY: "transcription_ready",
};

export const MESSAGE_TEMPLATES = {
  [NOTIFICATION_TYPES.VIDEO_SUBMISSION]: "A new video has been submitted for review. Please check it out in the submissions channel.",
  [NOTIFICATION_TYPES.STAFF_ASSIGNMENT]: "All required staff members have been assigned to the video tasks.",
  [NOTIFICATION_TYPES.TRANSCRIPTION_READY]: "The raw transcription for the video is ready and available for review. Please check it out.",
};

export const DISCORD_INTENTS: BitFieldResolvable<GatewayIntentsString, number> = [
  "Guilds",
  "GuildMessages",
  "DirectMessages",
  "MessageContent", // Allows access to message content (for messages)
];

// Summary of Key Permissions:
// 'Guilds': Needed to join guilds (servers).
// 'GuildMessages': Needed to receive messages in guilds.
// 'DirectMessages': Needed to receive direct messages.
// 'MessageContent': Allows your bot to access the content of messages (required to read messages).

export const DISCORD_CHANNEL_NAMES = {
  CHAT: "📤┃chat",
  SUBMISSIONS: "💬┃submissions",
  COMPLETED: "✅┃completed",
  TICKETS: "🎫┃tickets",
  TRANSCRIPTION: "【1】transcription",
  TRANSLATION: "【2】translation",
  RECORDING: "【3】recording",
  MIXING: "【4】mixing",
};

export const DISCORD_DEFAULT_CHANNELS = [
  DISCORD_CHANNEL_NAMES.TRANSCRIPTION,
  DISCORD_CHANNEL_NAMES.TRANSLATION,
  DISCORD_CHANNEL_NAMES.RECORDING,
  DISCORD_CHANNEL_NAMES.MIXING,
  DISCORD_CHANNEL_NAMES.COMPLETED,
  DISCORD_CHANNEL_NAMES.TICKETS,
  DISCORD_CHANNEL_NAMES.SUBMISSIONS,
  DISCORD_CHANNEL_NAMES.CHAT,
];

export const NOTIFICATION_NAME = {
  NEW_VIDEO_SUBMISSION_PA: "New Video Submission Available",
  STAFF_ASSIGNED_PA: "Staff Members Assigned",
  SONIX_GENERATING: "Sonix Transcription in Progress",
  SONIX_COMPLETED: "Sonix Transcription Completed",
  MP4_GENERATING: "MP4 Generation in Progress",
  MP4_COMPLETED: "MP4 Generation Completed",
  RAW_TRANSCRIPT_READY: "Raw Transcript Ready",
  RAW_TRANSCRIPT_READY_PA: "Raw Transcript Ready for PA",
  TRANSCRIPTION_UPLOADED_PA: "Transcription Uploaded for PA",
  FINAL_TRANSCRIPT_READY: "Final Transcript Ready",
  FINAL_TRANSCRIPT_READY_PA: "Final Transcript Ready for PA",
  TRANSLATION_UPLOADED_PA: "Translation Uploaded for PA",
  TRANSLATION_READY: "Translation Ready",
  TRANSLATION_READY_PA: "Translation Ready for PA",
  VOICE_OVER_UPLOADED_PA: "Voice Over Uploaded for PA",
  VOICE_OVER_READY: "Voice Over Ready",
  VOICE_OVER_READY_PA: "Voice Over Ready for PA",
  MIXED_AUDIO_READY_PA: "Mixed Audio Ready for PA",
  ALL_MIXED_AUDIOS_READY_PA: "All Mixed Audios Ready for PA",
  ADMIN_SUBMITTED_TRANSLATIONS: "Admin Submitted Translations",
  //
  FINAL_SCRIPT_SENT_TO_TRANSLATORS: "Final Script Sent to Translators",
  TRANSLATION_SENT_TO_VA: "Translation Sent to Voice Actors",
  VOICEOVER_SENT_TO_AE: "Voiceover Sent to Audio Engineers",
  VIDEO_SHARE: "Video Share",
};

export type NotificationName = keyof typeof NOTIFICATION_NAME;

export const DISCORD_COLORS = {
  RED: 0xff0000,
  GREEN: 0x00ff00,
  YELLOW: 0xffff00,
  BLUE: 0x0000ff,
};
