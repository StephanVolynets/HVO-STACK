import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/src/prisma.service";
import { TaskType, AudioDubStatus, TaskStatus } from "@prisma/client";
import { NotificationService } from "./notifications.service";
import { BoxService } from "src/storage/providers/box.service";
import { VIDEO_SUBFOLDERS } from "src/storage/constants/storage.constants";
import {
  DISCORD_COLORS,
  NOTIFICATION_NAME,
  NotificationName,
} from "../constants";
import { AuthService } from "src/auth/auth.service";
import { DiscordData, DiscordMessage } from "../providers/discord.provider";
import { getChannelName } from "../providers/utils";
import { formatDate } from "src/helpers/misc";

@Injectable()
export class DiscordGeneratorService {
  private readonly logger: Logger = new Logger(DiscordGeneratorService.name);
  private readonly clientUrl = process.env.CLIENT_URL;
  private readonly staffClientUrl = process.env.STAFF_CLIENT_URL;
  private readonly paEmail = process.env.EMAIL_PA;

  constructor(
    private readonly prisma: PrismaService,
    private readonly boxProvider: BoxService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService
  ) {}

  private getTaskLink = async (taskId: number, userId: number) => {
    const token = await this.authService.getOrCreateJWT(userId);
    return `${this.staffClientUrl}/dashboard/staff/tasks?taskId=${taskId}&token=${token}`;
  };

  private getVideoUrl = async (videoId: number) => {
    return `${this.clientUrl}/dashboard/creator/library/video/${videoId}`;
  };

  private getChannelId = async (
    discordData: DiscordData,
    notificationName: NotificationName
  ) => {
    const channelName = getChannelName(notificationName);
    const channelId = discordData.channels[channelName];

    return channelId;
  };

  // ---------- Start of Discord notifications ----------

  async sendNewVideoSubmissionNotification(videoId: number) {
    this.logger.log(
      `[Discord Notification] Sending new video submission notification for video ${videoId}`
    );
    try {
      const video = await this.prisma.video.findUnique({
        where: {
          id: videoId,
        },
        select: {
          title: true,
          creator: {
            select: {
              id: true,
              username: true,
              discordData: true,
            },
          },
        },
      });

      const discordData = video.creator.discordData as any as DiscordData;

      // Determine the channel ID
      const channelId = await this.getChannelId(
        discordData,
        "NEW_VIDEO_SUBMISSION_PA"
      );

      // Get data
      const url = await this.getVideoUrl(videoId);
      const title = video.title;

      const message: DiscordMessage = {
        color: DISCORD_COLORS.RED,
        author: {
          name: "New Video Submission",
        },
        title: title,
        url,
        description:
          "Action Required: Assign staff & provide due dates for each stage.",
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending new video submission notification for video ${videoId}: ${error}`
      );
    }
  }

  async sendStaffAssignedNotification(taskId: number) {
    // TODO: Implement this
  }

  async sendSonixGeneratingNotification(videoId: number) {
    this.logger.log(
      `[Discord Notification] Sending sonix generating notification for video ${videoId}`
    );

    try {
      const video = await this.prisma.video.findUnique({
        where: {
          id: videoId,
        },
        select: {
          title: true,
          creator: {
            select: {
              id: true,
              username: true,
              discordData: true,
            },
          },
        },
      });

      const discordData = video.creator.discordData as any as DiscordData;

      // Determine the channel ID
      const channelId = await this.getChannelId(
        discordData,
        "SONIX_GENERATING"
      );

      // Get data
      const url = await this.getVideoUrl(videoId);
      const title = video.title;

      const message: DiscordMessage = {
        color: DISCORD_COLORS.YELLOW,
        author: {
          name: "Raw Transcript Generating...",
        },
        title: title,
        url,
        description: "No Action Required.",
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending sonix generating notification for video ${videoId}: ${error}`
      );
    }
  }

