import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import FormData from "form-data";
import { Readable } from "stream";
import { SonixService } from "./providers/sonix.service";
import { BoxService } from "src/storage/providers/box.service";
import { NotificationService } from "src/notifications/services/notifications.service";
import { PrismaService } from "src/prisma/src/prisma.service";
import { NotificationDataService } from "src/notifications/services/notifications-data.service";
import { createHmac, timingSafeEqual } from "crypto";
import { TaskStatus } from "@prisma/client";
import { NotificationGeneratorService } from "src/notifications/services/notifications-generator.service";
import { VIDEO_SUBFOLDERS } from "src/storage/constants/storage.constants";
import { DiscordGeneratorService } from "src/notifications/services/discord-generator.service";

@Injectable()
export class TranscriptionService {
  private readonly logger: Logger = new Logger(TranscriptionService.name);
  private readonly webhookSecret: string;

  constructor(
    private readonly transcriptionProvider: SonixService,
    private readonly storageProvider: BoxService,
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
    private readonly notificationsGeneratorService: NotificationGeneratorService,
    private readonly discordGeneratorService: DiscordGeneratorService
  ) {
    this.webhookSecret = process.env.SONIX_WEBHOOK_SECRET;
  }

  // verifyWebhookSignature(signature: string, payload: any): boolean {
  //   const hmac = createHmac("sha256", this.webhookSecret);
  //   const calculatedSignature = hmac.update(JSON.stringify(payload)).digest("hex");
  //   return signature === calculatedSignature;
  // }

