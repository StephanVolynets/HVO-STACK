import { Injectable, Logger } from "@nestjs/common";
import { NotificationPayload } from "../interfaces/notifications.intefaces";
import { EmailProvider } from "../providers/email.provider";
import { DiscordMessage, DiscordProvider } from "../providers/discord.provider";
import { QueueService } from "./queue.service";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { PrismaService } from "src/prisma/src/prisma.service";
// import { getCreatorDiscordChannels } from "../utils/prisma-helpers";
import {
  DISCORD_CHANNEL_NAMES,
  MESSAGE_TEMPLATES,
  NOTIFICATION_TYPES,
  NOTIFICATION_NAME,
  NotificationName,
} from "../constants";
import axios from "axios";

@Injectable()
export class NotificationService {
  private readonly logger: Logger = new Logger(NotificationService.name);
  private readonly clientUrl = process.env.CLIENT_URL;

  constructor(
    @InjectQueue("notifications") private readonly queue: Queue,
    private readonly prisma: PrismaService,
    private readonly emailProvider: EmailProvider,
    private readonly discordProvider: DiscordProvider
  ) {}

  // Single entry point
  // async sendNotification({
  //   name,
  //   channels,
  //   props,
  //   creatorId,
  // }: {
  //   name: NotificationName;
  //   channels: Array<"email" | "discord">;
  //   props: Record<string, any>;
  //   creatorId?: number;
  // }): Promise<void> {
  //   // Send to requested channels
  //   if (channels.includes("email")) {
  //     await this.emailProvider.sendEmail(name, props);
  //   }

  //   if (channels.includes("discord")) {
  //     await this.discordProvider.sendMessage(name, props, creatorId);
  //   }

  //   // Log the notification
  //   this.logger.log(`[NotificationService] Notification sent:`, { name, channels, props });
  // }

  async sendNotification({
    name,
    channels,
    props,
    recipients,
    creatorId,
  }: {
    name: NotificationName;
    channels: Array<"email" | "discord">;
    props: Record<string, any>;
    recipients?: {
      emails?: string[];
      discord?: string | string[];
    };
    creatorId?: number;
  }): Promise<void> {
    try {
      // Handle email notifications
      if (channels.includes("email")) {
        const emailRecipients = recipients?.emails;

        if (!emailRecipients || emailRecipients.length === 0) {
          this.logger.warn(`[NotificationService] No email recipients provided for ${name}`);
        } else {
          // Send to each recipient
          for (const to of emailRecipients) {
            await this.emailProvider.sendEmail(name, { ...props, to });
          }
        }
      }

      // Handle discord notifications
      if (channels.includes("discord")) {
        await this.discordProvider.sendMessageDeprecated(name, props, creatorId);
      }

      // Log the notification
      this.logger.log(`[NotificationService] Notification sent:`, {
        name,
        channels,
        recipientCount: recipients?.emails?.length || 0,
      });
    } catch (error) {
      this.logger.error(`[NotificationService] Error sending notification ${name}:`, error);
      throw error;
    }
  }

  async sendDiscordMessage(message: DiscordMessage): Promise<void> {
    await this.discordProvider.sendMessage(message);
  }

  // private async sendEmail(name: NotificationName, props: Record<string, any>): Promise<void> {
  //   const html = await this.fetchTemplate(name, props);
  //   const subject = NOTIFICATION_NAME[name];

  //   // Send the email
  //   await this.emailProvider.sendEmail(props.to, subject, html);
  // }

  // private async sendDiscord(name: )
  async initializeCreatorDiscordChannels(creatorId: number, creatorUsername: string): Promise<void> {
    await this.discordProvider.createChannelsForCreator(creatorId, creatorUsername);
  }

  async sendDiscordMessageTest(name: NotificationName, props: Record<string, any>, creatorId: number): Promise<void> {
    await this.discordProvider.sendMessageDeprecated(name, props, creatorId);
  }

  // private async fetchTemplate(templateName: NotificationName, props: Record<string, any>): Promise<string> {
  //   try {
  //     const response = await axios.get(`${this.clientUrl}/api/email`, {
  //       params: {
  //         template: templateName,
  //         ...props,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     this.logger.error(`[NotificationService] Error fetching template: ${templateName}`, error.message);
  //     throw error;
  //   }
  // }

  // Transcriptor: Transcription ready
  async notifyStaffTranscriptionReady(videoId: number): Promise<void> {
    // const props = await getStaffTranscriptionReadyProps(this.prisma, videoId, {});
    // if (props) {
    //   // If props are returned, send the notification (there are 2 sources that can trigger this notification, when last one of them is done, this returns props, not null)
    //   const html = await this.fetchTemplate("FINAL_TRANSCRIPT_READY", props);
    //   const subject = `${props.creatorName}: ${props.title}`;
    //   await this.emailProvider.sendEmail(props.to, subject, html);
    // }
  }

  // async adminApprovesVideo(videoTitle: string, videoId: number): Promise<void> {
  //   const props = await getAdminVideoApprovalProps(this.prisma, videoId);

  //   // Email
  //   const html = await this.fetchTemplate("ADMIN_SUBMITTED_TRANSLATIONS", { url: props.url });
  //   const subject = `Dubs ready for ${videoTitle}`;
  //   await this.emailProvider.sendEmail(props.to, subject, html);

  //   // Discord
  // }
}