  async sendSonixCompletedNotification(videoId: number) {
    this.logger.log(
      `[Discord Notification] Sending sonix completed notification for video ${videoId}`
    );

    try {
      const video = await this.prisma.video.findUnique({
        where: {
          id: videoId,
        },
        select: {
          title: true,
          root_folder_id: true,
          raw_script_folder_id: true,
          creator: {
            select: {
              id: true,
              username: true,
              discordData: true,
            },
          },
        },
      });

      const discordData = video.creator.discordData as any as DiscordData;

      // Determine the channel ID
      const channelId = await this.getChannelId(discordData, "SONIX_COMPLETED");

      // Get data
      const url = await this.getVideoUrl(videoId);
      const title = video.title;

      const fileId = await this.boxProvider
        .getFileByName(video.raw_script_folder_id, `${video.title}.srt`)
        .then((file) => file.id);

      const boxLink = await this.boxProvider.generateDownloadUrl(fileId);

      const message: DiscordMessage = {
        color: DISCORD_COLORS.GREEN,
        author: {
          name: "Raw Transcript Completed.",
        },
        title: title,
        url,
        description: `Successfully uploaded to Box. \n Location: ${boxLink}`,
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending sonix completed notification for video ${videoId}: ${error}`
      );
    }
  }

  async sendMP4GeneratingNotification(videoId: number) {
    this.logger.log(
      `[Discord Notification] Sending mp4 generating notification for video ${videoId}`
    );

    try {
      const video = await this.prisma.video.findUnique({
        where: {
          id: videoId,
        },
        select: {
          title: true,
          creator: {
            select: {
              id: true,
              username: true,
              discordData: true,
            },
          },
        },
      });

      const discordData = video.creator.discordData as any as DiscordData;

      // Determine the channel ID
      const channelId = await this.getChannelId(discordData, "MP4_GENERATING");

      // Get data
      const url = await this.getVideoUrl(videoId);
      const title = video.title;

      const message: DiscordMessage = {
        color: DISCORD_COLORS.YELLOW,
        author: {
          name: "Generating optimized MP4...",
        },
        title: title,
        url,
        description: "No Action Required.",
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending mp4 generating notification for video ${videoId}: ${error}`
      );
    }
  }

  async sendMP4CompletedNotification(videoId: number) {
    this.logger.log(
      `[Discord Notification] Sending mp4 completed notification for video ${videoId}`
    );

    try {
      const video = await this.prisma.video.findUnique({
        where: {
          id: videoId,
        },
        select: {
          title: true,
          root_folder_id: true,
          mp4_folder_id: true,
          creator: {
            select: {
              id: true,
              username: true,
              discordData: true,
            },
          },
        },
      });

      const discordData = video.creator.discordData as any as DiscordData;

      // Determine the channel ID
      const channelId = await this.getChannelId(discordData, "MP4_COMPLETED");

      // Get data
      const url = await this.getVideoUrl(videoId);
      const title = video.title;

      const sourceFilesLink = await this.boxProvider.generateSharedLink(
        video.mp4_folder_id,
        "open"
      );

      const message: DiscordMessage = {
        color: DISCORD_COLORS.GREEN,
        author: {
          name: "Optimized MP4 Completed.",
        },
        title: title,
        url,
        description: `Successfully uploaded to Box. \n Location: ${sourceFilesLink}`,
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending mp4 completed notification for video ${videoId}: ${error}`
      );
    }
  }

  async sendRawTranscriptReadyNotification(videoId: number) {
    this.logger.log(
      `[Discord Notification] Sending raw transcript ready notification for video ${videoId}`
    );

    try {
      const video = await this.prisma.video.findUnique({
        where: {
          id: +videoId,
        },
        select: {
          isRawTranscriptReady: true,
          raw_script_folder_id: true,
          transcriptionTask: {
            select: {
              id: true,
              resources_folder_id: true,
              expected_delivery_date: true,
              staffs: {
                select: {
                  staff: {
                    select: {
                      user: {
                        select: { id: true, email: true, full_name: true },
                      },
                    },
                  },
                },
              },
            },
          },
          title: true,
          root_folder_id: true,
          creator: {
            select: {
              username: true,
              discordData: true,
            },
          },
        },
      });

      // For this notifications we need 2 conditions:
      // 1. Staff is assigned to the transcription task
      // 2. Sonix is done with the transcription
      if (
        !video.isRawTranscriptReady ||
        video.transcriptionTask.staffs.length === 0
      ) {
        this.logger.log(
          `Raw transcript is not ready for video ${videoId}. Conditions: IsRawTranscriptReady: ${video.isRawTranscriptReady} Staffs: ${video.transcriptionTask.staffs.length}`
        );
        return;
      }

      const discordData = video.creator.discordData as any as DiscordData;

      const title = video.title;
      const transcriptorName =
        video.transcriptionTask.staffs[0].staff.user.full_name;
      const dueDate = formatDate(
        video.transcriptionTask.expected_delivery_date
      );

      const videoLink = await this.getVideoUrl(videoId);

      // Determine the channel ID
      const channelId = await this.getChannelId(
        discordData,
        "RAW_TRANSCRIPT_READY"
      );

      const message: DiscordMessage = {
        color: DISCORD_COLORS.YELLOW,
        author: {
          name: "Material sent",
        },
        title,
        url: videoLink,
        description: `${transcriptorName} has been sent the raw transcript. \n Expected delivery: ${dueDate}`,
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending raw transcript ready notification for video ${videoId}: ${error}`
      );
    }
  }