  verifyWebhookSignature(signature: string, payload: string): boolean {
    this.logger.log(
      `[Transcription] Verifying webhook signature: ${signature}, ${payload}`
    );
    const calculatedSignature = createHmac("sha256", this.webhookSecret)
      .update(payload)
      .digest("hex");
    this.logger.log(
      `[Transcription] Calculated signature: ${calculatedSignature}`
    );

    const isValid = timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(calculatedSignature)
    );
    this.logger.log(`[Transcription] Is valid: ${isValid}`);
    return isValid;
  }

  async handleWebhookEvent(payload: any) {
    // Check if this is a transcription finished event
    if (payload.event !== "transcription.finished") {
      console.log(
        `[Transcription] Ignoring non-transcription event: ${payload.event}`
      );
      return { status: "ignored" };
    }

    const {
      data: { media_id: mediaId, name: fileName },
    } = payload;

    this.logger.log(`[Transcription] Metadata: ${mediaId} ${fileName}`);
    this.logger.log(`[Transcription] Payload: ${JSON.stringify(payload)}`);

    if (!mediaId || !fileName) {
      throw new BadRequestException(
        "Missing required metadata in webhook payload"
      );
    }

    try {
      console.log(
        `[Transcription] Processing transcription for media ID: ${mediaId}`
      );

      const video = await this.prisma.video.findFirst({
        where: {
          sonixMediaId: mediaId,
        },
        select: {
          root_folder_id: true,
          raw_script_folder_id: true,
          id: true,
        },
      });

      if (!video) {
        throw new BadRequestException("Video not found");
      }

      // Get the transcription in SRT format
      const transcription = await this.transcriptionProvider.getTranscription(
        mediaId,
        "srt"
      );
      // [We received SRT in transcription] SRT text string → Buffer → Readable Stream → Upload to storage

      // Convert the transcription text to a Buffer and then to a Readable stream
      const transcriptionBuffer = Buffer.from(transcription, "utf-8");
      const transcriptionStream = Readable.from(transcriptionBuffer);

      const rawScriptFolderId = video.raw_script_folder_id;

      // Upload the transcription file to storage
      await this.storageProvider.uploadFile(
        rawScriptFolderId,
        transcriptionStream,
        fileName.replace(".mp4", ".srt")
      );

      // Generate folder link
      // const transcriptFolderUrl = await this.storageProvider.generateSharedLink(
      //   rawScriptFolderId,
      //   "open",
      // );

      // Update video status in database
      await this.prisma.video.update({
        where: { id: video.id },
        data: {
          isRawTranscriptReady: true,
          transcriptionTask: {
            update: {
              status: TaskStatus.IN_PROGRESS,
              resources_folder_id: rawScriptFolderId,
            },
          },
        },
      });

      // // Notify transcriptor (raw transcript ready)
      await this.notificationsGeneratorService.sendSonixCompletedNotification(
        video.id
      );
      await this.notificationsGeneratorService.sendRawTranscriptReadyNotification(
        video.id
      );

      await this.discordGeneratorService.sendSonixCompletedNotification(
        video.id
      );
      await this.discordGeneratorService.sendRawTranscriptReadyNotification(
        video.id
      );

      // const { props, recipient } = await this.notificationsDataService.getRawTranscriptReady(
      //   metadata?.videoId,
      //   transcriptFolderUrl
      // );

      // await this.notificationService.sendNotification({
      //   name: "RAW_TRANSCRIPT_READY",
      //   channels: ["email"],
      //   props,
      //   recipients: {
      //     emails: [recipient],
      //   },
      // });

      return { status: "success" };
    } catch (error) {
      // Log the error and potentially retry
      console.error("Error processing webhook:", error);
      throw error;
    }
  }

  // -------------- OLD --------------

  async startTranscriptionProcessDeprecated(
    videoFileId: string,
    rawScriptFolderId: string
  ): Promise<void> {
    // Step 1: Download video file
    const transcriptionSourceFile = await this.storageProvider.downloadFile(
      videoFileId
    );

    // Step 2: Upload to Sonix for transcription
    let mediaId = await this.transcriptionProvider.uploadMedia(
      transcriptionSourceFile.file,
      transcriptionSourceFile.name
    );

    // Step 3: Poll for transcription completion
    let checkData = await this.transcriptionProvider.checkTranscriptionStatus(
      mediaId
    );
    let status = checkData.status;
    while (status !== "completed" && status !== "duplicate") {
      if (status === "failed") {
        throw new Error(`Transcription failed for media ID: ${mediaId}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
      checkData = await this.transcriptionProvider.checkTranscriptionStatus(
        mediaId
      );
      status = checkData.status;
    }

    // Step 4: Retrieve transcription in SRT format
    if (status === "duplicate") {
      mediaId = checkData.duplicate_media_id;
    }
    const transcription = await this.transcriptionProvider.getTranscription(
      mediaId,
      "srt"
    );

    // if (!transcription) {
    //   throw new Error(`Transcription not available for media: ${mediaId}`);
    // }

    // Step 5: Convert the transcription text to a Buffer and then to a Readable stream
    const transcriptionBuffer = Buffer.from(transcription, "utf-8");
    const transcriptionStream = Readable.from(transcriptionBuffer);

    // Step 6: Upload the transcription file
    const originalName = transcriptionSourceFile.name;
    const newName = originalName.replace(/\.[^/.]+$/, ".srt");
    await this.storageProvider.uploadFile(
      rawScriptFolderId,
      transcriptionStream,
      newName
    );
  }

  async uploadedToSonix(videoId: number, payload: { mediaId: string }) {
    this.logger.log(
      `[Transcription] Uploaded to Sonix: ${videoId} with mediaId: ${payload.mediaId}`
    );

    try {
      await this.prisma.video.update({
        where: { id: videoId },
        data: {
          sonixMediaId: payload.mediaId,
        },
      });

      await this.notificationsGeneratorService.sendSonixGeneratingNotification(
        videoId
      );
      await this.discordGeneratorService.sendSonixGeneratingNotification(
        videoId
      );
    } catch (error) {
      this.logger.error(`[Transcription] Error updating video: ${error}`);
      throw error;
    }
  }

  async startTranscriptionProcess(
    videoId: number,
    mediaId: string,
    rawScriptFolderId: string,
    fileName: string
  ): Promise<void> {
    // Step 3: Poll for transcription completion
    let checkData = await this.transcriptionProvider.checkTranscriptionStatus(
      mediaId
    );
    let status = checkData.status;
    while (status !== "completed" && status !== "duplicate") {
      if (status === "failed") {
        throw new Error(`Transcription failed for media ID: ${mediaId}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
      checkData = await this.transcriptionProvider.checkTranscriptionStatus(
        mediaId
      );
      status = checkData.status;
    }

    // Step 4: Retrieve transcription in SRT format
    if (status === "duplicate") {
      mediaId = checkData.duplicate_media_id;
    }
    const transcription = await this.transcriptionProvider.getTranscription(
      mediaId,
      "srt"
    );

    // if (!transcription) {
    //   throw new Error(`Transcription not available for media: ${mediaId}`);
    // }

    // Step 5: Convert the transcription text to a Buffer and then to a Readable stream
    const transcriptionBuffer = Buffer.from(transcription, "utf-8");
    const transcriptionStream = Readable.from(transcriptionBuffer);

    // Step 6: Upload the transcription file
    this.storageProvider.uploadFile(
      rawScriptFolderId,
      transcriptionStream,
      fileName
    );

    // Step 7: Generate folder link
    const transcriptFolderUrl = await this.storageProvider.generateSharedLink(
      rawScriptFolderId,
      "open",
      24 * 35
    );

    // Get video
    const video = await this.prisma.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        id: true,
        creator: {
          select: {
            username: true,
          },
        },
      },
    });

    // Transcritpor: Send notification to staff
    // await this.notificationService.notifyStaffTranscriptionReady(video.id);

    // ---

    // Notify Production Assistant (Sonix completed)
    // Sonix Completed Notificaiton
    // const sonixCompletedPropsPA = await this.notificationsDataService.getSonixCompletedPA(videoId, transcriptFolderUrl);
    // await this.notificationService.sendNotification({
    //   name: "SONIX_COMPLETED",
    //   channels: ["email"],
    //   props: sonixCompletedPropsPA,
    // });

    // // Notify transcriptor (raw transcript ready)
    // const transcriptorProps = await this.notificationsDataService.getRawTranscriptReady(videoId, transcriptFolderUrl);
    // await this.notificationService.sendNotification({
    //   name: "RAW_TRANSCRIPT_READY",
    //   channels: ["email"],
    //   props: transcriptorProps,
    // });

    // // Notify Production Assistant (raw transcript sent)
    // const productionAssistantProps = await this.notificationsDataService.getRawTranscriptSentPA(videoId);
    // await this.notificationService.sendNotification({
    //   name: "RAW_TRANSCRIPT_READY_PA",
    //   channels: ["email"],
    //   props: productionAssistantProps,
    // });
  }
}
