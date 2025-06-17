import { Injectable, Logger } from "@nestjs/common";
import { NotificationPayload } from "../interfaces/notifications.intefaces";
import { EmailProvider } from "../providers/email.provider";
import { DiscordProvider } from "../providers/discord.provider";
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
import { getCreatorDiscordData } from "../utils/prisma-helpers";

@Injectable()
export class NotificationService {
  private readonly logger: Logger = new Logger(NotificationService.name);

  constructor(@InjectQueue("notifications") private readonly queue: Queue, private readonly prisma: PrismaService) {}

  // Single entry point
  async sendNotification({
    name,
    channels,
    props,
  }: {
    name: NotificationName;
    channels: Array<"email" | "discord">;
    props: Record<string, any>;
  }): Promise<void> {
    // Iterate over the channels and add jobs for each
    console.log("Test notifs doen");

    for (const channel of channels) {
      await this.queue.add(channel, {
        name,
        props,
      });
    }

    console.log("Test STUCK doen");
    // Log the notification
    this.logger.log(`[NotificationService] Queued notification:`, { name, channels, props });
  }

  async mapAndSendNotification(payload: any): Promise<void> {
    // Fetch the creator's discord_channels from the database
    const discordChannels = await getCreatorDiscordData(this.prisma, payload.creatorId);

    // let notificationType: string;
    let notificationType = payload.event as keyof typeof NOTIFICATION_TYPES;
    let message: string;
    let emailData: any;
    let discordData: any;

    // Now, map the notification type and channel dynamically based on the event
    switch (notificationType) {
      case NOTIFICATION_TYPES.VIDEO_SUBMISSION:
        // notificationType = NOTIFICATION_TYPES.VIDEO_SUBMISSION;
        message = MESSAGE_TEMPLATES[NOTIFICATION_TYPES.VIDEO_SUBMISSION];
        discordData = {
          channelId: discordChannels[DISCORD_CHANNEL_NAMES.SUBMISSIONS],
          message: message,
        };
        break;

      // case NOTIFICATION_TYPES.STAFF_ASSIGNMENT:
      //   // Discord
      //   notificationType = NOTIFICATION_TYPES.STAFF_ASSIGNMENT;
      //   message = MESSAGE_TEMPLATES[NOTIFICATION_TYPES.STAFF_ASSIGNMENT];
      //   discordData = {
      //     channelId: discordChannels[DISCORD_CHANNEL_NAMES.SUBMISSIONS]
      //     message: message,
      //   };
      //   break;

      // case NOTIFICATION_TYPES.TRANSCRIPTION_READY:
      //   // Email + Discord
      //   notificationType = NOTIFICATION_TYPES.TRANSCRIPTION_READY;
      //   message = MESSAGE_TEMPLATES[NOTIFICATION_TYPES.TRANSCRIPTION_READY];
      //   discordData = {
      //     channelId: discordChannels[DISCORD_CHANNEL_NAMES.SUBMISSIONS],
      //     message: message,
      //   };
      //   emailData = {
      //     to: payload.transcriptorEmail,
      //     subject: EMAIL_TEMPLATES.RAW_TRANSCRIPTION_READY,
      //     text: message,
      //   };
      //   break;

      default:
        throw new Error("Unknown event type");
    }

    // Save to database (you can add your logic here)
    await this.saveNotificationToDatabase(payload, notificationType, message);

    // Send to the appropriate providers
    if (discordData) {
      await this.queue.add("discord", discordData);
    }

    if (emailData) {
      await this.queue.add("email", emailData);
    }
  }

  private async saveNotificationToDatabase(payload: any, notificationType: string, message: string) {
    // await this.prisma.notification.create({
    //   data: {
    //     type: notificationType,
    //     message: message,
    //     payload: payload,
    //     // other fields you may need (e.g., creator id, video id, etc.)
    //   },
    // });
  }

  async createAndSendNotification(payload: NotificationPayload): Promise<void> {
    // EMAIL
    if (payload.email) {
      await this.queue.add("email", {
        to: payload.metadata?.to || "default@example.com", // Default email if not provided
        subject: payload.metadata?.subject || "Notification", // Default subject
        text: payload.message,
      });
    }

    // DISCORD
    if (payload.discord) {
      // Add job for discord notification to the queue
      await this.queue.add("discord", {
        channelId: payload.metadata?.channelId || "default-channel-id", // Default channel if not provided
        message: payload.message,
      });
    }
  }
}
