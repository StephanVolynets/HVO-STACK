import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/src/prisma.service";
import { TaskType, AudioDubStatus, TaskStatus } from "@prisma/client";
import { NotificationService } from "./notifications.service";
import { BoxService } from "src/storage/providers/box.service";
import { VIDEO_SUBFOLDERS } from "src/storage/constants/storage.constants";
import { NOTIFICATION_NAME, NotificationName } from "../constants";
import { AuthService } from "src/auth/auth.service";
import { DiscordGeneratorService } from "./discord-generator.service";
import { formatDate } from "src/helpers/misc";

@Injectable()
export class NotificationGeneratorService {
  private readonly logger: Logger = new Logger(NotificationGeneratorService.name);
  private readonly clientUrl = process.env.CLIENT_URL;
  private readonly staffClientUrl = process.env.STAFF_CLIENT_URL;
  private readonly paEmail = process.env.EMAIL_PA;

  constructor(private readonly prisma: PrismaService, private readonly boxProvider: BoxService, private readonly notificationService: NotificationService, private readonly authService: AuthService, private readonly discordGeneratorService: DiscordGeneratorService) {}

  private getTaskLink = async (taskId: number, userId: number) => {
    const token = await this.authService.getOrCreateJWT(userId);
    return `${this.staffClientUrl}/dashboard/staff/tasks?taskId=${taskId}&token=${token}`;
  };

  // ---------- Start of essential notifications ----------

