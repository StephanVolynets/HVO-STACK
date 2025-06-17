import { Injectable, Logger } from "@nestjs/common";
import { AssignStaffDTO, AudioDubPhase, CreatorBasicDTO, FeedbackStatus, ResourceItemDTO, StaffType, TaskAudioDubDTO, TaskDTO, TaskStatus, TaskType, taskVideoDTO, UpdateTaskStaffDTO, VideoStatus } from "hvo-shared";
import { PrismaService } from "src/prisma/src/prisma.service";
import { mapStaffTypeToTaskType } from "./utils";
import { StorageService } from "src/storage/storage.service";
import { applyGetTaasksSearchTerm, applyGetTasksFilters } from "./utils/get-tasks-helpers";
import { getNextTaskType, mapTaskTypeToAudiodubPhase, sendNotificationAfterStaffAssigned } from "./utils/helpers";
import { AudioDubStatus } from "@prisma/client";
import { NotificationGeneratorService } from "src/notifications/services/notifications-generator.service";
import { DiscordGeneratorService } from "src/notifications/services/discord-generator.service";
import { VIDEO_SUBFOLDERS } from "src/storage/constants/storage.constants";
import { BoxService } from "src/storage/providers/box.service";
import { PubSubService } from "src/other-modules/pubsub/pubsub.service";
@Injectable()
export class TaskService {
  private readonly logger: Logger = new Logger(TaskService.name);
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly storageService: StorageService,
    protected readonly notificationGeneratorService: NotificationGeneratorService,
    protected readonly discordGeneratorService: DiscordGeneratorService,
    private readonly boxProvider: BoxService,
    protected readonly pubsubService: PubSubService
  ) { }

  async getTasksCount({ staffId, filter, searchTerm }: { staffId: string; filter: string; searchTerm: string }): Promise<number> {
    this.logger.log(`[TaskService.getTasksCount] Counting tasks for: ${staffId}, filter: ${filter}, searchTerm: ${searchTerm}`);

    try {
      // Build dynamic filters
      const where: any = {};

      // Add staff filter
      where.staffs = {
        some: {
          staff: {
            user: {
              email: staffId,
            },
          },
        },
      };

      // Apply search term and additional filters
      applyGetTaasksSearchTerm(where, searchTerm);
      applyGetTasksFilters(where, filter);

      // Count tasks based on where conditions
      const count = await this.prisma.task.count({ where });
      this.logger.log(`Task count for staff ${staffId}: ${count}`);
      return count;
    } catch (error) {
      this.logger.error(`Error counting tasks for staff ${staffId}`, error);
      throw new Error("Failed to retrieve task count.");
    }
  }

  async getPendingStaffAssignmentTasks(staffId: number): Promise<taskVideoDTO[]> {
    this.logger.log(`[TaskService.getPendingStaffAssignmentTasks] Fetching PENDING TASKS pending staff assignment for staffId: ${staffId}`);

    const staff = await this.prisma.staff.findUnique({
      where: {
        id: staffId,
      },
    });

    // Build dynamic filters
    const where: any = {
      type: mapStaffTypeToTaskType(staff.staff_type as StaffType),
      staffs: {
        none: {},
      },
    };

    if (staff.staff_type !== StaffType.AUDIO_ENGINEER) {
      where.audioDub = {
        languageId: staff.language_id,
      };
    }

    try {
      const tasks = await this.prisma.task.findMany({
        where,
        select: {
          id: true,
          audioDub: {
            select: {
              video: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      });

      this.logger.log(`Found ${tasks.length} tasks`);

      const taskVideoDTOs: taskVideoDTO[] = tasks.map((task) => ({
        taskId: task.id,
        videoTitle: task.audioDub.video.title,
      }));

      return taskVideoDTOs;
    } catch (error) {
      this.logger.error("Error fetching tasks", error);
      throw new Error("Failed to fetch tasks");
    }
  }

  async assignStaff(assignStaffDTO: AssignStaffDTO) {
    this.logger.log(`[TaskService.assignStaff] Assigning staff to task with data: ${JSON.stringify(assignStaffDTO)}`);

    try {
      await this.prisma.taskStaff.create({
        data: {
          taskId: assignStaffDTO.taskId,
          staffId: assignStaffDTO.staffId,
        },
      });

      this.logger.log(`Assigned staff to task`);

      return true;
    } catch (error) {
      this.logger.error("Error assigning staff to task", error);
      throw new Error("Failed to assign staff to task");
    }
  }

  async updateStaff(updateTaskStaffDTO: UpdateTaskStaffDTO) {
    try {
      this.logger.log(`[TaskService.updateStaff] Updating staff on task with data: ${JSON.stringify(updateTaskStaffDTO)}`);

      // const { taskId, staffIds: selectedStaffIds } = updateTaskStaffDTO;
      const { updates } = updateTaskStaffDTO;

      // Iterate for each update
      for (const update of updates) {
        const { taskId, staffIds: selectedStaffIds, expectedDeliveryDate } = update;

        const task = await this.prisma.task.findUnique({
          where: { id: taskId },
          select: { type: true, video: { select: { id: true } }, status: true, audioDubId: true },
        });

        const currentAssignedStaff = await this.prisma.taskStaff.findMany({
          where: { taskId },
          select: { staffId: true },
        });

        const currentStaffIds = currentAssignedStaff.map((staff) => staff.staffId);

        // Determine staff to add (those in selectedStaffIds but not in currentStaffIds)
        const staffToAdd = selectedStaffIds.filter((id) => !currentStaffIds.includes(id));

        // Determine staff to remove (those in currentStaffIds but not in selectedStaffIds)
        const staffToRemove = currentStaffIds.filter((id) => !selectedStaffIds.includes(id));

        // Add new staff
        if (staffToAdd.length > 0) {
          await this.prisma.taskStaff.createMany({
            data: staffToAdd.map((staffId) => ({
              taskId,
              staffId,
            })),
          });
        }

        // Remove unassigned staff
        if (staffToRemove.length > 0) {
          await this.prisma.taskStaff.deleteMany({
            where: {
              taskId,
              staffId: { in: staffToRemove },
            },
          });
        }

        // Update expected delivery date
        if (expectedDeliveryDate) {
          await this.prisma.task.update({
            where: {
              id: taskId,
            },
            data: {
              expected_delivery_date: expectedDeliveryDate,
            },
          });
        }

        console.log(`[TaskService.updateStaff] Task updated`);

        // Notify staff if task is transcription
        // if (task.type === TaskType.TRANSCRIPTION) {
        //   const video = await this.prisma.video.findFirst({
        //     where: {
        //       transcriptionTask: {
        //         id: taskId,
        //       },
        //     },
        //     select: {
        //       id: true,
        //     },
        //   });

        //   await this.notificationGeneratorService.sendRawTranscriptReadyNotification(video.id);
        //   await this.discordGeneratorService.sendRawTranscriptReadyNotification(video.id);
        // }

        // Notify staff if task is in progress (this includes Transcription)
        if (task.status === TaskStatus.IN_PROGRESS && staffToAdd.length > 0) {
          if (task.type === TaskType.TRANSCRIPTION) {
            await sendNotificationAfterStaffAssigned({
              taskId: null,
              taskType: task.type,
              videoId: task.video.id,
              notificationGeneratorService: this.notificationGeneratorService,
            });
          } else {
            await sendNotificationAfterStaffAssigned({
              taskId: taskId,
              taskType: task.type,
              videoId: null,
              notificationGeneratorService: this.notificationGeneratorService,
            });
          }
        }

        // If Transcription assigned set the video in Progress (Find a better way to do this)
        if (task.type === TaskType.TRANSCRIPTION) {
          // TODO: Improve this to be more efficient - We need new design where vendor sets videos InProgress
          await this.prisma.video.update({
            where: {
              id: task.video.id,
            },
            data: {
              status: VideoStatus.IN_PROGRESS,
            },
          });
        }
      }

      // const currentAssignedStaff = await this.prisma.taskStaff.findMany({
      //   where: { taskId: updateTaskStaffDTO.taskId },
      //   select: { staffId: true },
      // });

      // const currentStaffIds = currentAssignedStaff.map((staff) => staff.staffId);

      // // Determine staff to add (those in selectedStaffIds but not in currentStaffIds)
      // const staffToAdd = selectedStaffIds.filter((id) => !currentStaffIds.includes(id));

      // // Determine staff to remove (those in currentStaffIds but not in selectedStaffIds)
      // const staffToRemove = currentStaffIds.filter((id) => !selectedStaffIds.includes(id));

      // // Add new staff
      // if (staffToAdd.length > 0) {
      //   await this.prisma.taskStaff.createMany({
      //     data: staffToAdd.map((staffId) => ({
      //       taskId,
      //       staffId,
      //     })),
      //   });
      // }

      // Remove unassigned staff
      // if (staffToRemove.length > 0) {
      //   await this.prisma.taskStaff.deleteMany({
      //     where: {
      //       taskId,
      //       staffId: { in: staffToRemove },
      //     },
      //   });
      // }

      console.log(`[TaskService.updateStaff] Total staff updated: ${updates.length}`);
      return { message: "Task staff updated successfully." };
    } catch (error) {
      this.logger.error("[TaskService.updateStaff] - ", error);
      throw new Error("Failed to update task staff");
    }
  }

  async getResources(folderId: string, taskId: string, videoId: number): Promise<ResourceItemDTO[]> {
    this.logger.log(`[TaskService.getResources] a: ${folderId} - TaskId: ${taskId}`);

    try {
      // Get video file id from box
      const video = await this.prisma.video.findFirst({
        where: {
          id: videoId,
        },
        select: {
          mp4_folder_id: true,
          title: true,
        },
      });

      const resources = await this.storageService.getTaskResources(folderId, video.mp4_folder_id, video.title);
      return resources;
    } catch (error) {
      this.logger.error(`[TaskService.getResources] Error fetching resources for folderId: ${folderId}`, error);
      throw new Error("Failed to fetch resources.");
    }
  }

  async getUploadedFiles(folderId: string, taskId: string): Promise<ResourceItemDTO[]> {
    this.logger.log(`[TaskService.getUploadedFiles] Fetching uploaded files for folderId: ${folderId} - TaskId: ${taskId}`);

    try {
      const files = await this.storageService.getTaskUploadedFiles(folderId);
      return files;
    } catch (error) {
      this.logger.error(`[TaskService.getUploadedFiles] Error fetching uploaded files for folderId: ${folderId}`, error);
      throw new Error("Failed to fetch uploaded files.");
    }
  }

  // async uploadFile(taskId: number, file: Express.Multer.File) {
  //   this.logger.log(`[TaskService.uploadFile] Uploading file for task: ${taskId}`);

  //   try {
  //     const task = await this.prisma.task.findUnique({
  //       where: {
  //         id: taskId,
  //       },
  //       select: {
  //         type: true,
  //         audioDub: {
  //           select: {
  //             video: {
  //               select: {
  //                 root_folder_id: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });

  //     const folderId = task.audioDub.video.root_folder_id;
  //     const uploadFolderId = await this.storageService.getTaskUploadFolderId(folderId, task.type);

  //     return await this.storageService.uploadFileToBox(uploadFolderId, file);
  //   } catch (error) {
  //     this.logger.error(`[TaskService.uploadFile] Error uploading file for task: ${taskId}`, error);
  //     throw new Error("Failed to upload file.");
  //   }
  // }

  async completeTask(taskId: number) {
    this.logger.log(`[TaskService.completeTask] Completing task: ${taskId}`);

    try {
      const task = await this.prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          status: TaskStatus.COMPLETED,
        },
        select: {
          type: true,
          audioDubId: true,
        },
      });

      let videoId;
      if (task.type === TaskType.TRANSCRIPTION) {
        const video = await this.prisma.video.findFirst({
          where: {
            transcriptionTask: {
              id: taskId,
            },
          },
          select: {
            id: true,
          },
        });
        videoId = video.id;
      }

      const nextTaskType = getNextTaskType(task.type);
      if (nextTaskType) {
        // Audio dub not completed yet
        if (task.type === TaskType.TRANSCRIPTION) {
          // If its Transcription, we need to update all
          await this.prisma.audioDub.updateMany({
            where: {
              video: {
                id: videoId,
              },
            },
            data: {
              phase: AudioDubPhase.TRANSLATION,
            },
          });
          await this.prisma.task.updateMany({
            where: {
              audioDub: {
                video: {
                  id: videoId,
                },
              },
              type: TaskType.TRANSLATION,
            },
            data: {
              status: TaskStatus.IN_PROGRESS,
            },
          });
        } else {
          // Update audio dub phase
          await this.prisma.audioDub.update({
            where: {
              id: task.audioDubId,
            },
            data: {
              phase: mapTaskTypeToAudiodubPhase(nextTaskType),
            },
          });

          // Update next task to in progress
          await this.prisma.task.updateMany({
            where: {
              audioDubId: task.audioDubId,
              type: nextTaskType,
            },
            data: {
              status: TaskStatus.IN_PROGRESS,
            },
          });
        }
      } else {
        // Last phase has finished
        // Update audio dub status to review
        await this.prisma.audioDub.update({
          where: {
            id: task.audioDubId,
          },
          data: {
            status: AudioDubStatus.REVIEW,
            phase: mapTaskTypeToAudiodubPhase(task.type),
          },
        });
      }

      await this.handleCopyingFinalAudioToGCS(taskId);
      await this.handleTaskCompletionEmails(taskId);

      return { message: "Task completed successfully." };
    } catch (error) {
      this.logger.error(`[TaskService.completeTask] Error completing task: ${taskId}`, error);
      throw new Error("Failed to complete task.");
    }
  }

  private async handleTaskCompletionEmails(taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        type: true,
      },
    });

    switch (task.type) {
      case TaskType.TRANSCRIPTION:
        await this.notificationGeneratorService.sendTranscriptionUploadedPANotification(taskId);
        await this.notificationGeneratorService.sendFinalTranscriptReadyNotification(taskId);

        await this.discordGeneratorService.sendTranscriptionUploadedNotification(taskId);
        break;
      case TaskType.TRANSLATION:
        await this.notificationGeneratorService.sendTranslationUploadedPANotification(taskId);
        await this.notificationGeneratorService.sendTranslationReadyNotification(taskId);
        break;
      case TaskType.VOICE_OVER:
        await this.notificationGeneratorService.sendVoiceOverUploadedPANotification(taskId);
        await this.notificationGeneratorService.sendVoiceOverReadyNotification(taskId);
        break;
      case TaskType.AUDIO_ENGINEERING:
        await this.notificationGeneratorService.sendAudioEngineeringReadyPANotification(taskId);
        await this.checkIfAllAudioDubsAreCompleted(taskId);
        break;
    }
  }

  private async handleCopyingFinalAudioToGCS(taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        type: true,
      },
    });

    if (task.type === TaskType.AUDIO_ENGINEERING) {
      const audioDub = await this.prisma.audioDub.findFirst({
        where: {
          tasks: {
            some: {
              id: taskId,
            },
          },
        },
        select: {
          mixed_audio_folder_id: true,
          video: {
            select: {
              title: true,
              creator: {
                select: {
                  username: true,
                },
              },
            },
          },
          language: {
            select: {
              code: true,
            },
          },
        },
      });
      const mixedAudioFolderId = audioDub.mixed_audio_folder_id;
      // Find the first WAV or MP3 file in the deliverables folder
      const audioFiles = await this.boxProvider.listFiles(mixedAudioFolderId);
      const audioDubSrcFile = audioFiles.find((file) => file.name.toLowerCase().endsWith(".wav") || file.name.toLowerCase().endsWith(".mp3"));
      if (!audioDubSrcFile) {
        throw new Error("No WAV or MP3 audio file found in deliverables folder");
      }
      const boxDownloadUrl = await this.boxProvider.generateDirectDownloadUrl(audioDubSrcFile.id);

      const gcsDestinationPath = `videos/${audioDub.video.creator.username}/${audioDub.video.title}/dubs/${audioDub.language.code}/final_audio.wav`;
      // const boxDownloadUrl = await this.storageService.getBoxDownloadUrl(taskId);

      this.logger.log(`[TaskService.handleCopyingFinalAudioToGCS] Copying final audio to GCS: ${gcsDestinationPath}, Box Download URL: ${boxDownloadUrl}`);

      const pubSubMessage = {
        boxDownloadUrl,
        gcsDestinationPath,
        contentType: "audio/wav",
      };

      await this.pubsubService.publishMessage("box-to-gcs", pubSubMessage);
    }
  }

  private async checkIfAllAudioDubsAreCompleted(taskId: number) {
    const audioDub = await this.prisma.audioDub.findFirst({
      where: {
        tasks: {
          some: {
            id: taskId,
          },
        },
      },
      select: {
        video: {
          select: {
            id: true,
          },
        },
      },
    });

    const tasks = await this.prisma.task.findMany({
      where: {
        audioDub: {
          videoId: audioDub.video.id,
        },
        type: TaskType.AUDIO_ENGINEERING,
      },
      select: {
        status: true,
      },
    });

    this.logger.log(`[TaskService.checkIfAllAudioDubsAreCompleted] Checking if all audio dubs are completed for task: ${tasks.map((task) => task.status)}`);

    if (tasks.every((task) => task.status === TaskStatus.COMPLETED)) {
      await this.notificationGeneratorService.sendAllMixedAudioReadyPANotification(audioDub.video.id);
    }
  }
}
