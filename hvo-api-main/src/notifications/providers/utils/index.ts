import { Logger } from "@nestjs/common";
import {
  DISCORD_CHANNEL_NAMES,
  DISCORD_DEFAULT_CHANNELS,
  NOTIFICATION_NAME,
  NotificationName,
} from "src/notifications/constants";
import { PrismaService } from "src/prisma/src/prisma.service";

interface DiscordData {
  categoryId: string;
  channels: Record<string, string>;
}

export const getDiscordMessageData = async (
  prismaService: PrismaService,
  logger: Logger,
  creatorId: number,
  notificationName: NotificationName,
  props: Record<string, any>
): Promise<{ message: any; channelId }> => {
  // Fetch the creator's discord channels
  const creator = await prismaService.creator.findUnique({
    where: { id: creatorId },
    select: { discordData: true },
  });

  if (!creator || !creator.discordData) {
    logger.error(`Discord data not found for creator with ID: ${creatorId}`);
    return;
  }

  const discordData = creator.discordData as any as DiscordData;

  // Step 2: Determine the channel ID
  const channelName = getChannelName(notificationName);
  const channelId = discordData.channels[channelName];

  if (!channelId) {
    logger.error(`Channel "${channelName}" not found for creator ID: ${creatorId}`);
    return null;
  }

  // Step 3: Generate the message
  const message = generateMessage(notificationName, props);
  console.log("the message", message);

  return { message, channelId };
};

export const getChannelName = (notificationName: NotificationName): string => {
  switch (notificationName) {
    case "NEW_VIDEO_SUBMISSION_PA":
      return DISCORD_CHANNEL_NAMES.SUBMISSIONS;
    case "STAFF_ASSIGNED_PA":
      return DISCORD_CHANNEL_NAMES.SUBMISSIONS;
    case "SONIX_GENERATING":
      return DISCORD_CHANNEL_NAMES.SUBMISSIONS;
    case "SONIX_COMPLETED":
      return DISCORD_CHANNEL_NAMES.SUBMISSIONS;
    case "MP4_GENERATING":
      return DISCORD_CHANNEL_NAMES.SUBMISSIONS;
    case "MP4_COMPLETED":
      return DISCORD_CHANNEL_NAMES.SUBMISSIONS;
    case "RAW_TRANSCRIPT_READY":
      return DISCORD_CHANNEL_NAMES.TRANSCRIPTION;
    case "FINAL_TRANSCRIPT_READY":
      return DISCORD_CHANNEL_NAMES.TRANSCRIPTION;
    case "FINAL_SCRIPT_SENT_TO_TRANSLATORS":
      return DISCORD_CHANNEL_NAMES.TRANSLATION;
    case "TRANSLATION_READY":
      return DISCORD_CHANNEL_NAMES.TRANSLATION;
    case "TRANSLATION_SENT_TO_VA":
      return DISCORD_CHANNEL_NAMES.RECORDING;
    case "VOICE_OVER_READY":
      return DISCORD_CHANNEL_NAMES.RECORDING;
    case "VOICEOVER_SENT_TO_AE":
      return DISCORD_CHANNEL_NAMES.MIXING;
    case "MIXED_AUDIO_READY_PA":
      return DISCORD_CHANNEL_NAMES.MIXING;
    case "ALL_MIXED_AUDIOS_READY_PA":
      return DISCORD_CHANNEL_NAMES.COMPLETED;
    case "ADMIN_SUBMITTED_TRANSLATIONS":
      return DISCORD_CHANNEL_NAMES.COMPLETED;

    default:
      throw new Error(`Unknown NotificationName: ${notificationName}`);
  }
};

const generateMessage = (notificationName: NotificationName, props: Record<string, any>): any => {
  switch (notificationName) {
    case "NEW_VIDEO_SUBMISSION_PA":
      return {
        color: 0xff0000, // Red
        author: {
          name: "New Video Submission",
        },
        title: props.title || "Untitled Video",
        url: props.boxLink || "#", // Provide a fallback if the link is missing
        description: "Action Required: Assign staff & provide due dates for each stage.",
      };
    case "STAFF_ASSIGNED_PA":
      return {
        color: 0x00ff00, // Green
        author: {
          name: "Staff Assigned",
        },
        title: props.title || "Untitled Video", // Use the video title or provide a fallback
        url: props.link || "#", // Provide a fallback if the link is missing
        description: `
      ${props.language || "Language not specified"}
      
      1. Transcriptor: ${props.transcriptorName || "N/A"} ${props.transcriptorDueDate || ""}
      2. Translator: ${props.translatorName || "N/A"} ${props.translatorDueDate || ""}
      3. Voice Actors: ${props.voiceActorName || "N/A"} ${props.voiceActorDueDate || ""}
      4. Sound Engineer: ${props.soundEngineerName || "N/A"} ${props.soundEngineerDueDate || ""}
      
      Assigned by: ${props.assignedBy || "Unknown"}
    `.trim(),
      };
    case "SONIX_GENERATING":
      return {
        color: 0xffff00, // Yellow
        author: {
          name: "Raw Transcript Generating...",
        },
        title: props.title || "Untitled Video", // Use the video title or provide a fallback
        // url: props.link || "#", // Provide a fallback if the link is missing
        description: "The raw transcript is currently being generated. Please wait for the process to complete.",
      };
    case "SONIX_COMPLETED":
      return {
        color: 0x00ff00, // Green
        author: {
          name: "Raw Transcript Completed.",
        },
        title: props.title || "Untitled Video", // Use the video title or provide a fallback
        url: props.link || "#", // Provide a fallback if the link is missing
        description: `Successfully uploaded to Box.\nLocation: ${props.boxLink || "Link not provided"}`,
      };
    case "ALL_MIXED_AUDIOS_READY_PA":
      return {
        color: 0xff0000,
        author: {
          name: "All Languages Ready",
        },
        title: props.title,
        description: `Action Needed: Provide the translated Title + Description for ${props.languages}`,
      };
    case "ADMIN_SUBMITTED_TRANSLATIONS":
      return {
        color: 0x00ff00,
        author: {
          name: `Video released to ${props.creatorName}`,
        },
        title: props.title,
        url: props.url,
        description: "This video is now marked as completed",
      };
    // case NOTIFICATION_NAME.SONIX_GENERATING:
    //   return `Sonix is generating the transcription for ${props.videoTitle}`;
    // case NOTIFICATION_NAME.SONIX_COMPLETED:
    //   return `Sonix has completed the transcription for ${props.videoTitle}`;
    default:
      throw new Error(`Generate Message - Unknown NotificationName: ${notificationName}`);
  }
};