  async sendRawTranscriptReadyNotification(videoId: number) {
    try {
      this.logger.log(`Sending raw transcript ready notification for video ${videoId}`);

      const video = await this.prisma.video.findUnique({
        where: {
          id: +videoId,
        },
        select: {
          isRawTranscriptReady: true,
          raw_script_folder_id: true,
          mp4_folder_id: true,
          m_and_e_folder_id: true,
          transcriptionTask: {
            select: {
              id: true,
              resources_folder_id: true,
              expected_delivery_date: true,
              staffs: {
                select: {
                  staff: {
                    select: {
                      user: { select: { id: true, email: true, full_name: true } },
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
            },
          },
        },
      });

      // For this notifications we need 2 conditions:
      // 1. Staff is assigned to the transcription task
      // 2. Sonix is done with the transcription
      if (!video.isRawTranscriptReady || video.transcriptionTask.staffs.length === 0) {
        this.logger.log(`Raw transcript is not ready for video ${videoId}. Conditions: IsRawTranscriptReady: ${video.isRawTranscriptReady} Staffs: ${video.transcriptionTask.staffs.length}`);
        return;
      }

      const transcriptionTask = video.transcriptionTask;

      const title = video.title;
      const creatorName = video.creator.username;

      // lets get folderId of SoruceFiles

      const mp4_folder_id = video.mp4_folder_id;
      const videoFileId = await this.boxProvider.getFileByName(mp4_folder_id, `${video.title}.mp4`).then((file) => file.id);

      const videoLink = await this.boxProvider.generateDownloadUrl(videoFileId);

      const transcriptLink = await this.boxProvider.generateSharedLink(transcriptionTask.resources_folder_id, "open");
      const dueDate = formatDate(transcriptionTask.expected_delivery_date);

      const userId = transcriptionTask.staffs[0].staff.user.id;
      const taskLink = await this.getTaskLink(transcriptionTask.id, userId);

      const props = {
        title,
        creatorName,
        videoLink,
        transcriptLink,
        dueDate,
        taskLink,
      };

      const recipients = transcriptionTask.staffs.map((staff) => staff.staff.user.email);

      await this.notificationService.sendNotification({
        name: "RAW_TRANSCRIPT_READY",
        channels: ["email"],
        props,
        recipients: {
          emails: recipients,
        },
      });

      this.logger.log(`Raw transcript ready notification sent to ${recipients}. With data: ${JSON.stringify(props)} `);

      // Send notification to PA
      const transcriptorName = transcriptionTask.staffs[0].staff.user.full_name;
      await this.sendRawTranscriptReadyPANotification(title, creatorName, transcriptorName, dueDate);
    } catch (error) {
      this.logger.error(`Error sending raw transcript ready notification for video ${videoId}: ${error}`);
    }
  }

  async sendFinalTranscriptReadyNotification(taskId: number, filterLanguageId?: number) {
    // Improve the way you fetch video and audioDub
    try {
      // When transcript is ready, we need to send notification to all staffs on ALL audiodubs. 1 Transcript -> N AudioDubs
      this.logger.log(`Sending final transcript ready notification for task ${taskId}`);
      console.log("filterLanguageId", filterLanguageId);

      // Fix this later (Basically for 2 kind of places this can be called. If its called after feedback is approved, we need to filter by languageId. but we also have to get the taskId of the Transcription not the Translation..)
      if (filterLanguageId) {
        const task = await this.prisma.task.findUnique({
          where: {
            id: taskId,
          },

          select: {
            audioDub: {
              select: {
                videoId: true,
              },
            },
          },
        });

        console.log("Task", task);

        const transcriptionTask = await this.prisma.task.findFirst({
          where: {
            video: {
              id: task.audioDub.videoId,
            },
            type: TaskType.TRANSCRIPTION,
          },
        });
        console.log("transcriptionTask", transcriptionTask);

        taskId = transcriptionTask.id;
      }

      const task = await this.prisma.task.findUnique({
        where: {
          id: taskId,
        },
        select: {
          // Video: {
          //   select: {
          //     id: true,
          //     title: true,
          //     root_folder_id: true,
          //     creator: {
          //       select: {
          //         username: true,
          //       },
          //     },
          //   },
          // },
          // audioDub: {
          //   select: {
          //     id: true,
          //     language: {
          //       select: {
          //         name: true,
          //       },
          //     },
          //   },
          // },
          video: {
            select: {
              id: true,
            },
          },
        },
      });

      console.log("task", task);

      const translationTasks = await this.prisma.task.findMany({
        where: {
          audioDub: {
            video: {
              id: task.video.id,
            },
            ...(filterLanguageId ? { languageId: filterLanguageId } : {}),
          },
          type: TaskType.TRANSLATION,
        },
        select: {
          id: true,
          resources_folder_id: true,
          staffs: {
            select: {
              staff: {
                select: {
                  user: { select: { email: true, full_name: true, id: true } },
                },
              },
            },
          },
          expected_delivery_date: true,
          audioDub: {
            select: {
              language: { select: { name: true } },
              video: {
                select: {
                  id: true,
                  title: true,
                  root_folder_id: true,
                  mp4_folder_id: true,
                  m_and_e_folder_id: true,
                  creator: {
                    select: {
                      id: true,
                      username: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // lets get folderId of SoruceFiles

      const mp4_folder_id = translationTasks[0].audioDub.video.mp4_folder_id;
      const videoFileId = await this.boxProvider.getFileByName(mp4_folder_id, `${translationTasks[0].audioDub.video.title}.mp4`).then((file) => file.id);

      const videoLink = await this.boxProvider.generateDownloadUrl(videoFileId);

      const title = translationTasks[0].audioDub.video.title;
      const creatorName = translationTasks[0].audioDub.video.creator.username;

      console.log("translationTasks", translationTasks);

      for (const translationTask of translationTasks) {
        const language = translationTask.audioDub.language.name;
        const recipients = translationTask.staffs.map((staff) => staff.staff.user.email);

        // TODO: Discuss it with Mena
        if (translationTask.staffs.length === 0) {
          this.logger.warn(`No staffs found for translation task ${translationTask.id}`);
          continue;
        }

        const dueDate = formatDate(translationTask.expected_delivery_date);

        const userId = translationTask.staffs[0].staff.user.id;
        const uploadLink = await this.getTaskLink(translationTask.id, userId);

        const englishScriptLink = await this.boxProvider.generateSharedLink(translationTask.resources_folder_id, "open");

        const props = { title, creatorName, videoLink, englishScriptLink, language, dueDate, uploadLink };
        // Should be 1 translator per language (but lets make it handle multiple translators)
        await this.notificationService.sendNotification({
          name: "FINAL_TRANSCRIPT_READY",
          channels: ["email"],
          props,
          recipients: {
            emails: recipients,
          },
        });

        this.logger.log(`Final transcript ready notification sent to ${recipients}. With data: ${JSON.stringify(props)} `);

        // Send notification to PA
        const translatorName = translationTask.staffs[0].staff.user.full_name;
        await this.sendFinalTranscriptReadyPANotification(title, creatorName, translatorName, language, dueDate);

        // Send Discord Notification
        await this.discordGeneratorService.sendFinalTranscriptReadyNotification({
          creatorId: translationTask.audioDub.video.creator.id,
          videoId: translationTask.audioDub.video.id,
          videoTitle: translationTask.audioDub.video.title,
          translatorName: translationTask.staffs[0].staff.user.full_name,
          language,
          dueDate,
        });
      }
    } catch (error) {
      this.logger.error(`Error sending final transcript ready notification for task ${taskId}: ${error}`);
    }
  }

  async sendTranslationReadyNotification(taskId: number) {
    this.logger.log(`Sending translation ready notification for task ${taskId}`);

    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: taskId,
        },
        select: {
          audioDub: {
            select: {
              id: true,
              language: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      console.log("task", task);

      const voiceOverTask = await this.prisma.task.findFirst({
        where: {
          audioDub: {
            id: task.audioDub.id,
          },
          type: TaskType.VOICE_OVER,
        },
        select: {
          id: true,
          expected_delivery_date: true,
          resources_folder_id: true,
          audioDub: {
            select: {
              video: {
                select: {
                  id: true,
                  root_folder_id: true,
                  mp4_folder_id: true,
                  title: true,
                  creator: {
                    select: {
                      id: true,
                      username: true,
                    },
                  },
                },
              },
            },
          },
          staffs: {
            select: {
              staff: {
                select: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      full_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // lets get folderId of SoruceFiles

      const mp4_folder_id = voiceOverTask.audioDub.video.mp4_folder_id;
      const videoFileId = await this.boxProvider.getFileByName(mp4_folder_id, `${voiceOverTask.audioDub.video.title}.mp4`).then((file) => file.id);

      const title = voiceOverTask.audioDub.video.title;
      const creatorName = voiceOverTask.audioDub.video.creator.username;

      const videoLink = await this.boxProvider.generateDownloadUrl(videoFileId);
      const scriptLink = await this.boxProvider.generateSharedLink(voiceOverTask.resources_folder_id, "open");

      const langaugeName = task.audioDub.language.name;
      for (const staff of voiceOverTask.staffs) {
        const recipient = staff.staff.user.email;
        const userId = staff.staff.user.id;
        const uploadLink = await this.getTaskLink(voiceOverTask.id, userId);
        const dueDate = formatDate(voiceOverTask.expected_delivery_date);

        const props = {
          title,
          creatorName,
          videoLink,
          scriptLink,
          scriptLanguage: langaugeName,
          dueDate,
          uploadLink,
        };

        await this.notificationService.sendNotification({
          name: "TRANSLATION_READY",
          channels: ["email"],
          props,
          recipients: {
            emails: [recipient],
          },
        });

        // Log details about the notification including data
        this.logger.log(`Translation ready notification sent to ${recipient}. With data: ${JSON.stringify(props)} `);

        // Send notification to PA
        const actorName = voiceOverTask.staffs[0].staff.user.full_name;
        await this.sendTranslationReadyPANotification(title, creatorName, langaugeName, actorName, dueDate);

        // Send Discord Notification
        await this.discordGeneratorService.sendTranslationReadyNotification({
          creatorId: voiceOverTask.audioDub.video.creator.id,
          videoId: voiceOverTask.audioDub.video.id,
          videoTitle: voiceOverTask.audioDub.video.title,
          actorName,
          language: langaugeName,
          dueDate,
        });
      }
    } catch (error) {
      this.logger.error(`Error sending translation ready notification for task ${taskId}: ${error}`);
    }
  }

  async sendVoiceOverReadyNotification(taskId: number) {
    this.logger.log(`Sending voice over ready notification for task ${taskId}`);

    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: taskId,
        },
        select: {
          audioDub: {
            select: {
              id: true,
              video: {
                select: {
                  id: true,
                  title: true,
                  root_folder_id: true,
                  mp4_folder_id: true,
                  creator: {
                    select: {
                      id: true,
                      username: true,
                    },
                  },
                },
              },
              language: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      console.log("works 1 ", task);

      const audioEngineeringTask = await this.prisma.task.findFirst({
        where: {
          audioDub: {
            id: task.audioDub.id,
          },
          type: TaskType.AUDIO_ENGINEERING,
        },
        select: {
          id: true,
          expected_delivery_date: true,
          resources_folder_id: true,
          staffs: {
            select: {
              staff: {
                select: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      full_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // lets get folderId of SoruceFiles

      const mp4_folder_id = task.audioDub.video.mp4_folder_id;

      const videoFileId = await this.boxProvider.getFileByName(mp4_folder_id, `${task.audioDub.video.title}.mp4`).then((file) => file.id);

      const title = task.audioDub.video.title;
      const creatorName = task.audioDub.video.creator.username;

      const videoLink = await this.boxProvider.generateDownloadUrl(videoFileId);
      const language = task.audioDub.language.name;
      const rawAudioLink = await this.boxProvider.generateSharedLink(audioEngineeringTask.resources_folder_id, "open");
      const dueDate = formatDate(audioEngineeringTask.expected_delivery_date);

      const userId = audioEngineeringTask.staffs[0].staff.user.id;
      const uploadLink = await this.getTaskLink(audioEngineeringTask.id, userId);

      const props = {
        title,
        creatorName,
        videoLink,
        language,
        rawAudioLink,
        dueDate,
        uploadLink,
      };

      const recipients = audioEngineeringTask.staffs.map((staff) => staff.staff.user.email);

      await this.notificationService.sendNotification({
        name: "VOICE_OVER_READY",
        channels: ["email"],
        props,
        recipients: {
          emails: recipients,
        },
      });

      this.logger.log(`Voice over ready notification sent to ${recipients}. With data: ${JSON.stringify(props)} `);

      // Send notification to PA
      const soundEngineerName = audioEngineeringTask.staffs[0].staff.user.full_name;
      await this.sendVoiceOverReadyPANotification(title, creatorName, language, soundEngineerName, dueDate);

      // Send Discord Notification
      await this.discordGeneratorService.sendVoiceOverReadyNotification({
        creatorId: task.audioDub.video.creator.id,
        videoId: task.audioDub.video.id,
        videoTitle: task.audioDub.video.title,
        engineerName: soundEngineerName,
        language,
        dueDate,
      });
    } catch (error) {
      this.logger.error(`Error sending voice over ready notification for task ${taskId}: ${error}`);
    }
  }

  // ---------- End of essential notifications ----------

  async sendNewVideoSubmissionPANotification(videoId: number) {
    this.logger.log(`Sending new video submission PA notification for video ${videoId}`);

    try {
      const video = await this.prisma.video.findUnique({
        where: {
          id: videoId,
        },
        select: {
          title: true,
          creator: {
            select: {
              username: true,
            },
          },
        },
      });

      const title = video.title;
      const creatorName = video.creator.username;
      const url = process.env.CLIENT_URL;

      const props = {
        title,
        creatorName,
        url,
      };

      await this.notificationService.sendNotification({
        name: "NEW_VIDEO_SUBMISSION_PA",
        channels: ["email"],
        props,
        recipients: {
          emails: [this.paEmail],
        },
      });

      this.logger.log(`New video submission PA notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);
    } catch (error) {
      this.logger.error(`Error sending new video submission PA notification for video ${videoId}: ${error}`);
    }
  } // works

  // Needs to be discussed with Mena
  async sendStaffAssignedPANotification(audioDubId: number) {
    this.logger.log(`Sending staff assigned PA notification for audio dub ${audioDubId}`);

    try {
      const audioDub = await this.prisma.audioDub.findUnique({
        where: {
          id: audioDubId,
        },
        select: {
          id: true,
          language: {
            select: {
              name: true,
            },
          },
          video: {
            select: {
              title: true,
              transcriptionTask: {
                select: {
                  expected_delivery_date: true,
                  staffs: {
                    select: {
                      staff: {
                        select: {
                          user: {
                            select: {
                              full_name: true,
                            },
                          },
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

      const translationTask = await this.prisma.task.findFirst({
        where: {
          audioDub: {
            id: audioDub.id,
          },
          type: TaskType.TRANSLATION,
        },
        select: {
          expected_delivery_date: true,
          staffs: {
            select: {
              staff: {
                select: {
                  user: {
                    select: {
                      full_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const voiceOverTask = await this.prisma.task.findFirst({
        where: {
          audioDub: {
            id: audioDub.id,
          },
          type: TaskType.VOICE_OVER,
        },
        select: {
          expected_delivery_date: true,
          staffs: {
            select: {
              staff: {
                select: {
                  user: {
                    select: {
                      full_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const audioEngineeringTask = await this.prisma.task.findFirst({
        where: {
          audioDub: {
            id: audioDub.id,
          },
          type: TaskType.AUDIO_ENGINEERING,
        },
        select: {
          expected_delivery_date: true,
          staffs: {
            select: {
              staff: {
                select: {
                  user: {
                    select: {
                      full_name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const title = audioDub.video.title;
      const language = audioDub.language.name;

      const transcriptorName = audioDub.video.transcriptionTask.staffs[0].staff.user.full_name;
      const transcriptionDueDate = formatDate(audioDub.video.transcriptionTask.expected_delivery_date);

      const translatorName = translationTask.staffs[0].staff.user.full_name;
      const translationDueDate = formatDate(translationTask.expected_delivery_date);

      const voiceActors = voiceOverTask.staffs.map((staff) => staff.staff.user.full_name);
      const recordingDueDate = formatDate(voiceOverTask.expected_delivery_date);

      const soundEngineerName = audioEngineeringTask.staffs[0].staff.user.full_name;
      const soundEngineeringDueDate = formatDate(audioEngineeringTask.expected_delivery_date);

      const assignedBy = "vendor@hvo.com";

      const props = {
        title,
        language,
        transcriptorName,
        transcriptionDueDate,
        translatorName,
        translationDueDate,
        voiceActors,
        recordingDueDate,
        soundEngineerName,
        soundEngineeringDueDate,
        assignedBy,
      };

      await this.notificationService.sendNotification({
        name: "STAFF_ASSIGNED_PA",
        channels: ["email"],
        props,
        recipients: {
          emails: [this.paEmail],
        },
      });

      this.logger.log(`Staff assigned PA notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);
    } catch (error) {
      this.logger.error(`Error sending staff assigned PA notification for audio dub ${audioDubId}: ${error}`);
    }
  }

  async sendSonixGeneratingNotification(videoId: number) {
    this.logger.log(`Sending sonix generating notification for video ${videoId}`);

    try {
      const video = await this.prisma.video.findUnique({
        where: {
          id: videoId,
        },
        select: {
          title: true,
          creator: {
            select: {
              username: true,
            },
          },
        },
      });

      const title = video.title;
      const creatorName = video.creator.username;

      const props = { title, creatorName };

      await this.notificationService.sendNotification({
        name: "SONIX_GENERATING",
        channels: ["email"],
        props,
        recipients: {
          emails: [this.paEmail],
        },
      });

      this.logger.log(`Sonix generating notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);
    } catch (error) {
      this.logger.error(`Error sending sonix generating notification for video ${videoId}: ${error}`);
    }
  } // works

  async sendSonixCompletedNotification(videoId: number) {
    this.logger.log(`Sending sonix completed notification for video ${videoId}`);

    try {
      const video = await this.prisma.video.findUnique({
        where: {
          id: videoId,
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

      const title = video.title;
      const creatorName = video.creator.username;

      const originalTranscriptFolderId = await this.boxProvider.getFileByName(video.root_folder_id, VIDEO_SUBFOLDERS.ORIGINAL_TRANSCRIPT).then((folder) => folder.id);

      const rawScriptFolderId = await this.boxProvider.getFileByName(originalTranscriptFolderId, VIDEO_SUBFOLDERS.RAW_SCRIPT).then((file) => file.id);

      const rawScriptLink = await this.boxProvider.generateSharedLink(rawScriptFolderId, "open");

      const props = { title, creatorName, boxLink: rawScriptLink };

      await this.notificationService.sendNotification({
        name: "SONIX_COMPLETED",
        channels: ["email"],
        props,
        recipients: {
          emails: [this.paEmail],
        },
      });

      this.logger.log(`Sonix completed notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);
    } catch (error) {
      this.logger.error(`Error sending sonix completed notification for video ${videoId}: ${error}`);
    }
  } // TBT. we need Sonix Hook

  async sendMP4GeneratingNotification(videoId: number) {
    this.logger.log(`Sending MP4 generating notification for video ${videoId}`);

    try {
      const video = await this.prisma.video.findUnique({
        where: {
          id: videoId,
        },
        select: {
          title: true,
          creator: {
            select: {
              username: true,
            },
          },
        },
      });

      const title = video.title;
      const creatorName = video.creator.username;

      const props = { title, creatorName };

      await this.notificationService.sendNotification({
        name: "MP4_GENERATING",
        channels: ["email"],
        props,
        recipients: {
          emails: [this.paEmail],
        },
      });

      this.logger.log(`MP4 generating notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);
    } catch (error) {
      this.logger.error(`Error sending MP4 generating notification for video ${videoId}: ${error}`);
    }
  } // works

  async sendMP4CompletedNotification(videoId: number) {
    this.logger.log(`Sending MP4 completed notification for video ${videoId}`);

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
              username: true,
            },
          },
        },
      });

      const title = video.title;
      const creatorName = video.creator.username;


      const mp4_folder_id = video.mp4_folder_id;
      const sourceFilesLink = await this.boxProvider.generateSharedLink(mp4_folder_id, "open");

      const props = { title, creatorName, boxLink: sourceFilesLink };

      await this.notificationService.sendNotification({
        name: "MP4_COMPLETED",
        channels: ["email"],
        props,
        recipients: {
          emails: [this.paEmail],
        },
      });

      this.logger.log(`MP4 completed notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);
    } catch (error) {
      this.logger.error(`Error sending MP4 completed notification for video ${videoId}: ${error}`);
    }
  }

  // ------------------------------------------------------------------------------------------------
  // Called when transcript ready email is sent to Transcriptor
  private async sendRawTranscriptReadyPANotification(title: string, creatorName: string, transcriptorName: string, dueDate: string) {
    this.logger.log(`Sending raw transcript ready PA notification for video ${title}, ${creatorName}, ${transcriptorName}, ${dueDate}`);

    try {
      const props = { title, creatorName, transcriptorName, dueDate };

      await this.notificationService.sendNotification({
        name: "RAW_TRANSCRIPT_READY_PA",
        channels: ["email"],
        props,
        recipients: {
          emails: [this.paEmail],
        },
      });

      this.logger.log(`Raw transcript ready PA notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);
    } catch (error) {
      this.logger.error(`Error sending raw transcript ready PA notification for video ${title}, ${creatorName}, ${transcriptorName}, ${dueDate}: ${error}`);
    }
  }

  // [1.Uploaded]
  async sendTranscriptionUploadedPANotification(taskId: number) {
    this.logger.log(`Sending transcription uploaded PA notification for task ${taskId}`);

    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: taskId,
        },
        select: {
          // audioDub: {
          //   select: {
          //     video: { select: { title: true, creator: { select: { username: true } } } },
          //   },
          // },
          video: { select: { title: true, creator: { select: { username: true } } } },
          staffs: {
            select: {
              staff: {
                select: { user: { select: { email: true, full_name: true } } },
              },
            },
          },
          uploaded_files_folder_id: true,
        },
      });

      const boxLink = await this.boxProvider.generateSharedLink(task.uploaded_files_folder_id, "open");

      const title = task.video.title;
      const creatorName = task.video.creator.username;
      const transcriptorName = task.staffs[0].staff.user.full_name;

      const props = { title, creatorName, transcriptorName, boxLink };

      await this.notificationService.sendNotification({
        name: "TRANSCRIPTION_UPLOADED_PA",
        channels: ["email"],
        props,
        recipients: {
          emails: [this.paEmail],
        },
      });

      this.logger.log(`Transcription uploaded PA notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);
    } catch (error) {
      this.logger.error(`Error sending transcription uploaded PA notification for task ${taskId}: ${error}`);
    }
  } // Works

  private async sendFinalTranscriptReadyPANotification(title: string, creatorName: string, translatorName: string, language: string, dueDate: string) {
    this.logger.log(`Sending final transcript ready PA notification for video ${title}, ${creatorName}, ${translatorName}, ${language}, ${dueDate}`);

    try {
      const props = { title, creatorName, translatorName, language, dueDate };

      await this.notificationService.sendNotification({
        name: "FINAL_TRANSCRIPT_READY_PA",
        channels: ["email"],
        props,
        recipients: {
          emails: [this.paEmail],
        },
      });

      this.logger.log(`Final transcript ready PA notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);
    } catch (error) {
      this.logger.error(`Error sending final transcript ready PA notification for video ${title}, ${creatorName}, ${translatorName}, ${language}, ${dueDate}: ${error}`);
    }
  } // Works

  // [2.Uploaded]
  async sendTranslationUploadedPANotification(taskId: number) {
    this.logger.log(`Sending translation uploaded PA notification for task ${taskId}`);

    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: taskId,
        },
        select: {
          audioDub: {
            select: {
              video: { select: { id: true, title: true, creator: { select: { id: true, username: true } } } },
              language: { select: { name: true } },
            },
          },
          staffs: {
            select: {
              staff: {
                select: { user: { select: { email: true, full_name: true } } },
              },
            },
          },
          uploaded_files_folder_id: true,
        },
      });

      const boxLink = await this.boxProvider.generateSharedLink(task.uploaded_files_folder_id, "open");

      const title = task.audioDub.video.title;
      const creatorName = task.audioDub.video.creator.username;
      const translatorName = task.staffs[0].staff.user.full_name;
      const language = task.audioDub.language.name;

      const props = { title, creatorName, language, translatorName, boxLink };

      await this.notificationService.sendNotification({
        name: "TRANSLATION_UPLOADED_PA",
        channels: ["email"],
        props,
        recipients: { emails: [this.paEmail] },
      });

      this.logger.log(`Translation uploaded PA notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);

      // Send Discord Notification
      await this.discordGeneratorService.sendTranslationUploadedNotification({
        creatorId: task.audioDub.video.creator.id,
        videoId: task.audioDub.video.id,
        videoTitle: task.audioDub.video.title,
        translatorName: task.staffs[0].staff.user.full_name,
        language: task.audioDub.language.name,
      });
    } catch (error) {
      this.logger.error(`Error sending translation uploaded PA notification for task ${taskId}: ${error}`);
    }
  } // Works

  private async sendTranslationReadyPANotification(title: string, creatorName: string, scriptLanguage: string, actorName: string, dueDate: string) {
    this.logger.log(`Sending voice over ready PA notification`);

    try {
      const props = { title, creatorName, scriptLanguage, actorName, dueDate };

      await this.notificationService.sendNotification({
        name: "TRANSLATION_READY_PA",
        channels: ["email"],
        props,
        recipients: { emails: [this.paEmail] },
      });

      this.logger.log(`Voice over ready PA notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);
    } catch (error) {
      this.logger.error(`Error sending voice over ready PA notification: ${error}`);
    }
  } // Works

  // [3.Uploaded]
  async sendVoiceOverUploadedPANotification(taskId: number) {
    this.logger.log(`Sending voice over uploaded PA notification for task ${taskId}`);

    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: taskId,
        },
        select: {
          audioDub: {
            select: {
              video: { select: { id: true, title: true, creator: { select: { id: true, username: true } } } },
              language: { select: { name: true } },
            },
          },
          staffs: {
            select: {
              staff: { select: { user: { select: { email: true, full_name: true } } } },
            },
          },
          uploaded_files_folder_id: true,
        },
      });

      const boxLink = await this.boxProvider.generateSharedLink(task.uploaded_files_folder_id, "open");

      const title = task.audioDub.video.title;
      const creatorName = task.audioDub.video.creator.username;
      const language = task.audioDub.language.name;
      const voiceActorName = task.staffs[0].staff.user.full_name;

      const props = { title, creatorName, language, voiceActorName, boxLink };

      await this.notificationService.sendNotification({
        name: "VOICE_OVER_UPLOADED_PA",
        channels: ["email"],
        props,
        recipients: { emails: [this.paEmail] },
      });

      this.logger.log(`Voice over uploaded PA notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);

      // Send Discord Notification
      await this.discordGeneratorService.sendVoiceOverUploadedNotification({
        creatorId: task.audioDub.video.creator.id,
        videoId: task.audioDub.video.id,
        videoTitle: task.audioDub.video.title,
        actorName: task.staffs[0].staff.user.full_name,
        language: task.audioDub.language.name,
      });
    } catch (error) {
      this.logger.error(`Error sending voice over uploaded PA notification for task ${taskId}: ${error}`);
    }
  } // Works

  private async sendVoiceOverReadyPANotification(title: string, creatorName: string, language: string, soundEngineerName: string, dueDate: string) {
    this.logger.log(`Sending voice over ready PA notification for video ${title}, ${creatorName}, ${language}, ${soundEngineerName}, ${dueDate}`);

    try {
      const props = { title, creatorName, language, soundEngineerName, dueDate };

      await this.notificationService.sendNotification({
        name: "VOICE_OVER_READY_PA",
        channels: ["email"],
        props,
        recipients: { emails: [this.paEmail] },
      });

      this.logger.log(`Voice over ready PA notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);
    } catch (error) {
      this.logger.error(`Error sending voice over ready PA notification: ${error}`);
    }
  } // Works

  // [4.Ready]
  async sendAudioEngineeringReadyPANotification(taskId: number) {
    this.logger.log(`Sending audio engineering ready PA notification for task ${taskId}`);

    try {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
        select: {
          audioDub: {
            select: {
              video: { select: { id: true, title: true, creator: { select: { id: true, username: true } } } },
              language: { select: { name: true } },
            },
          },
          staffs: {
            select: {
              staff: { select: { user: { select: { email: true, full_name: true } } } },
            },
          },
          uploaded_files_folder_id: true,
        },
      });

      const boxLink = await this.boxProvider.generateSharedLink(task.uploaded_files_folder_id, "open");

      const title = task.audioDub.video.title;
      const creatorName = task.audioDub.video.creator.username;
      const language = task.audioDub.language.name;
      const soundEngineerName = task.staffs[0].staff.user.full_name;

      const props = { title, creatorName, language, soundEngineerName, boxLink };

      await this.notificationService.sendNotification({
        name: "MIXED_AUDIO_READY_PA",
        channels: ["email"],
        props,
        recipients: { emails: [this.paEmail] },
      });

      this.logger.log(`Mixed audio ready PA notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);

      // Send Discord Notification
      await this.discordGeneratorService.sendAudioEngineeringUploadedNotification({
        creatorId: task.audioDub.video.creator.id,
        videoId: task.audioDub.video.id,
        videoTitle: task.audioDub.video.title,
        engineerName: soundEngineerName,
        language,
      });
    } catch (error) {
      this.logger.error(`Error sending audio engineering ready PA notification for task ${taskId}: ${error}`);
    }
  } // Works

  async sendAllMixedAudioReadyPANotification(videoId: number) {
    this.logger.log(`Sending all mixed audio ready PA notification for video ${videoId}`);

    try {
      const video = await this.prisma.video.findUnique({
        where: { id: videoId },
        select: {
          id: true,
          title: true,
          creator: { select: { id: true, username: true } },
          root_folder_id: true,
          audioDubs: {
            select: {
              language: { select: { name: true } },
            },
          },
        },
      });

      const audioEngineeringTasks = await this.prisma.task.findMany({
        where: {
          audioDub: {
            videoId: videoId,
          },
          type: TaskType.AUDIO_ENGINEERING,
        },
        select: {
          staffs: {
            select: { staff: { select: { user: { select: { full_name: true } } } } },
          },
        },
      });

      const boxLink = await this.boxProvider.generateSharedLink(video.root_folder_id, "open");
      const title = video.title;
      const creatorName = video.creator.username;
      const languages = video.audioDubs.map((audioDub) => audioDub.language.name).join(", ");
      const soundEngineerNames = audioEngineeringTasks.map((task) => task.staffs[0].staff.user.full_name).join(", ");

      const props = { title, creatorName, languages, soundEngineerNames, boxLink };

      await this.notificationService.sendNotification({
        name: "ALL_MIXED_AUDIOS_READY_PA",
        channels: ["email"],
        props,
        recipients: { emails: [this.paEmail] },
      });

      this.logger.log(`All mixed audio ready PA notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);

      // Send Discord Notification
      await this.discordGeneratorService.sendAllMixedAudioReadyNotification({
        creatorId: video.creator.id,
        videoId: video.id,
        videoTitle: video.title,
        languages,
      });
    } catch (error) {
      this.logger.error(`Error sending all mixed audio ready PA notification for video ${videoId}: ${error}`);
    }
  } // Works

  async sendAdminSubmittedAllTranslationsPANotification(videoId: number) {
    this.logger.log(`Sending admin submitted all translations PA notification for video ${videoId}`);

    try {
      const video = await this.prisma.video.findUnique({
        where: { id: videoId },
        select: {
          title: true,
        },
      });

      const url = `${this.clientUrl}/dashboard/creator/library/video/${videoId}`;
      const title = video.title;

      const props = { title, url };

      await this.notificationService.sendNotification({
        name: "ADMIN_SUBMITTED_TRANSLATIONS",
        channels: ["email"],
        props,
        recipients: { emails: [this.paEmail] },
      });

      this.logger.log(`Admin submitted all translations PA notification sent to ${this.paEmail}. With data: ${JSON.stringify(props)} `);
    } catch (error) {
      this.logger.error(`Error sending admin submitted all translations PA notification for video ${videoId}: ${error}`);
    }
  } // Works
}
