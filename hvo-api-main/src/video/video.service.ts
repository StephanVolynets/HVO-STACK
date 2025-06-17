import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import {
  AddVideoDTO,
  ApproveDubDto,
  ApproveFeedbackDTO,
  AudioDubProgress,
  AudioDubStatus,
  CreateVideoDTO,
  FeedbackDTO,
  FeedbackPhase,
  InboxAudioDubDTO,
  InboxVideoDTO,
  // InitializeVideoUploadInputDTO,
  InitiateVideoUploadInputDTO,
  InitiateVideoUploadOutputDTO,
  LibraryAudioDubDTO,
  LibraryTaskDTO,
  LibraryVideoDTO,
  PreviewAudioDubDTO,
  StaffDTO,
  StaffType,
  SubmitFeedbackDTO,
  TaskDTO,
  TASKS,
  VideoPreviewDTO,
  VideoPreviewMediaDTO,
  VideoProcessingIssueDTO,
  VideoProcessingIssueStatus,
  VideoStatus,
  YoutubeChannelBasicDTO,
  FormType,
  ShareVideoDTO,
} from "hvo-shared";
import { get } from "lodash";
import { PrismaService } from "src/prisma/src/prisma.service";
import {
  generateLanguages,
  getEnumTaskType,
  getThumbnailUrl,
  getTimePeriodFilter,
  renameVideoInGCS,
  sendNotificationAfterFeedbackApproved,
  typeOrder,
} from "./utils/utils";

import {
  AudioDubPhase,
  FeedbackIssueStatus,
  FeedbackStatus,
  TaskStatus,
  TaskType,
} from "@prisma/client";
import { StorageService } from "src/storage/storage.service";
import {
  getCreatorLanguageIds,
  getTasksTypesForUpdate,
} from "./utils/prisma-utils";
import { getCreatorUsername } from "src/helpers/prisma-utils/prisma-creator-utils";
import { v4 as uuidv4 } from "uuid";
import { readFile } from "fs/promises";

import { Storage } from "@google-cloud/storage";
import { credential, ServiceAccount } from "firebase-admin";
import { PubSub } from "@google-cloud/pubsub";
import { PubSubService } from "src/other-modules/pubsub/pubsub.service";
import { fromAudioDubPhaseToTaskType } from "src/helpers/prisma-transformers";
import axios from "axios";
import { NotificationGeneratorService } from "src/notifications/services/notifications-generator.service";
import { DiscordGeneratorService } from "src/notifications/services/discord-generator.service";
import { VIDEO_SUBFOLDERS } from "src/storage/constants/storage.constants";
import { BoxService } from "src/storage/providers/box.service";
import e from "express";
import * as XLSX from "xlsx";
import { Workbook } from "exceljs";
import { utils } from "xlsx";
import { ZipDownloadRequest } from "box-typescript-sdk-gen/lib/schemas/zipDownloadRequest.generated";
import { NotificationService } from "src/notifications/services/notifications.service";
import { randomBytes } from "crypto";
import { NotificationName } from "src/notifications/constants";
import { Worker } from "worker_threads";
import * as path from "path";

// Define the missing interface
interface ZipDownloadRequestItem {
  id: string;
  type: "file" | "folder";
}

interface BulkUploadRow {
  creatorId: string;
  title: string;
  description: string;
  videoUrl: string;
  soundtrackUrl: string;
  formType?: FormType;
  expectedBy?: string;
  channelId?: string; // This is actually the channel name in the Excel
}