  // Transcriptor Uploads
  async sendTranscriptionUploadedNotification(taskId: number) {
    this.logger.log(
      `[Discord Notification] Sending transcription uploaded notification for task ${taskId}`
    );

    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: taskId,
        },
        select: {
          video: {
            select: {
              id: true,
              title: true,
              creator: { select: { id: true, discordData: true } },
            },
          },
          staffs: {
            select: {
              staff: {
                select: { user: { select: { email: true, full_name: true } } },
              },
            },
          },
        },
      });

      const discordData = task.video.creator.discordData as any as DiscordData;

      const channelId = await this.getChannelId(
        discordData,
        "FINAL_TRANSCRIPT_READY"
      );

      const title = task.video.title;
      const url = await this.getVideoUrl(task.video.id);
      const transcriptorName = task.staffs[0].staff.user.full_name;

      const message: DiscordMessage = {
        color: DISCORD_COLORS.GREEN,
        author: {
          name: "Material Uploaded",
        },
        title: title,
        url,
        description: `${transcriptorName} has uploaded the material.`,
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {}
  }

  async sendFinalTranscriptReadyNotification({
    creatorId,
    videoId,
    videoTitle,
    translatorName,
    language,
    dueDate,
  }: {
    creatorId: number;
    videoId: number;
    videoTitle: string;
    translatorName: string;
    language: string;
    dueDate: string;
  }) {
    // Sent to Translators. Called by Email Notification.
    this.logger.log(
      `[Discord Notification] Sending final transcript ready notification for video ${videoId}, ${videoTitle}, ${translatorName}, ${dueDate}`
    );

    try {
      const creator = await this.prisma.creator.findUnique({
        where: {
          id: creatorId,
        },
        select: {
          discordData: true,
        },
      });

      const discordData = creator.discordData as any as DiscordData;

      // Determine the channel ID
      const channelId = await this.getChannelId(
        discordData,
        "FINAL_SCRIPT_SENT_TO_TRANSLATORS"
      );

      const url = await this.getVideoUrl(videoId);

      const message: DiscordMessage = {
        color: DISCORD_COLORS.YELLOW,
        author: {
          name: "Material Sent",
        },
        title: videoTitle,
        url,
        description: `${translatorName} for ${language} has been sent the English script. \n Expected delivery: ${dueDate}`,
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending final transcript ready notification for video ${videoId}: ${error}`
      );
    }
  }

  // Translator Uploads
  async sendTranslationUploadedNotification({
    creatorId,
    videoId,
    videoTitle,
    translatorName,
    language,
  }: {
    creatorId: number;
    videoId: number;
    videoTitle: string;
    translatorName: string;
    language: string;
  }) {
    // Called by Email Notification
    this.logger.log(
      `[Discord Notification] Sending translation uploaded notification for video ${videoId}, ${videoTitle}, ${translatorName}, ${language}`
    );

    try {
      const creator = await this.prisma.creator.findUnique({
        where: {
          id: creatorId,
        },
        select: {
          discordData: true,
        },
      });

      const discordData = creator.discordData as any as DiscordData;

      // Determine the channel ID
      const channelId = await this.getChannelId(
        discordData,
        "TRANSLATION_READY"
      );

      const url = await this.getVideoUrl(videoId);

      const message: DiscordMessage = {
        color: DISCORD_COLORS.GREEN,
        author: {
          name: "Material Uploaded",
        },
        title: videoTitle,
        url,
        description: `${translatorName} has delivered the final ${language} script.`,
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending translation uploaded notification for video ${videoTitle} - ${videoId}: ${error}`
      );
    }
  }

  async sendTranslationReadyNotification({
    creatorId,
    videoId,
    videoTitle,
    actorName,
    language,
    dueDate,
  }: {
    creatorId: number;
    videoId: number;
    videoTitle: string;
    actorName: string;
    language: string;
    dueDate: string;
  }) {
    // Sent to Voice Over Artist. Called by Email Notification [sendTranslationReadyNotification].
    this.logger.log(
      `[Discord Notification] Sending translation ready notification for video ${videoId}, ${videoTitle}, ${actorName}, ${language}, ${dueDate}`
    );

    try {
      const creator = await this.prisma.creator.findUnique({
        where: {
          id: creatorId,
        },
        select: {
          discordData: true,
        },
      });

      const discordData = creator.discordData as any as DiscordData;

      // Determine the channel ID
      const channelId = await this.getChannelId(
        discordData,
        "TRANSLATION_SENT_TO_VA"
      );

      const url = await this.getVideoUrl(videoId);

      const message: DiscordMessage = {
        color: DISCORD_COLORS.YELLOW,
        author: {
          name: "Material Sent",
        },
        title: videoTitle,
        url,
        description: `${actorName} has been sent the ${language} script + source files.\n Expected delivery: ${dueDate}`,
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending translation ready notification for video ${videoTitle} - ${videoId}: ${error}`
      );
    }
  }

  // Voice Over Artist Uploads
  async sendVoiceOverUploadedNotification({
    creatorId,
    videoId,
    videoTitle,
    actorName,
    language,
  }: {
    creatorId: number;
    videoId: number;
    videoTitle: string;
    actorName: string;
    language: string;
  }) {
    // Called by Email Notification [sendVoiceOverUploadedPANotification]
    this.logger.log(
      `[Discord Notification] Sending voice over uploaded notification for video ${videoId}, ${videoTitle}, ${actorName}, ${language}`
    );

    try {
      const creator = await this.prisma.creator.findUnique({
        where: {
          id: creatorId,
        },
        select: {
          discordData: true,
        },
      });

      const discordData = creator.discordData as any as DiscordData;

      // Determine the channel ID
      const channelId = await this.getChannelId(
        discordData,
        "VOICE_OVER_READY"
      );

      const url = await this.getVideoUrl(videoId);

      const message: DiscordMessage = {
        color: DISCORD_COLORS.GREEN,
        author: {
          name: "Material Uploaded",
        },
        title: videoTitle,
        url,
        description: `${actorName} has delivered the raw ${language} audio.`,
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending voice over uploaded notification for video ${videoTitle} - ${videoId}: ${error}`
      );
    }
  }

  async sendVoiceOverReadyNotification({
    creatorId,
    videoId,
    videoTitle,
    engineerName,
    language,
    dueDate,
  }: {
    creatorId: number;
    videoId: number;
    videoTitle: string;
    engineerName: string;
    language: string;
    dueDate: string;
  }) {
    // Called by Email Notification [sendVoiceOverReadyNotification]
    this.logger.log(
      `[Discord Notification] Sending voice over ready notification for video ${videoId}, ${videoTitle}, ${engineerName}, ${language}, ${dueDate}`
    );

    try {
      const creator = await this.prisma.creator.findUnique({
        where: {
          id: creatorId,
        },
        select: {
          discordData: true,
        },
      });

      const discordData = creator.discordData as any as DiscordData;

      // Determine the channel ID
      const channelId = await this.getChannelId(
        discordData,
        "VOICEOVER_SENT_TO_AE"
      );

      const url = await this.getVideoUrl(videoId);

      const message: DiscordMessage = {
        color: DISCORD_COLORS.YELLOW,
        author: {
          name: "Material Sent",
        },
        title: videoTitle,
        url,
        description: `${engineerName} has been sent the raw audio + source files for ${language}. \n Expected delivery: ${dueDate}`,
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending voice over ready notification for video ${videoTitle} - ${videoId}: ${error}`
      );
    }
  }

  // Audio Engineering Uploads
  async sendAudioEngineeringUploadedNotification({
    creatorId,
    videoId,
    videoTitle,
    engineerName,
    language,
  }: {
    creatorId: number;
    videoId: number;
    videoTitle: string;
    engineerName: string;
    language: string;
  }) {
    // Called by Email Notification [sendAudioEngineeringReadyPANotification]
    this.logger.log(
      `[Discord Notification] Sending audio engineering uploaded notification for video ${videoId}, ${videoTitle}, ${engineerName}, ${language}`
    );

    try {
      const creator = await this.prisma.creator.findUnique({
        where: {
          id: creatorId,
        },
        select: {
          discordData: true,
        },
      });

      const discordData = creator.discordData as any as DiscordData;

      // Determine the channel ID
      const channelId = await this.getChannelId(
        discordData,
        "MIXED_AUDIO_READY_PA"
      );

      const url = await this.getVideoUrl(videoId);

      const message: DiscordMessage = {
        color: DISCORD_COLORS.GREEN,
        author: {
          name: "Material Uploaded",
        },
        title: videoTitle,
        url,
        description: `${engineerName} has delivered the final raw + mixed ${language} audio.`,
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending audio engineering uploaded notification for video ${videoTitle} - ${videoId}: ${error}`
      );
    }
  }

  // Other Notifications
  async sendAllMixedAudioReadyNotification({
    creatorId,
    videoId,
    videoTitle,
    languages,
  }: {
    creatorId: number;
    videoId: number;
    videoTitle: string;
    languages: string;
  }) {
    this.logger.log(
      `[Discord Notification] Sending all mixed audio ready notification for video ${videoId}, ${videoTitle}, ${languages}`
    );

    try {
      const creator = await this.prisma.creator.findUnique({
        where: {
          id: creatorId,
        },
        select: {
          discordData: true,
        },
      });

      const discordData = creator.discordData as any as DiscordData;

      // Determine the channel ID
      const channelId = await this.getChannelId(
        discordData,
        "ALL_MIXED_AUDIOS_READY_PA"
      );

      const url = await this.getVideoUrl(videoId);

      const message: DiscordMessage = {
        color: DISCORD_COLORS.RED,
        author: {
          name: "All Languages Ready",
        },
        title: videoTitle,
        url,
        description: `Action Needed: Provide the translated Title + Description for ${languages}.`,
        channelId,
      };

      // Send message
      await this.notificationService.sendDiscordMessage(message);
    } catch (error) {
      this.logger.error(
        `[Discord Notification] Error sending all mixed audio ready notification for video ${videoTitle} - ${videoId}: ${error}`
      );
    }
  }
}