@Injectable()
export class VideoService {
  private storage = new Storage();
  private readonly logger: Logger = new Logger(VideoService.name);
  private readonly BUCKET_NAME = process.env.STORAGE_BUCKET;
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly storageService: StorageService,
    protected readonly pubsubService: PubSubService,
    protected readonly notificationGeneratorService: NotificationGeneratorService,
    protected readonly discordGeneratorService: DiscordGeneratorService,
    protected readonly boxService: BoxService,
    protected readonly notificationService: NotificationService
  ) {
    this.initStorage();
  }

  async initStorage() {
    const APP_ENV = process.env.APP_ENV;
    const readServiceAccount = async () =>
      JSON.parse(await readFile("service-account-dev.json", "utf8"));
    const serviceAccount =
      APP_ENV === "local" ? await readServiceAccount() : null;

    this.storage = new Storage({
      credentials: serviceAccount,
    });
  }

  async getYoutubeChannels(
    creatorId: string
  ): Promise<YoutubeChannelBasicDTO[]> {
    const youtubeChannels = await this.prisma.youtubeChannel.findMany({
      where: {
        creator: {
          user: {
            email: creatorId,
          },
        },
      },
      select: {
        id: true,
        title: true,
      },
    });

    const youtubeChannelsDTO: YoutubeChannelBasicDTO[] = youtubeChannels.map(
      (channel) => ({
        id: channel.id,
        title: channel.title,
      })
    );

    return youtubeChannelsDTO;
  }

  async initiateVideoSubmission(
    input: InitiateVideoUploadInputDTO
  ): Promise<InitiateVideoUploadOutputDTO> {
    const { creatorId } = input;
    this.logger.log(`Initiating video upload for creator: ${creatorId}`);

    const creatorUsername = await getCreatorUsername(this.prisma, creatorId);

    const sessionId = `session-${uuidv4()}`;
    const baseFolderPath = `videos/${creatorUsername}/${sessionId}/`;

    // Create folders
    const folders = ["raw/", "compressed/", "me-audio/"];
    await Promise.all(
      folders.map((folder) =>
        this.storage
          .bucket(this.BUCKET_NAME)
          .file(baseFolderPath + folder)
          .save("")
      )
    );

    // Generate signed URLs for uploading raw video and m&e audio
    const rawVideoPath = `${baseFolderPath}raw/video.mp4`;
    const meAudioPath = `${baseFolderPath}me-audio/audio.wav`;

    const [videoUrl] = await this.storage
      .bucket(this.BUCKET_NAME)
      .file(rawVideoPath)
      .getSignedUrl({
        action: "write",
        expires: Date.now() + 360 * 60 * 1000, // 6 hours
        contentType: "video/mp4",
        // contentType: undefined,
      });

    const [meAudioUrl] = await this.storage
      .bucket(this.BUCKET_NAME)
      .file(meAudioPath)
      .getSignedUrl({
        action: "write",
        expires: Date.now() + 360 * 60 * 1000, // 6 hours
        contentType: "audio/wav",
        // contentType: undefined,
      });

    this.logger.log(
      `Session ID: ${sessionId} created for creator: ${creatorUsername}`
    );
    const output: InitiateVideoUploadOutputDTO = {
      sessionId,
      uploadUrls: {
        video: videoUrl,
        meAudio: meAudioUrl,
      },
    };

    return output;
  }

  async finalizeVideoSubmission(addVideoDTO: AddVideoDTO, creatorId: string) {
    this.logger.log(
      `Finalizing video upload for ${addVideoDTO.title} by creator: ${creatorId}`
    );

    const videoIsExternal = addVideoDTO.video_file_id.startsWith("http");
    const audioIsExternal = addVideoDTO.soundtrack_file_id.startsWith("http");
    const audioExists = addVideoDTO.soundtrack_file_id !== "";

    try {
      // TODO: Remove this (we will pass creatorId instead of email)
      const creator = await this.prisma.creator.findFirst({
        where: {
          user: {
            email: creatorId,
          },
        },
      });

      // Create the video
      const video = await this.prisma.video.create({
        data: {
          title: addVideoDTO.title,
          description: addVideoDTO.description,
          expected_by: addVideoDTO.expected_by,
          form_type: addVideoDTO.form_type,
          creator: {
            connect: { id: creator.id },
          },
          ...(addVideoDTO.youtubeChannelId && {
            youtubeChannel: {
              connect: { id: +addVideoDTO.youtubeChannelId },
            },
          }),
          isVideoResourceUploaded: !videoIsExternal,
          isAudioResourceUploaded: !audioIsExternal && audioExists,
        },
        include: {
          creator: true,
        },
      });

      // Remove this
      this.logger.log("Finding languages for creator: ", creatorId);
      const languageIds = await getCreatorLanguageIds(this.prisma, creator.id);

      const {
        videoFolderId,
        deliverablesFolderId,
        internalFilesFolderId,
        rawScriptFolderId,
        languagesWithFolderIds,
        rawAudioFolderId,
        mp4FolderId,
        mAndEFolderId,
        englishTranscriptFolderId,
      } = await this.storageService.finalizeVideoUpload({
        videoTitle: video.title,
        creatorId,
        session_folder_id: "",
        video_file_id: "",
        soundtrack_file_id: "",
      });

      // Update the video with the root folder ID
      await this.prisma.video.update({
        where: {
          id: video.id,
        },
        data: {
          root_folder_id: videoFolderId,
          deliverables_folder_id: deliverablesFolderId,
          source_files_folder_id: internalFilesFolderId,
          // Internal Files:
          m_and_e_folder_id: mAndEFolderId,
          mp4_folder_id: mp4FolderId,
          raw_script_folder_id: rawScriptFolderId,
          raw_audio_folder_id: rawAudioFolderId,
        },
      });

      // for (const languageId of createVideoDTO.languageIds) {
      for (const languageId of languageIds) {
        // Create AudioDub for each language
        this.logger.log(
          `Creating AudioDub for language with ID: ${languageId} - creatorId: ${creatorId}, videoId: ${video.id}`
        );
        const languageData = languagesWithFolderIds.find(
          (lang) => lang.id === languageId
        );

        const language = await this.prisma.language.findUnique({
          where: {
            id: languageId,
          },
          select: {
            name: true,
          },
        });

        // const finalAudioDubFolderId = await this.storageService.getTaskUploadFolderId(deliverablesFolderId, TaskType.AUDIO_ENGINEERING, language.name);

        const audioDub = await this.prisma.audioDub.create({
          data: {
            status: "PENDING",
            phase: "TRANSCRIPTION",
            root_folder_id: videoFolderId,
            final_folder_id: languageData.languageDeliverablesFolderId,
            mixed_audio_folder_id: languageData.languageMixedAudioFolderId,
            language: {
              connect: { id: languageId },
            },
            video: {
              connect: { id: video.id },
            },
          },
          select: {
            id: true,
            language: {
              select: {
                name: true,
              },
            },
          },
        });

        // Create 4 tasks (transcription, translation, voice over, sound engineering)
        for (const taskType of TASKS) {
          if (taskType === TaskType.TRANSCRIPTION) {
            continue;
          }

          let resourcesFolderId;
          let uploadFilesFolderId;

          // if (taskType === TaskType.TRANSCRIPTION) { // OLD
          //   uploadFilesFolderId = await this.storageService.getTaskUploadFolderId(deliverablesFolderId, getEnumTaskType(taskType), audioDub.language.name);
          //   resourcesFolderId = await this.storageService.getTaskResourcesFolderId(sourceFilesFolderId, getEnumTaskType(taskType), audioDub.language.name);
          // }

          if (taskType === TaskType.TRANSLATION) {
            resourcesFolderId = englishTranscriptFolderId;
            uploadFilesFolderId = languageData.languageFinalScriptFolderId;
          }

          if (taskType === TaskType.VOICE_OVER) {
            resourcesFolderId = languageData.languageFinalScriptFolderId;
            uploadFilesFolderId = languageData.languageRawAudioFolderId;
          }

          if (taskType === TaskType.AUDIO_ENGINEERING) {
            resourcesFolderId = languageData.languageRawAudioFolderId;
            uploadFilesFolderId = languageData.languageMixedAudioFolderId;
          }

          await this.prisma.task.create({
            data: {
              status:
                taskType === TaskType.TRANSCRIPTION
                  ? TaskStatus.IN_PROGRESS
                  : TaskStatus.PENDING,
              type: getEnumTaskType(taskType),
              resources_folder_id: resourcesFolderId,
              uploaded_files_folder_id: uploadFilesFolderId,
              audioDub: {
                connect: { id: audioDub.id },
              },
            },
          });
        }
      }

      // Update the video with the isInitialized flag
      await this.prisma.video.update({
        where: {
          id: video.id,
        },
        data: { isInitialized: true },
      });

      // Create a transcription task inside the video
      this.logger.log(
        `Transcription Resources Folder ID: ${rawScriptFolderId}`
      );
      this.logger.log(
        `Transcription Upload Files Folder ID: ${englishTranscriptFolderId}`
      );
      this.logger.log(`Transcription Task ID: ${video.id}`);
      await this.prisma.task.create({
        data: {
          status: TaskStatus.IN_PROGRESS,
          type: TaskType.TRANSCRIPTION,
          resources_folder_id: rawScriptFolderId,
          uploaded_files_folder_id: englishTranscriptFolderId,
          video: {
            connect: { id: video.id },
          },
        },
      });

      // Rename folder & files in GCS
      await renameVideoInGCS(
        this.storage,
        creator.username,
        addVideoDTO.session_id,
        video.id,
        this.BUCKET_NAME,
        videoIsExternal,
        audioIsExternal,
        audioExists
      );

      // // Publish a message to the PubSub topic
      // const pubSubMessage = {
      //   videoId: video.id,
      //   videoTitle: video.title,
      //   // creatorId,
      //   videoFolderPath: `videos/${creator.username}/${video.title}`,
      //   sourceFilesFolderId: sourceFilesFolderId,
      //   // rawScriptFolderId,
      // };

      // await this.pubsubService.publishMessage("video-transcoding-requests", pubSubMessage);
      // axios.post(`${process.env.MICROSERVICE_ENDPOINT}/process-video`, pubSubMessage);

      if (!videoIsExternal) {
        await this.sendTranscodingRequestAndNotifications(
          video.id,
          video.title,
          creator.username,
          mp4FolderId
        );
      }

      await this.notificationGeneratorService.sendNewVideoSubmissionPANotification(
        video.id
      );
      await this.discordGeneratorService.sendNewVideoSubmissionNotification(
        video.id
      );

      // await this.notificationGeneratorService.sendSonixGeneratingNotification(video.id);
      // await this.notificationGeneratorService.sendMP4GeneratingNotification(video.id);
      // await this.discordGeneratorService.sendMP4GeneratingNotification(video.id);

      // Publish a message to the PubSub topic
      if (videoIsExternal) {
        await this.pubsubService.publishMessage(
          process.env.TRANSFER_EXTERNAL_RESOURCE_TOPIC,
          {
            videoId: video.id,
            videoTitle: video.title,
            externalUrl: addVideoDTO.video_file_id,
            destinationFolderPath: `videos/${creator.username}/${video.id}/raw`,
            resourceType: "video",
          }
        );
      }

      if (audioIsExternal) {
        await this.pubsubService.publishMessage(
          process.env.TRANSFER_EXTERNAL_RESOURCE_TOPIC,
          {
            videoId: video.id,
            videoTitle: video.title,
            externalUrl: addVideoDTO.soundtrack_file_id,
            destinationFolderPath: `videos/${creator.username}/${video.id}/me-audio`,
            resourceType: "audio",
          }
        );
      }

      this.logger.log(`Video added with ID: ${video.id}`);
      return video;
    } catch (error) {
      this.logger.error("Error adding video", error);
      throw new Error("Failed to add video");
    }
  }

  async videoResourceUploaded({
    videoId,
    resourceType,
  }: {
    videoId: number;
    resourceType: "video" | "audio";
  }) {
    this.logger.log(
      `Video resource uploaded for videoId: ${videoId}, resourceType: ${resourceType}`
    );

    try {
      const video = await this.prisma.video.update({
        where: { id: videoId },
        data: {
          [resourceType === "video"
            ? "isVideoResourceUploaded"
            : "isAudioResourceUploaded"]: true,
        },
        select: {
          title: true,
          root_folder_id: true,
          creator: {
            select: {
              username: true,
            },
          },
        },
      });

      if (resourceType === "video") {
        const sourceFilesFolder = await this.boxService.getFileByName(
          video.root_folder_id,
          VIDEO_SUBFOLDERS.INTERNAL_FILES
        );
        const mp4Folder = await this.boxService.getFileByName(
          sourceFilesFolder.id,
          VIDEO_SUBFOLDERS.MP4
        );

        await this.sendTranscodingRequestAndNotifications(
          videoId,
          video.title,
          video.creator.username,
          mp4Folder.id
        );
      }
    } catch (error) {
      this.logger.error("Error uploading video resource", {
        error: error.message,
        stack: error.stack,
        videoId,
        resourceType,
        cause: error.cause,
      });
      throw new Error(`Failed to upload video resource: ${error.message}`);
    }
  }

  private async sendTranscodingRequestAndNotifications(
    videoId: number,
    videoTitle: string,
    creatorUsername: string,
    sourceFilesFolderId: string
  ) {
    // Publish a message to the PubSub topic
    const pubSubMessage = {
      videoId: videoId,
      videoTitle: videoTitle,
      // creatorId,
      videoFolderPath: `videos/${creatorUsername}/${videoId}`,
      sourceFilesFolderId,
    };
    await this.pubsubService.publishMessage(
      "video-transcoding-requests",
      pubSubMessage
    );

    await this.notificationGeneratorService.sendMP4GeneratingNotification(
      videoId
    );
    await this.discordGeneratorService.sendMP4GeneratingNotification(videoId);
  }

  async getMetadataForTranscoderCompletion({ videoId }: { videoId: number }) {
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
      select: {
        title: true,
        id: true,
        root_folder_id: true,
        creator: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!video) {
      throw new Error("Video not found");
    }

    const sourceFilesFolder = await this.boxService.getFileByName(
      video.root_folder_id,
      VIDEO_SUBFOLDERS.INTERNAL_FILES
    );
    const mp4Folder = await this.boxService.getFileByName(
      sourceFilesFolder.id,
      VIDEO_SUBFOLDERS.MP4
    );
    const mAndEFolder = await this.boxService.getFileByName(
      sourceFilesFolder.id,
      VIDEO_SUBFOLDERS.M_AND_E
    );

    const transcoderMetadata = {
      videoId,
      videoTitle: video.title,
      videoFolderPath: `videos/${video.creator.username}/${video.id}`,
      sourceFilesFolderId: sourceFilesFolder.id,
      mp4FolderId: mp4Folder.id,
      mAndEFolderId: mAndEFolder.id,
    };

    return transcoderMetadata;
  }

  // ----- OLD CODE -----
  async createVideo(createVideoDTO: CreateVideoDTO) {
    this.logger.log(
      `Creating video with data: ${JSON.stringify(createVideoDTO)}`
    );

    try {
      const thumbnailUrl = createVideoDTO.youtube_url
        ? getThumbnailUrl(createVideoDTO.youtube_url)
        : null;

      // Create the video
      const video = await this.prisma.video.create({
        data: {
          youtube_url: createVideoDTO.youtube_url,
          title: createVideoDTO.title,
          description: createVideoDTO.description,
          thumbnail_url: thumbnailUrl,
          creator: {
            connect: { id: createVideoDTO.creator_id },
          },
        },
        include: {
          creator: true,
        },
      });

      for (const languageId of createVideoDTO.languageIds) {
        // Create AudioDub for each language
        const audioDub = await this.prisma.audioDub.create({
          data: {
            status: "PENDING",
            phase: "TRANSCRIPTION",
            language: {
              connect: { id: languageId },
            },
            video: {
              connect: { id: video.id },
            },
          },
        });

        // Create 4 tasks (transcription, translation, voice over, sound engineering)
        for (const taskType of TASKS) {
          await this.prisma.task.create({
            data: {
              status: "PENDING",
              type: getEnumTaskType(taskType),
              audioDub: {
                connect: { id: audioDub.id },
              },
            },
          });
        }
      }

      this.logger.log(`Video created with ID: ${video.id}`);
      return video;
    } catch (error) {
      this.logger.error("Error creating video", error);
      throw new Error("Failed to create video");
    }
  }

  // async addVideo(addVideoDTO: AddVideoDTO, creatorId: string) {
  //   this.logger.log(`Adding a video with data: ${JSON.stringify(addVideoDTO)}`);

  //   try {
  //     const thumbnailUrl = addVideoDTO.youtube_url ? getThumbnailUrl(addVideoDTO.youtube_url) : null;

  //     // TODO: Remove this (we will pass creatorId instead of email)
  //     const creator = await this.prisma.creator.findFirst({
  //       where: {
  //         user: {
  //           email: creatorId,
  //         },
  //       },
  //     });

  //     // Create the video
  //     const video = await this.prisma.video.create({
  //       data: {
  //         youtube_url: addVideoDTO.youtube_url,
  //         title: addVideoDTO.title,
  //         description: addVideoDTO.description,
  //         thumbnail_url: thumbnailUrl,
  //         creator: {
  //           connect: { id: creator.id },
  //         },
  //       },
  //       include: {
  //         creator: true,
  //       },
  //     });

  //     // Remove this
  //     this.logger.log("Finding languages for creator: ", creatorId);
  //     const languageIds = await getCreatorLanguageIds(this.prisma, creator.id);

  //     const { videoFolderId } = await this.storageService.completeVideoUpload({
  //       videoTitle: video.title,
  //       creatorId,
  //       session_folder_id: addVideoDTO.session_folder_id,
  //       video_file_id: addVideoDTO.video_file_id,
  //       soundtrack_file_id: addVideoDTO.soundtrack_file_id,
  //     });

  //     // Update the video with the root folder ID
  //     await this.prisma.video.update({
  //       where: {
  //         id: video.id,
  //       },
  //       data: {
  //         root_folder_id: videoFolderId,
  //       },
  //     });

  //     // for (const languageId of createVideoDTO.languageIds) {
  //     for (const languageId of languageIds) {
  //       // Create AudioDub for each language
  //       this.logger.log(
  //         `Creating AudioDub for language with ID: ${languageId} - creatorId: ${creatorId}, videoId: ${video.id}`
  //       );
  //       const audioDub = await this.prisma.audioDub.create({
  //         data: {
  //           status: "PENDING",
  //           phase: "TRANSCRIPTION",
  //           language: {
  //             connect: { id: languageId },
  //           },
  //           video: {
  //             connect: { id: video.id },
  //           },
  //         },
  //         select: {
  //           id: true,
  //           language: {
  //             select: {
  //               name: true,
  //             },
  //           },
  //         },
  //       });

  //       // Create 4 tasks (transcription, translation, voice over, sound engineering)
  //       for (const taskType of TASKS) {
  //         const resourcesFolderId = await this.storageService.getTaskResourcesFolderId(
  //           videoFolderId,
  //           getEnumTaskType(taskType),
  //           audioDub.language.name
  //         );
  //         const uploadFilesFolderId = await this.storageService.getTaskUploadFolderId(
  //           videoFolderId,
  //           getEnumTaskType(taskType),
  //           audioDub.language.name
  //         );
  //         await this.prisma.task.create({
  //           data: {
  //             status: taskType === TaskType.TRANSCRIPTION ? TaskStatus.IN_PROGRESS : TaskStatus.PENDING,
  //             type: getEnumTaskType(taskType),
  //             resources_folder_id: resourcesFolderId,
  //             uploaded_files_folder_id: uploadFilesFolderId,
  //             audioDub: {
  //               connect: { id: audioDub.id },
  //             },
  //           },
  //         });
  //       }
  //     }

  //     this.logger.log(`Video added with ID: ${video.id}`);
  //     return video;
  //   } catch (error) {
  //     this.logger.error("Error adding video", error);
  //     throw new Error("Failed to add video");
  //   }
  // }

  async countVideos({
    creatorId,
    timePeriod,
    searchTerm,
  }: {
    creatorId: string;
    timePeriod: string;
    searchTerm: string;
  }): Promise<number> {
    this.logger.log(
      `Counting VIDEOS with creatorId: ${creatorId}, timePeriod: ${timePeriod}, searchTerm: ${searchTerm}`
    );

    // Build dynamic filters
    const where: any = {};

    // Creator filter
    if (creatorId) {
      const user = await this.prisma.user.findFirst({
        where: {
          email: creatorId,
        },
      });

      where.creator_id = user.id;
    }

    // Search term filter
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    const count = await this.prisma.video.count({ where });
    this.logger.log(`Found ${count} videos`);
    return count;
  }

  async getVideos({
    timePeriod,
    creatorId,
    searchTerm,
  }: {
    timePeriod: string;
    creatorId: number;
    searchTerm: string;
  }): Promise<InboxVideoDTO[]> {
    this.logger.log(
      `Fetching VIDEOS with timePeriod: ${timePeriod}, creatorId: ${creatorId}, searchTerm: ${searchTerm}`
    );

    try {
      // Build dynamic filters
      const where: any = {};

      // Creator filter
      if (creatorId) {
        where.creator_id = +creatorId;
      }

      // Time period filter
      const timeFilter = getTimePeriodFilter(timePeriod);
      if (timeFilter) {
        where.created_at = timeFilter;
      }

      // Search term filter
      if (searchTerm) {
        where.OR = [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ];
      }

      const startTime = Date.now();
      const videos = await this.prisma.video.findMany({
        where,
        orderBy: {
          created_at: "desc",
        },
        include: {
          creator: {
            include: {
              user: true,
            },
          },
          transcriptionTask: {
            include: {
              staffs: {
                include: {
                  staff: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
          audioDubs: {
            include: {
              language: true,
              tasks: {
                include: {
                  staffs: {
                    include: {
                      staff: {
                        include: {
                          user: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const endTime = Date.now(); // Log the end time
      const queryDuration = endTime - startTime; // Calculate the time difference
      this.logger.log(`Prisma query took: ${queryDuration}ms`); // Log the query duration

      const inboxVideosDTOs: InboxVideoDTO[] = videos.map((video) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnail_url: video.thumbnail_url,
        status: video.status as VideoStatus,
        root_folder_id: video.root_folder_id,
        expected_by: video.expected_by,
        creator: {
          id: video.creator.id,
          full_name: video.creator.user.full_name,
          photo_url: video.creator.user.photo_url,
          username: video.creator.username,
        },
        transcriptionTask: !video.transcriptionTask
          ? null // TODO: Remove this - Temporary fix because old videos don't have transcriptionTask
          : {
              id: video?.transcriptionTask.id,
              type: video?.transcriptionTask.type as TaskType,
              status: video?.transcriptionTask.status,
              expected_delivery_date:
                video.transcriptionTask?.expected_delivery_date,
              staffs: video.transcriptionTask?.staffs.map(
                (staff) =>
                  ({
                    id: staff.staff.id,
                    full_name: staff.staff.user.full_name,
                    photo_url: staff.staff.user.photo_url,
                  } as StaffDTO)
              ),
            },
        audioDubs: video.audioDubs.map(
          (audioDub) =>
            ({
              id: audioDub.id,
              status: audioDub.status,
              phase: audioDub.phase,
              approved: audioDub.approved,
              translatedTitle: audioDub.translatedTitle,
              translatedDescription: audioDub.translatedDescription,
              language: {
                name: audioDub.language.name,
                // flag_url: audioDub.language.flag_url,
                code: audioDub.language.code,
              },
              tasks: audioDub.tasks
                .map((task) => ({
                  id: task.id,
                  type: task.type,
                  status: task.status,
                  expected_delivery_date: task.expected_delivery_date,
                  staffs: task.staffs.map(
                    (staff) =>
                      ({
                        id: staff.staff.id,
                        full_name: staff.staff.user.full_name,
                        photo_url: staff.staff.user.photo_url,
                      } as StaffDTO)
                  ),
                }))
                .sort((a, b) => typeOrder[a.type] - typeOrder[b.type]),
            } as InboxAudioDubDTO)
        ),
      })) as InboxVideoDTO[];

      this.logger.log(`Fetched ${inboxVideosDTOs.length} videos`);
      return inboxVideosDTOs;
    } catch (error) {
      this.logger.error("Error fetching videos", error);
      throw new Error("Failed to fetch videos");
    }
  }

  // async getLibraryVideosCount({
  //   creatorId,
  //   timePeriod,
  //   searchTerm,
  // }: {
  //   creatorId: string;
  //   timePeriod: string;
  //   searchTerm: string;
  // }): Promise<number> {
  //   const where: any = {};

  //   // Creator filter
  //   if (creatorId) {
  //     // where.creator_id = creatorId;
  //   }
  // }

  async getLibraryVideos({
    page,
    limit,
    creatorId,
    timePeriod,
    videoStatus,
    searchTerm,
  }: {
    page: number;
    limit: number;
    creatorId: string;
    timePeriod: string;
    videoStatus: VideoStatus;
    searchTerm: string;
  }): Promise<LibraryVideoDTO[]> {
    this.logger.log(
      `Fetching LIBRARY VIDEOS with page: ${page} and limit: ${limit} | creatorId: ${creatorId}`
    );
    // Fetch videos with pagination
    const take = limit;
    const skip = (page - 1) * limit;

    // Build dynamic filters
    const where: any = {};

    // ---
    // We have Assistants now
    const user = await this.prisma.user.findFirst({
      where: {
        email: creatorId,
      },
      select: {
        role: true,
      },
    });

    if (user?.role === "CREATOR_ASSISTANT") {
      const assistant = await this.prisma.assistant.findFirst({
        where: {
          user: {
            email: creatorId,
          },
        },
        select: {
          managerId: true,
        },
      });

      // This will be improved when we fix User ID issue
      const creator = await this.prisma.user.findUnique({
        where: {
          id: assistant.managerId,
        },
        select: {
          email: true,
        },
      });

      creatorId = creator.email;
    }
    // ---

    // Creator filter
    if (creatorId) {
      where.creator = {
        user: {
          email: creatorId,
        },
      };
    }

    if (videoStatus) {
      where.status = videoStatus;
    }

    // // Time period filter
    // const timeFilter = getTimePeriodFilter(timePeriod);
    // if (timeFilter) {
    //   where.created_at = timeFilter;
    // }

    // Search term filter
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    const videos = await this.prisma.video.findMany({
      take,
      skip,
      where,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail_url: true,
        status: true,
        isInitialized: true,
        deliverables_folder_id: true,
        audioDubs: {
          orderBy: [
            {
              status: "desc",
            },
            {
              phase: "desc",
            },
          ],
          select: {
            id: true,
            phase: true,
            status: true,
            approved: true,
            translatedTitle: true,
            translatedDescription: true,
            final_folder_id: true,
            language: {
              select: {
                name: true,
                code: true,
              },
            },
            tasks: {
              select: {
                id: true,
                type: true,
                status: true,
              },
            },
          },
        },
      },
    });

    const libraryVideosDTOs: LibraryVideoDTO[] = videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail_url: video.thumbnail_url,
      status: video.status as VideoStatus,
      isInitialized: video.isInitialized,
      rootFolderId: video.deliverables_folder_id,
      deliverables_folder_id: video.deliverables_folder_id,
      audioDubs: video.audioDubs.map(
        (audioDub) =>
          ({
            id: audioDub.id,
            status: audioDub.status,
            phase: audioDub.phase,
            approved: audioDub.approved,
            translatedTitle: audioDub.translatedTitle,
            translatedDescription: audioDub.translatedDescription,
            final_folder_id: audioDub.final_folder_id,
            language: {
              name: audioDub.language.name,
              // flag_url: audioDub.language.flag_url,
              code: audioDub.language.code,
            },
            tasks: audioDub.tasks.map(
              (task) =>
                ({
                  id: task.id,
                  type: task.type,
                  status: task.status,
                } as LibraryTaskDTO)
            ),
          } as LibraryAudioDubDTO)
      ),
    }));

    return libraryVideosDTOs;
  }

  async getVideosInReview({
    page,
    limit,
    creatorId,
  }: {
    page: number;
    limit: number;
    creatorId: string;
  }): Promise<LibraryVideoDTO[]> {
    this.logger.log(
      `Fetching REVIEW VIDEOS with page: ${page} and limit: ${limit} | creatorId: ${creatorId}`
    );
    // Fetch videos with pagination
    const take = limit;
    const skip = (page - 1) * limit;

    // Build dynamic filters
    const where: any = {
      audioDubs: {
        some: {
          status: AudioDubStatus.REVIEW,
        },
      },
    };

    // Creator filter
    if (creatorId) {
      where.creator = {
        user: {
          email: creatorId,
        },
      };
    }

    const videos = await this.prisma.video.findMany({
      take,
      skip,
      where,
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail_url: true,
        status: true,
        isInitialized: true,
        raw_audio_folder_id: true,
        mp4_folder_id: true,
        m_and_e_folder_id: true,
        source_files_folder_id: true,
        deliverables_folder_id: true,
        audioDubs: {
          orderBy: [
            {
              status: "desc",
            },
            {
              phase: "desc",
            },
          ],
          select: {
            id: true,
            phase: true,
            status: true,
            approved: true,
            translatedTitle: true,
            translatedDescription: true,
            final_folder_id: true,
            language: {
              select: {
                name: true,
                code: true,
              },
            },
            tasks: {
              select: {
                id: true,
                type: true,
                status: true,
              },
            },
          },
        },
      },
    });

    const libraryVideosDTOs: LibraryVideoDTO[] = videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail_url: video.thumbnail_url,
      status: video.status as VideoStatus,
      rootFolderId: video.deliverables_folder_id,
      isInitialized: video.isInitialized,
      audioDubs: video.audioDubs.map(
        (audioDub) =>
          ({
            id: audioDub.id,
            status: audioDub.status,
            phase: audioDub.phase,
            approved: audioDub.approved,
            translatedTitle: audioDub.translatedTitle,
            translatedDescription: audioDub.translatedDescription,
            final_folder_id: audioDub.final_folder_id,
            language: {
              name: audioDub.language.name,
              // flag_url: audioDub.language.flag_url,
              code: audioDub.language.code,
            },
            tasks: audioDub.tasks.map(
              (task) =>
                ({
                  id: task.id,
                  type: task.type,
                  status: task.status,
                } as LibraryTaskDTO)
            ),
          } as LibraryAudioDubDTO)
      ),
    }));

    return libraryVideosDTOs;
  }

  async countVideosInReview({
    creatorId,
  }: {
    creatorId: string;
  }): Promise<number> {
    this.logger.log(`Counting VIDEOS in REVIEW with creatorId: ${creatorId}`);

    // Build dynamic filters
    const where: any = {
      audioDubs: {
        some: {
          status: AudioDubStatus.REVIEW,
        },
      },
    };

    // Creator filter
    if (creatorId) {
      where.creator = {
        user: {
          email: creatorId,
        },
      };
    }

    const count = await this.prisma.video.count({ where });
    this.logger.log(`Found ${count} videos`);
    return count;
  }

  async getVideoPreview({
    videoId,
  }: {
    videoId: number;
  }): Promise<VideoPreviewDTO> {
    this.logger.log(`Fetching Video Preview with ID: ${videoId}`);

    const video = await this.prisma.video.findUnique({
      where: {
        id: +videoId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail_url: true,
        audioDubs: {
          select: {
            id: true,
            translatedDescription: true,
            status: true,
            approved: true,
            language: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    const videoPreviewDTO: VideoPreviewDTO = {
      id: video.id,
      title: video.title,
      description: video.description,
      descriptions: video.audioDubs.map((audioDub) => ({
        description: audioDub.translatedDescription,
        languageId: audioDub.language.id,
      })),
      thumbnail_url: video.thumbnail_url,
      audioDubs: video.audioDubs.map(
        (audioDub) =>
          ({
            id: audioDub.id,
            status: audioDub.status,
            available: audioDub.approved,
            language: {
              id: audioDub.language.id,
              name: audioDub.language.name,
              code: audioDub.language.code,
            },
          } as PreviewAudioDubDTO)
      ),
    };

    return videoPreviewDTO;
  }

  async getVideoPreviewMedia({
    videoId,
  }: {
    videoId: number;
  }): Promise<VideoPreviewMediaDTO> {
    return await this.storageService.getVideoPreviewMediaSources(videoId);
  }

  async compressionCompleted({ videoId }: { videoId: number }) {
    this.logger.log(`Compression completed for video with ID: ${videoId}`);
    await this.notificationGeneratorService.sendMP4CompletedNotification(
      videoId
    );
    await this.discordGeneratorService.sendMP4CompletedNotification(videoId);
  }

  async getVideoTitle(videoId: number) {
    this.logger.log(`Getting video title for video with ID: ${videoId}`);

    try {
      const video = await this.prisma.video.findUnique({
        where: { id: videoId },
        select: { title: true },
      });

      if (!video) {
        this.logger.warn(`Video with ID ${videoId} not found`);
        throw new NotFoundException(`Video with ID ${videoId} not found`);
      }

      this.logger.log(
        `Successfully retrieved title for video ${videoId}: ${video.title}`
      );
      return video.title;
    } catch (error) {
      this.logger.error(
        `Error getting video title for video ${videoId}:`,
        error
      );
      throw error;
    }
  }

  // async addFeedback({ data }: { data: SubmitFeedbackDTO }) {
  //   const { videoId, languageId, phase, timestamp, description } = data;
  //   this.logger.log(
  //     `Adding feedback for video with ID: ${videoId}, languageId: ${languageId}, phase: ${phase}, timestamp: ${timestamp}`
  //   );

  //   try {
  //     const isPhaseKnown = phase !== FeedbackPhase.UNKNOWN;

  //     // If its UNKNOWN We will handle it later, Vendor will set vendorPhse not like this.

  //     const audioDub = await this.prisma.audioDub.findFirst({
  //       where: {
  //         languageId: languageId,
  //         videoId: videoId,
  //       },
  //       select: {
  //         id: true,
  //         tasks: {
  //           where: {
  //             type: TaskType[phase],
  //           },
  //           select: {
  //             id: true,
  //           },
  //         },
  //       },
  //     });

  //     const feedback = await this.prisma.feedback.create({
  //       data: {
  //         timestamp,
  //         creatorPhase: phase,
  //         vendorPhase: isPhaseKnown ? AudioDubPhase[phase] : AudioDubPhase.AUDIO_ENGINEERING,
  //         creatorDescription: description,
  //         audioDub: {
  //           connect: { id: audioDub.id },
  //         },
  //       },
  //     });

  //     if (isPhaseKnown) {
  //       // Update the phase of the AudioDub
  //       await this.prisma.audioDub.update({
  //         where: {
  //           id: audioDub.id,
  //         },
  //         data: {
  //           phase: AudioDubPhase[phase],
  //           status: AudioDubStatus.IN_PROGRESS,
  //         },
  //       });
  //       // Update task
  //       await this.prisma.task.update({
  //         where: {
  //           id: audioDub.tasks[0].id,
  //         },
  //         data: {
  //           status: TaskStatus.IN_PROGRESS,
  //         },
  //       });
  //     }

  //     return feedback;
  //   } catch (error) {
  //     this.logger.error("Error adding feedback", error);
  //     throw new Error("Failed to add feedback");
  //   }
  // }

  // ----------------- Feedbacks -----------------

  async addFeedback({ data }: { data: SubmitFeedbackDTO }) {
    const { videoId, languageId, issues } = data;
    this.logger.log(
      `Adding feedback for video with ID: ${videoId}, languageId: ${languageId}, with ${issues.length} issues`
    );

    try {
      // Find the audio dub
      // const audioDub = await this.prisma.audioDub.findFirst({
      //   where: {
      //     languageId: languageId,
      //     videoId: videoId,
      //   },
      //   select: {
      //     id: true,
      //   },
      // });

      // if (!audioDub) {
      //   throw new Error("AudioDub not found");
      // }

      // Create the feedback with its issues in a transaction
      // const feedback = await this.prisma.$transaction(async (prisma) => {
      //   // Create the main feedback record
      //   const feedback = await prisma.feedback.create({
      //     data: {
      //       audioDub: {
      //         connect: { id: audioDub.id },
      //       },
      //       status: FeedbackStatus.NEW,
      //       // creatorDescription: "",
      //       // Create all issues for this feedback
      //       issues: {
      //         create: issues.map((issue) => ({
      //           startTimestamp: issue.startTimestamp,
      //           endTimestamp: issue.endTimestamp,
      //           description: issue.description,
      //           status: FeedbackIssueStatus.NEW,
      //         })),
      //       },
      //     },
      //     // Include issues in the response
      //     include: {
      //       issues: true,
      //     },
      //   });

      //   // Update the AudioDub status
      //   await prisma.audioDub.update({
      //     where: {
      //       id: audioDub.id,
      //     },
      //     data: {
      //       status: AudioDubStatus.IN_PROGRESS,
      //     },
      //   });

      //   return feedback;
      // });

      const feedback = await this.prisma.feedback.create({
        data: {
          video: {
            connect: { id: videoId },
          },
          reportedLanguage: {
            connect: { id: languageId },
          },
          status: FeedbackStatus.NEW,
          issues: {
            create: issues.map((issue) => ({
              startTimestamp: issue.startTimestamp,
              endTimestamp: issue.endTimestamp,
              description: issue.description,
              status: FeedbackIssueStatus.NEW,
            })),
          },
        },
        // include: {
        //   issues: true,
        // },
      });

      return feedback;
    } catch (error) {
      this.logger.error("Error adding feedback", error);
      throw new Error("Failed to add feedback");
    }
  }
  async getVendorFeedbacks(videoId: number): Promise<FeedbackDTO[]> {
    try {
      const feedbacks = await this.prisma.feedback.findMany({
        where: {
          videoId,
        },
        select: {
          id: true,
          vendorPhase: true,
          originPhase: true,
          createdAt: true,
          status: true,
          issues: {
            where: {
              status: {
                not: FeedbackIssueStatus.REJECTED,
              },
            },
            select: {
              id: true,
              startTimestamp: true,
              endTimestamp: true,
              description: true,
              status: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          reportedLanguage: {
            select: {
              name: true,
              code: true,
            },
          },
          // audioDub: {
          //   select: {
          //     language: {
          //       select: {
          //         name: true,
          //         code: true,
          //       },
          //     },
          //   },
          // },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Transform the data to match FeedbackDTO format
      const feedbackDTOs: FeedbackDTO[] = feedbacks.map((feedback) => ({
        id: feedback.id,
        // creatorDescription: feedback.creatorDescription,
        // vendorPhase: feedback.vendorPhase,
        originPhase: feedback.originPhase,
        createdAt: feedback.createdAt,
        status: feedback.status,
        language: {
          name: feedback.reportedLanguage.name,
          code: feedback.reportedLanguage.code,
        },
        issues: feedback.issues,
      })) as FeedbackDTO[];

      return feedbackDTOs;
    } catch (error) {
      this.logger.error("Error fetching vendor feedbacks:", error);
      throw new Error("Failed to fetch vendor feedbacks");
    }
  }

  // async getFeedbacks({ videoId }: { videoId: number }): Promise<FeedbackDTO[]> {
  //   this.logger.log(`Fetching feedbacks for video with ID: ${videoId}`);

  //   try {
  //     const feedbacks = await this.prisma.feedback.findMany({
  //       where: {
  //         audioDub: {
  //           videoId: videoId,
  //         },
  //       },
  //       select: {
  //         id: true,
  //         // creatorDescription: true,
  //         // vendorDescription: true,
  //         // creatorPhase: true,
  //         vendorPhase: true,
  //         createdAt: true,
  //         status: true,
  //         audioDub: {
  //           select: {
  //             language: {
  //               select: {
  //                 code: true,
  //                 name: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });

  //     const feedbackDTOs: FeedbackDTO[] = feedbacks.map(
  //       (feedback) =>
  //         ({
  //           id: feedback.id,
  //           // timestamp: feedback.timestamp,
  //           // creatorDescription: feedback.creatorDescription,
  //           // vendorDescription: feedback.vendorDescription,
  //           // creatorPhase: feedback.creatorPhase,
  //           vendorPhase: feedback.vendorPhase,
  //           createdAt: feedback.createdAt,
  //           status: feedback.status,
  //           language: {
  //             code: feedback.audioDub.language.code,
  //             name: feedback.audioDub.language.name,
  //           },
  //         } as FeedbackDTO)
  //     );

  //     return feedbackDTOs;
  //   } catch (error) {
  //     this.logger.error("Error fetching feedbacks", error);
  //     throw new Error("Failed to fetch feedbacks");
  //   }
  // }

  async rejectFeedbackIssue(feedbackIssueId: number): Promise<void> {
    this.logger.log(`Rejecting feedback issue with ID: ${feedbackIssueId}`);

    try {
      await this.prisma.feedbackIssue.update({
        where: {
          id: feedbackIssueId,
        },
        data: {
          status: FeedbackIssueStatus.REJECTED,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error rejecting feedback issue [${feedbackIssueId}] - `,
        error
      );
      throw new Error("Failed to reject feedback issue");
    }
  }

  async approveFeedback(
    feedbackId: number,
    data: ApproveFeedbackDTO
  ): Promise<void> {
    this.logger.log(`Approving feedback with ID: ${feedbackId}`);

    try {
      if (!data.phase) {
        throw new Error("Phase is required for approving feedback");
      }

      // transaction
      const feedback = await this.prisma.$transaction(async (prisma) => {
        const feedback = await this.prisma.feedback.update({
          where: {
            id: feedbackId,
          },
          data: {
            // vendorPhase: data.phase,
            originPhase: data.phase,
            status: FeedbackStatus.IN_PROGRESS,
          },
          select: {
            id: true,
            videoId: true,
            originPhase: true,
            reportedLanguage: {
              select: {
                id: true,
              },
            },
          },
        });

        // Add feedback to each task
        const taskTypesForUpdate = getTasksTypesForUpdate(data.phase);

        // Tasks - Add feedback to each task and update the status to IN_PROGRESS for the first task
        // There are 2 types:
        // 1. Tasks that are associated with the audio dub
        // 2. Tasks that are associated with the video
        const where =
          data.phase === AudioDubPhase.TRANSCRIPTION
            ? {
                OR: [
                  {
                    audioDub: {
                      videoId: feedback.videoId,
                    },
                  },
                  {
                    video: {
                      id: feedback.videoId,
                    },
                  },
                ],
              }
            : {
                type: {
                  in: taskTypesForUpdate,
                },
                audioDub: {
                  video: {
                    id: feedback.videoId,
                  },
                  languageId: feedback.reportedLanguage.id,
                },
              };

        const tasks = await prisma.task.findMany({
          where: {
            ...where,
          },
          select: {
            id: true,
            audioDub: {
              select: {
                id: true,
              },
            },
          },
        });

        await prisma.feedbackTask.createMany({
          data: tasks.map((task) => ({
            feedbackId: feedback.id,
            taskId: task.id,
          })),
        });

        // Update Tasks status to IN_PROGRESS
        // Update only the first task
        // If the origin phase is transcription -> Only 1 task is related to video and we update that one in Progress.
        // If the origin phase is after transcription -> We update the origin phase type of task from all Audio Dubs in that video.
        await prisma.task.updateMany({
          where: {
            id: {
              // We dont even need this. Because if its Transcription there is only 1 task and if its not transcription there is only 1 task that is related to the audio dub.
              in: tasks.map((task) => task.id),
            },
            type: taskTypesForUpdate[0],
          },
          data: {
            status: TaskStatus.IN_PROGRESS,
          },
        });

        // Update Tasks status to PENDING (Basically only Audio Dubs tasks can be pending, becuase if video is set to Transcription, then Transcription is in progress the rest will be pending)
        // If its Transcription then make Translation, Voice Over and Audio Engineering pending, if its not transcription then make only the next task in the list pending.
        await prisma.task.updateMany({
          where: {
            audioDub: {
              video: {
                id: feedback.videoId,
              },
            },
            type: {
              in:
                data.phase === AudioDubPhase.TRANSCRIPTION
                  ? taskTypesForUpdate
                  : taskTypesForUpdate.slice(1),
            },
          },
          data: {
            status: TaskStatus.PENDING,
          },
        });

        const audioDubIds = tasks
          .map((task) => task.audioDub?.id)
          .filter((id) => !!id);
        await this.prisma.audioDub.updateMany({
          where: {
            id: {
              in: audioDubIds,
            },
          },
          data: {
            phase: data.phase,
            status: AudioDubStatus.IN_PROGRESS,
            approved: false,
          },
        });

        // Find the task that will be set in progress and send notification
        const taskInProgress = await prisma.task.findFirst({
          where: {
            OR: [
              {
                audioDub: {
                  video: {
                    id: feedback.videoId,
                  },
                  languageId: feedback.reportedLanguage.id,
                },
              },
              {
                video: {
                  id: feedback.videoId,
                },
              },
            ],
            type: taskTypesForUpdate[0],
          },
          select: {
            id: true,
            type: true,
          },
        });
        sendNotificationAfterFeedbackApproved(
          taskInProgress.id,
          taskInProgress.type,
          feedback.videoId,
          this.notificationGeneratorService,
          feedback.reportedLanguage.id
        );
      });

      // Improvement: right now we are not updating the next task status. This wont cause any issues, but it would be better to update the next task status - for inspecting purposes.
    } catch (error) {
      this.logger.error(`Error approving feedback [${feedbackId}] - `, error);
      throw new Error("Failed to approve feedback");
    }
  }

  async rejectFeedback(feedbackId: number): Promise<void> {
    this.logger.log(`Rejecting feedback with ID: ${feedbackId}`);

    try {
      await this.prisma.feedback.update({
        where: {
          id: feedbackId,
        },
        data: {
          status: FeedbackStatus.REJECTED,
        },
      });
    } catch (error) {
      this.logger.error(`Error rejecting feedback [${feedbackId}] - `, error);
      throw new Error("Failed to reject feedback");
    }
  }

  async getStaffFeedbacks(taskId: number): Promise<FeedbackDTO[]> {
    this.logger.log(`Fetching staff feedbacks for task with ID: ${taskId}`);

    try {
      // const task = await this.prisma.task.findUnique({
      //   where: {
      //     id: taskId,
      //   },
      //   select: {
      //     audioDub: {
      //       select: {
      //         id: true,
      //       },
      //     },
      //   },
      // });

      const feedbacks = await this.prisma.feedback.findMany({
        where: {
          status: {
            in: [FeedbackStatus.IN_PROGRESS, FeedbackStatus.RESOLVED],
          },
          tasks: {
            some: {
              taskId: taskId,
            },
          },
        },
        select: {
          id: true,
          // vendorPhase: true,
          originPhase: true,
          createdAt: true,
          status: true,
          issues: {
            where: {
              status: {
                not: FeedbackIssueStatus.REJECTED,
              },
            },
            select: {
              id: true,
              startTimestamp: true,
              endTimestamp: true,
              description: true,
              status: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          reportedLanguage: {
            select: {
              name: true,
              code: true,
            },
          },
          // audioDub: {
          //   select: {
          //     language: {
          //       select: {
          //         name: true,
          //         code: true,
          //       },
          //     },
          //   },
          // },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Transform the data to match FeedbackDTO format
      const feedbackDTOs: FeedbackDTO[] = feedbacks.map((feedback) => ({
        id: feedback.id,
        // creatorDescription: feedback.creatorDescription,
        // vendorPhase: feedback.vendorPhase,
        originPhase: feedback.originPhase,
        createdAt: feedback.createdAt,
        status: feedback.status,
        language: {
          name: feedback.reportedLanguage.name,
          code: feedback.reportedLanguage.code,
        },
        issues: feedback.issues,
      })) as FeedbackDTO[];

      return feedbackDTOs;
    } catch (error) {
      this.logger.error(`Error fetching staff feedbacks [${taskId}] -`, error);
      throw new Error("Failed to fetch feedbacks");
    }
  }

  // -----------------

  async approveDub({ dubId, data }: { dubId: number; data: ApproveDubDto }) {
    this.logger.log(`Approving dub with ID: ${dubId}`);

    try {
      const audioDub = await this.prisma.audioDub.update({
        where: {
          id: dubId,
        },
        data: {
          approved: true,
          translatedTitle: data.title,
          translatedDescription: data.description,
        },
        select: {
          videoId: true,
        },
      });

      // Send notification if all audio dubs are approved
      const audioDubs = await this.prisma.audioDub.findMany({
        where: {
          videoId: audioDub.videoId,
        },
        select: {
          approved: true,
        },
      });

      // If all audio dubs are approved, update the video status to COMPLETED and Send Notification
      if (audioDubs.every((audioDub) => audioDub.approved)) {
        await this.prisma.video.update({
          where: {
            id: audioDub.videoId,
          },
          data: { status: VideoStatus.COMPLETED },
        });
        await this.notificationGeneratorService.sendAdminSubmittedAllTranslationsPANotification(
          audioDub.videoId
        );
      }
    } catch (error) {
      this.logger.error("Error approving dub", error);
      throw new Error("Failed to approve dub");
    }
  }

  async logProcessingIssue(input: VideoProcessingIssueDTO) {
    this.logger.log(
      `Logging processing issue for video ${input.videoId} at stage ${input.stage}`
    );

    try {
      const issue = await this.prisma.videoProcessingIssue.create({
        data: {
          videoId: input.videoId,
          stage: input.stage,
          status: VideoProcessingIssueStatus.OPEN,
          errorMessage: input.errorMessage,
          errorDetails: input.errorDetails,
        },
      });

      this.logger.log(
        `Successfully logged processing issue with ID: ${issue.id}`
      );
      return issue;
    } catch (error) {
      this.logger.error(`Failed to log processing issue: ${error.message}`);
      throw error;
    }
  }

  async bulkDownload(videoIds: number[], language: string) {
    this.logger.log(`Bulk downloading videos with IDs: ${videoIds}`);

    try {
      // Fetch the videos to be downloaded
      const videos = await this.prisma.video.findMany({
        where: {
          id: {
            in: videoIds,
          },
        },
        select: {
          title: true,
          root_folder_id: true,
          creator: {
            select: {
              id: true,
            },
          },
        },
      });
      console.log(videos);
      const creator = await this.prisma.user.findUnique({
        where: {
          id: videos[0].creator.id,
        },
        select: {
          email: true,
        },
      });

      // Create the ZIP download request with the correct structure
      const downloadRequests: ZipDownloadRequest = {
        downloadFileName: `${videos[0].title}_and_more.zip`,
        items: videos.map((video) => ({
          id: video.root_folder_id,
          type: "folder",
        })),
      };

      const downloadResponse = await this.boxService.downloadZip(
        downloadRequests,
        creator.email
      );

      return downloadResponse.downloadUrl;

      return "true";
    } catch (error) {
      this.logger.error("Error preparing bulk download", error);
      throw new Error("Failed to prepare bulk download");
    }
  }

  async bulkUploadCsv(file: Express.Multer.File, creatorId: string) {
    this.logger.log(`Bulk uploading XLSX data`);

    try {
      const workbook = XLSX.readFile(file.path);

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("Excel file is empty or has no sheets");
      }

      // Try to find the "Bulk Upload" sheet, otherwise use the first sheet
      const sheetName =
        workbook.SheetNames.find((name) => name === "Bulk Upload") ||
        workbook.SheetNames[0];
      if (!sheetName) {
        throw new Error("No sheets found in the workbook");
      }

      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        throw new Error(`Worksheet "${sheetName}" not found in workbook`);
      }

      this.logger.log("Worksheet structure:", {
        sheetName,
        range: worksheet["!ref"],
        hasData: !!worksheet["!ref"],
      });

      const data = XLSX.utils.sheet_to_json<BulkUploadRow>(worksheet);

      if (!data || data.length === 0) {
        throw new Error("No data found in the worksheet");
      }

      this.logger.log(`Found ${data.length} rows to process`);

      const channels = await this.getYoutubeChannels(creatorId);

      // Start processing videos in the background
      this.processBulkUploadInBackground(data, channels, creatorId).catch(
        (error) => {
          this.logger.error(
            "Error in background bulk upload processing:",
            error
          );
        }
      );

      // Return immediate response
      return {
        success: true,
        message: `Started processing ${data.length} videos from XLSX file. This may take some time.`,
        totalVideos: data.length,
      };
    } catch (error) {
      this.logger.error("Error processing XLSX data", error);
      throw new Error(`Failed to process XLSX data: ${error.message}`);
    }
  }

  private async processBulkUploadInBackground(
    data: BulkUploadRow[],
    channels: YoutubeChannelBasicDTO[],
    creatorId: string
  ) {
    const results = [];
    const errors = [];

    // Process videos in parallel using worker threads
    const workerPromises = data.map(async (row) => {
      return new Promise((resolve, reject) => {
        const channel = channels.find(
          (ch) => ch.title.toLowerCase() === row.channelId?.toLowerCase()
        );
        if (row.channelId && !channel) {
          reject(
            new Error(
              `Channel "${row.channelId}" not found for creator ${creatorId}`
            )
          );
          return;
        }

        // Create a new worker
        const worker = new Worker(
          path.join(__dirname, "workers", "bulk-upload.worker.js"),
          {
            workerData: {
              row,
              channel,
              sessionId: `session-${uuidv4()}`,
            },
          }
        );

        worker.on("message", async (result) => {
          if (result.success) {
            try {
              const video = await this.finalizeVideoSubmission(
                result.data,
                creatorId
              );
              resolve(video);
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error(result.error));
          }
        });

        worker.on("error", reject);
        worker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
    });

    // Wait for all workers to complete
    const processedResults = await Promise.allSettled(workerPromises);

    // Process results
    processedResults.forEach((result) => {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        errors.push(result.reason);
      }
    });

    this.logger.log(
      `Background processing completed. Successfully processed ${results.length} videos. Errors: ${errors.length}`
    );
  }

  async shareVideo(data: ShareVideoDTO) {
    const { videoId, emails } = data;

    // Check if video exists
    const video = await this.prisma.video.findUnique({
      where: { id: videoId },
      select: {
        id: true,
        title: true,
        creator: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${videoId} not found`);
    }

    // Generate a unique token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token expires in 7 days

    // Store the token
    await this.prisma.videoShareToken.create({
      data: {
        token,
        videoId,
        expiresAt,
      },
    });

    // If emails are provided, send share notifications
    if (emails && emails.length > 0) {
      const shareUrl = `${process.env.CLIENT_URL}/videos/${videoId}/share/${token}`;

      await this.notificationService.sendNotification({
        name: "VIDEO_SHARE" as NotificationName,
        channels: ["email"],
        props: {
          title: video.title,
          creatorName: video.creator.username,
          shareUrl,
        },
        recipients: {
          emails,
        },
      });
    }

    return { token };
  }

  async validateShareToken(videoId: number, token: string) {
    const shareToken = await this.prisma.videoShareToken.findFirst({
      where: {
        videoId,
        token,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!shareToken) {
      throw new BadRequestException("Invalid or expired share token");
    }

    // Mark token as used
    await this.prisma.videoShareToken.update({
      where: { id: shareToken.id },
      data: { used: true },
    });

    return { valid: true };
  }
}
