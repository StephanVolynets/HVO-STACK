import { Injectable, Logger } from "@nestjs/common";
import { SelectStaffDTO, StaffSummaryDTO, StaffType, StaffVideoDTO, TaskType, VideoSummaryDTO, TaskStatus, FeedbackStatus, StaffTaskDTO, CreatorBasicDTO } from "hvo-shared";
import { PrismaService } from "src/prisma/src/prisma.service";
import { mappTaskTypeToStaffType } from "src/task/utils";
import { applyTaskStatusFilterForOtherStaff, applyTaskStatusFilterForTranscriptor, applyVideoSearchTerm } from "./utils/helpers";
import { BoxService } from "src/storage/providers/box.service";
import { NotificationGeneratorService } from "src/notifications/services/notifications-generator.service";
import { ZipDownloadRequest } from "box-typescript-sdk-gen/lib/schemas/zipDownloadRequest.generated";

@Injectable()
export class StaffService {
  private readonly logger: Logger = new Logger(StaffService.name);
  constructor(protected readonly prisma: PrismaService, protected readonly boxService: BoxService, protected readonly notificationGeneratorService: NotificationGeneratorService) {}

  async getStaffCount({ searchTerm, languageIds, role }: { searchTerm?: string; languageIds: number[]; role?: string | null }): Promise<number> {
    this.logger.log(`[StaffService.countAllStaff] Counting all staff with filters searchTerm: ${searchTerm}, langauges:  ${languageIds}, role: ${role}`);

    // Build dynamic filters
    const where: any = {};

    // Search term filter
    if (searchTerm) {
      where.OR = [{ user: { email: { contains: searchTerm, mode: "insensitive" } } }, { user: { full_name: { contains: searchTerm, mode: "insensitive" } } }];
    }

    // Role filter
    if (role) {
      where.staff_type = role;
    }

    // Language filter
    if (languageIds.length > 0) {
      where.language_id = {
        in: languageIds,
      };
    }

    const count = await this.prisma.staff.count({
      where,
    });

    this.logger.log(`[StaffService.countAllStaff] Counted ${count} staff`);
    return count;
  }

  async getStaff({ page, limit, searchTerm, languageIds, role }: { page: number; limit: number; searchTerm?: string; languageIds: number[]; role?: string | null }): Promise<StaffSummaryDTO[]> {
    this.logger.log(`[StaffService.getStaff] Retreiving staff with filters searchTerm: ${searchTerm}, languages: ${languageIds}, role: ${role}`);

    // Fetch videos with pagination
    const take = limit;
    const skip = (page - 1) * limit;

    // Build dynamic filters
    const where: any = {};

    // Search term filter
    if (searchTerm) {
      where.OR = [{ user: { full_name: { contains: searchTerm, mode: "insensitive" } } }, { user: { email: { contains: searchTerm, mode: "insensitive" } } }];
    }

    // Role filter
    if (role) {
      where.staff_type = role;
    }

    // Language filter
    if (languageIds.length > 0) {
      where.language_id = {
        in: languageIds,
      };
    }

    const staffs = await this.prisma.staff.findMany({
      where,
      take,
      orderBy: {
        created_at: 'desc',
      },
      skip,
      include: {
        user: true,
        language: true,
        tasks: {
          include: {
            task: {
              include: {
                audioDub: {
                  include: {
                    video: {
                      include: {
                        creator: {
                          select: {
                            username: true,
                            user: {
                              select: {
                                photo_url: true,
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
        },
      },
    });

    const staffSummaryDTOs: StaffSummaryDTO[] = staffs.map(
      (staff) =>
        ({
          id: staff.id,
          full_name: staff.user.full_name,
          photo_url: staff.user.photo_url,
          staff_type: staff.staff_type,
          language: {
            name: staff.language.name,
            flag_url: staff.language.flag_url,
            code: staff.language.code,
          },
          videos: staff.tasks.map(
            (task) =>
              ({
                id: task.task?.audioDub?.video?.id,
                title: task.task?.audioDub?.video?.title,
                description: task.task?.audioDub?.video?.description,
                thumbnail_url: task.task?.audioDub?.video?.thumbnail_url,
                creator: {
                  username: task.task.audioDub?.video?.creator.username,
                  photoUrl: task.task.audioDub?.video?.creator.user.photo_url,
                },
              } as VideoSummaryDTO)
          ),
        } as StaffSummaryDTO)
    );

    return staffSummaryDTOs;
  }

  /// ------------------ ///
  // async countAllStaff(): Promise<number> {
  //   this.logger.log(`[StaffService.countAllStaff] Counting all staff`);
  //   return await this.prisma.staff.count();
  // }

  // async findAll(searchTerm: string): Promise<StaffSummaryDTO[]> {
  //   this.logger.log(`[StaffService.findAll] Retreiving staff`);

  //   // Build dynamic filters
  //   const where: any = {};

  //   if (searchTerm) {
  //     where.OR = [
  //       { user: { full_name: { contains: searchTerm, mode: "insensitive" } } },
  //       { user: { email: { contains: searchTerm, mode: "insensitive" } } },
  //     ];
  //   }

  //   const staffs = await this.prisma.staff.findMany({
  //     where,
  //     include: {
  //       user: true,
  //       language: true,
  //       tasks: {
  //         include: {
  //           task: {
  //             include: {
  //               audioDub: {
  //                 include: {
  //                   video: {
  //                     include: {
  //                       creator: {
  //                         select: {
  //                           username: true,
  //                           user: {
  //                             select: {
  //                               photo_url: true,
  //                             },
  //                           },
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   const staffSummaryDTOs: StaffSummaryDTO[] = staffs.map(
  //     (staff) =>
  //       ({
  //         id: staff.id,
  //         full_name: staff.user.full_name,
  //         photo_url: staff.user.photo_url,
  //         staff_type: staff.staff_type,
  //         language: {
  //           name: staff.language.name,
  //           flag_url: staff.language.flag_url,
  //         },
  //         videos: staff.tasks.map(
  //           (task) =>
  //             ({
  //               id: task.task.audioDub.video.id,
  //               title: task.task.audioDub.video.title,
  //               description: task.task.audioDub.video.description,
  //               thumbnail_url: task.task.audioDub.video.thumbnail_url,
  //               creator: {
  //                 username: task.task.audioDub.video.creator.username,
  //                 photoUrl: task.task.audioDub.video.creator.user.photo_url,
  //               },
  //             } as VideoSummaryDTO)
  //         ),
  //       } as StaffSummaryDTO)
  //   );

  //   return staffSummaryDTOs;
  // }

  async findByTask(taskId: number): Promise<SelectStaffDTO[]> {
    try {
      this.logger.log(`[StaffService.findByTask] Retreiving staff by task`);

      const taskAndStaff = await this.prisma.task.findUnique({
        where: {
          id: +taskId,
        },
        select: {
          type: true,
          audioDub: {
            select: {
              languageId: true,
            },
          },
          staffs: {
            select: {
              staff: {
                select: {
                  user: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Dynamic staff where clause
      const where: any = {
        staff_type: mappTaskTypeToStaffType(taskAndStaff.type as TaskType),
      };

      // if (taskAndStaff.type !== TaskType.AUDIO_ENGINEERING && taskAndStaff.type !== TaskType.TRANSCRIPTION) {
      //   where.language_id = taskAndStaff.audioDub.languageId;
      // }

      const staffs = await this.prisma.staff.findMany({
        where,
        select: {
          user: {
            select: {
              id: true,
              full_name: true,
              photo_url: true,
            },
          },
        },
      });

      const selectStaffDTOs: SelectStaffDTO[] = staffs.map((staff) => ({
        id: staff.user.id,
        full_name: staff.user.full_name,
        photo_url: staff.user.photo_url,
        isSelected: taskAndStaff.staffs.some((s) => s.staff.user.id === staff.user.id),
      }));

      return selectStaffDTOs;
    } catch (error) {
      this.logger.error("Error fetching staff by task", error);
      throw new Error("Failed to fetch staff by task");
    }
  }

  // --------------- Staff Portal ---------------
  async getAssignedVideosCount(staffId: number): Promise<number> {
    this.logger.log(`[StaffService.getAssignedVideosCount] Counting assigned videos for staffId: ${staffId}`);

    try {
      // First get the staff member to determine their role
      const staff = await this.prisma.staff.findUnique({
        where: { id: staffId },
        select: { staff_type: true },
      });

      if (!staff) {
        throw new Error(`Staff member with ID ${staffId} not found`);
      }

      let count: number;

      if (staff.staff_type === StaffType.TRANSCRIPTOR) {
        // For transcriptors, count unique videos directly from tasks
        count = await this.prisma.taskStaff.count({
          where: {
            staffId,
            // task: {
            //   type: 'TRANSCRIPTION'
            // }
          },
        });
      } else {
        // For other roles, count unique videos through audio dubs
        const uniqueVideos = await this.prisma.taskStaff.findMany({
          where: {
            staffId,
            // task: {
            //   type: {
            //     not: 'TRANSCRIPTION'
            //   }
            // }
          },
          select: {
            task: {
              select: {
                audioDub: {
                  select: {
                    videoId: true,
                  },
                },
              },
            },
          },
        });

        // Use Set to get unique video IDs
        const uniqueVideoIds = new Set(uniqueVideos.map((taskStaff) => taskStaff.task.audioDub.videoId));
        count = uniqueVideoIds.size;
      }

      this.logger.log(`Found ${count} unique assigned videos for staff ${staffId}`);
      return count;
    } catch (error) {
      this.logger.error({
        message: `Failed to count assigned videos`,
        staffId,
        error: error.message,
        stack: error.stack,
        severity: "ERROR",
        service: "StaffService",
        method: "getAssignedVideosCount",
      });
      throw error;
    }
  }

  private async getTranscriptorAssignedVideos(
    staffId: number,
    options: {
      taskId?: number;
      limit: number;
      page: number;
      filter: string;
      searchTerm: string;
      creatorId?: number;
      isMultipleSelectMode: boolean;
    }
  ): Promise<StaffVideoDTO[]> {
    this.logger.log(`[StaffService.getTranscriptorAssignedVideos] Fetching videos for transcriptor ${staffId} with options: ${JSON.stringify(options)}`);
    const videos: StaffVideoDTO[] = [];

    const includeProvidedTaskId = !!(options.taskId && !(options.searchTerm || options.creatorId) && options.filter === "all_videos");
    console.log("[1] includeProvidedTaskId", includeProvidedTaskId);
    let videoIdOfProvidedTask;

    if (options.page === 0 && includeProvidedTaskId) {
      const task = await this.prisma.task.findUnique({
        where: { id: +options.taskId },
        select: {
          status: true,
          uploaded_files_folder_id: true,
          feedbacks: {
            where: {
              feedback: {
                status: FeedbackStatus.IN_PROGRESS,
              },
            },
          },
          video: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!task) {
        this.logger.log(`[StaffService.getTranscriptorAssignedVideos] Task with ID ${options.taskId} not found`);
      } else {
        videos.push({
          id: task.video.id,
          title: task.video.title,
          tasks: [{
            status: task.status as TaskStatus,
            taskId: +options.taskId,
            languageName: "",
            languageCode: "",
            languageId: -1,
            uploadedFilesFolderId: task.uploaded_files_folder_id
          }],
          hasActiveFeedback: task.feedbacks.length > 0
        })
      }
    }

    // Build dynamic filters
    const where: any = {
      transcriptionTask: {
        ...(includeProvidedTaskId ? { id: { not: options.taskId } } : {}),
        staffs: {
          some: {
            staff: {
              user: {
                id: staffId,
              },
            },
          },
        },
      },
      ...(options.creatorId ? { creator_id: options.creatorId } : {})
    }

    console.log("[2] where", JSON.stringify(where));

    // If we should exclude the video with the specific task
    // if (options.taskId && !options.isMultipleSelectMode && options.filter !== "all_videos") {
    //   // Get the video ID for the task's video
    //   const task = await this.prisma.task.findUnique({
    //     where: { id: options.taskId },
    //     select: {
    //       video: {
    //         select: {
    //           id: true
    //         }
    //       }
    //     }
    //   });

    //   if (task?.video?.id) {
    //     // Add AND NOT condition to skip this video
    //     where.AND = where.AND || [];
    //     where.AND.push({
    //       NOT: {
    //         id: task.video.id
    //       }
    //     });
    //   }
    // }

    if(options.isMultipleSelectMode) {
      options.filter = "ready_for_work";
    }
    applyVideoSearchTerm(where, options.searchTerm);
    applyTaskStatusFilterForTranscriptor(where, options.filter);

    console.log("[3] where", JSON.stringify(where));

    const _videos = await this.prisma.video.findMany({
      take: options.limit,
      skip: options.page * options.limit,
      where,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        title: true,
        transcriptionTask: {
          select: {
            id: true,
            status: true,
            uploaded_files_folder_id: true,
            
            feedbacks: {
              where: {
                feedback: {
                  status: FeedbackStatus.IN_PROGRESS,
                },
              },
            },
          },
        },
      },
    });

    for (const video of _videos) {
      videos.push({
        id: video.id,
        title: video.title,
        tasks: [{
          status: video.transcriptionTask.status as TaskStatus,
          taskId: video.transcriptionTask.id,
          languageName: "",
          languageCode: "",
          languageId: -1,
          uploadedFilesFolderId: video.transcriptionTask.uploaded_files_folder_id
        }],
        hasActiveFeedback: video.transcriptionTask.feedbacks.length > 0
      })
    }

    return videos;
  }

  private async getOtherStaffAssignedVideos(
    staffId: number,
    options: {
      taskId?: number;
      limit?: number;
      page?: number;
      filter: string;
      searchTerm: string;
      creatorId?: number;
      isMultipleSelectMode: boolean;
    }
  ): Promise<StaffVideoDTO[]> {
    this.logger.log(`[StaffService.getOtherStaffAssignedVideos] Fetching videos for staffId: ${staffId} with options: ${JSON.stringify(options)}`);
    const videos: StaffVideoDTO[] = [];

    const includeProvidedTaskId = !!(options.taskId && !(options.searchTerm || options.creatorId) && options.filter === "all_videos");
    let videoIdOfProvidedTask;

    if (options.page === 0 && options.taskId && includeProvidedTaskId) {
      this.logger.log(`[StaffService.getOtherStaffAssignedVideos] Fetching video for taskId: ${options.taskId}`);
      const task = await this.prisma.task.findUnique({
        where: { id: +options.taskId },
        select: {
          audioDub: {
            select: { videoId: true },
          },
        },
      });

      const video = await this.prisma.video.findUnique({
        where: { id: task.audioDub.videoId },
        select: {
          id: true,
          title: true,
          audioDubs: {
            select: {
              language: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
              tasks: {
                where: {
                  staffs: {
                    some: {
                      staffId: staffId,
                    },
                  },
                },
                select: {
                  id: true,
                  status: true,
                  type: true,
                  uploaded_files_folder_id: true,
                  feedbacks: {
                    where: {
                      feedback: {
                        status: FeedbackStatus.IN_PROGRESS,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      videos.push({
        id: video.id,
        title: video.title,
        tasks: video.audioDubs
          .filter((audioDub) => audioDub.tasks.length > 0)
          .sort((a, b) => (a.tasks[0].id === options.taskId ? -1 : b.tasks[0].id === options.taskId ? 1 : 0)) // Set the taskId to the first element
          .map((audioDub) => ({
            status: audioDub.tasks[0].status as TaskStatus,
            taskId: audioDub.tasks[0].id,
            languageName: audioDub.language.name,
            languageCode: audioDub.language.code,
            languageId: audioDub.language.id,
            uploadedFilesFolderId: audioDub.tasks[0].uploaded_files_folder_id
          })),
        hasActiveFeedback: video.audioDubs.some((audioDub) => audioDub.tasks.some((task) => task.feedbacks.length > 0)),
      });
    }

    // Build dynamic filters
    const where: any = {
      audioDubs: {
        some: {
          tasks: {
            some: {
              AND: [
                {
                  staffs: {
                    some: {
                      staffId: staffId,
                    },
                  },
                },
                {
                  ...(includeProvidedTaskId ? { id: { not: options.taskId } } : {}),
                },
              ],
            },
          },
        },
      },
      ...(options.creatorId ? { creator_id: options.creatorId } : {}),
    };

    // console.log("[1] where", JSON.stringify(where));
    if(options.isMultipleSelectMode) {
      options.filter = "ready_for_work";
    }
    applyVideoSearchTerm(where, options.searchTerm);
    applyTaskStatusFilterForOtherStaff(where, options.filter);

    console.log("[2] where", JSON.stringify(where));

    const _videos = await this.prisma.video.findMany({
      take: options.limit,
      skip: options.page * options.limit,
      where,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        title: true,
        audioDubs: {
          where: {
            tasks: {
              some: {
                staffs: {
                  some: {
                    staffId: staffId,
                  },
                },
              },
            },
          },
          select: {
            language: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            tasks: {
              where: {
                ...(options.creatorId ? { status: TaskStatus.IN_PROGRESS } : {}),
                staffs: {
                  some: {
                    staffId: staffId,
                  },
                },
              },
              select: {
                id: true,
                status: true,
                type: true,
                uploaded_files_folder_id: true,
                _count: {
                  select: {
                    feedbacks: {
                      where: {
                        feedback: {
                          status: FeedbackStatus.IN_PROGRESS
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    // console.log("[3] _videos", JSON.stringify(_videos, null, 2));

    for (const video of _videos) {
      const _video = {
        id: video.id,
        title: video.title,
        tasks: [],
        hasActiveFeedback: video.audioDubs.some(audioDub => audioDub.tasks.some(task => task._count.feedbacks > 0))
      };

      for (const audioDub of video.audioDubs) {
        const _tasks = audioDub.tasks.map(task => ({
          status: task.status as TaskStatus,
          taskId: task.id,
          languageName: audioDub.language.name,
          languageCode: audioDub.language.code,
          languageId: audioDub.language.id,
          uploadedFilesFolderId: task.uploaded_files_folder_id
        }));

        _video.tasks.push(..._tasks);
      }

      videos.push(_video);
    }

    return videos;
  }

  async getAssignedVideos(
    staffId: number,
    options: {
      filter: string;
      searchTerm: string;
      taskId?: number;
      limit: number;
      page: number;
      creatorId?: number;
    }
  ): Promise<StaffVideoDTO[]> {
    this.logger.log(`[StaffService.getAssignedVideos] Fetching assigned videos for staffId: ${staffId} with options: ${JSON.stringify(options)}`);

    try {
      // First get the staff member to determine their role
      const staff = await this.prisma.staff.findUnique({
        where: { id: staffId },
        select: { staff_type: true },
      });

      if (!staff) {
        throw new Error(`Staff member with ID ${staffId} not found`);
      }

      // If its multiple select, then we need to return only the videos that are ready for work
      const optionsWithMultipleSelect = {
        ...options,
        isMultipleSelectMode: options.creatorId !== undefined,
      };

      let videos: StaffVideoDTO[] = [];
      if (staff.staff_type === StaffType.TRANSCRIPTOR) {
        videos = await this.getTranscriptorAssignedVideos(staffId, optionsWithMultipleSelect);
      } else {
        videos = await this.getOtherStaffAssignedVideos(staffId, optionsWithMultipleSelect);
      }

      this.logger.log(`[StaffService.getAssignedVideos] Found ${videos.length} videos`);
      console.log("[1] videos", JSON.stringify(videos, null, 2));
      return videos;
    } catch (error) {
      this.logger.error({
        message: `Failed to fetch assigned videos`,
        staffId,
        error: error.message,
        stack: error.stack,
        severity: "ERROR",
        service: "StaffService",
        method: "getAssignedVideos",
      });
      throw error;
    }
  }

  async getTaskDetails(taskId: number): Promise<StaffTaskDTO> {
    this.logger.log(`[StaffService.getTaskDetails] Fetching task details for taskId: ${taskId}`);

    try {
      const task = await this.prisma.task.findUnique({
        where: { id: +taskId },
        select: {
          id: true,
          status: true,
          resources_folder_id: true,
          uploaded_files_folder_id: true,
          expected_delivery_date: true,
          feedbacks: true,
          video: {
            select: {
              id: true,
            },
          },
          audioDub: {
            select: {
              videoId: true,
            },
          },
        },
      });

      if (!task) {
        this.logger.log(`[StaffService.getTaskDetails] Task with ID ${taskId} not found`);
      }

      const taskDetails: StaffTaskDTO = {
        id: task.id,
        videoId: task.video?.id || task.audioDub?.videoId,
        status: task.status as TaskStatus,
        resources_folder_id: task.resources_folder_id,
        uploaded_files_folder_id: task.uploaded_files_folder_id,
        resourcesCount: 0,
        feedbacksCount: task.feedbacks.length,
        expected_delivery_date: task.expected_delivery_date,
      };

      return taskDetails;
    } catch (error) {
      this.logger.error({
        message: `Failed to fetch task details`,
        taskId,
        error: error.message,
        stack: error.stack,
      });
    }
  }

  async getCreators(staffId: number): Promise<CreatorBasicDTO[]> {
    this.logger.log(`[StaffService.getCreators] Fetching creators for staffId: ${staffId}`);

    try {
      // const creators = await this.prisma.creator.findMany({
      const staff = await this.prisma.staff.findUnique({
        where: { id: staffId },
        select: { staff_type: true },
      });

      if (!staff) {
        throw new Error(`Staff member with ID ${staffId} not found`);
      }

      const creators: CreatorBasicDTO[] = [];
      if (staff.staff_type === StaffType.TRANSCRIPTOR) {
        const _creators = await this.prisma.creator.findMany({
          where: {
            videos: {
              some: {
                transcriptionTask: {
                  staffs: {
                    some: {
                      staffId: staffId,
                    },
                  },
                },
              },
            },
          },
          select: {
            id: true,
            username: true,
            user: {
              select: {
                photo_url: true,
                full_name: true,
              },
            },
          },
        });
        for (const creator of _creators) {
          creators.push({
            id: creator.id,
            username: creator.username,
            full_name: creator.user.full_name,
            photo_url: creator.user.photo_url,
          });
        }
      } else {
        const _creators = await this.prisma.creator.findMany({
          where: {
            videos: {
              some: {
                audioDubs: {
                  some: {
                    tasks: {
                      some: {
                        staffs: {
                          some: {
                            staffId: staffId,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          select: {
            id: true,
            username: true,
            user: {
              select: {
                photo_url: true,
                full_name: true,
              },
            },
          },
        });

        // console.log("[1] creators", _creators);
        for (const creator of _creators) {
          creators.push({
            id: creator.id,
            username: creator.username,
            full_name: creator.user.full_name,
            photo_url: creator.user.photo_url,
          });
        }
      }

      console.log("[2] creators", creators);

      return creators;
    } catch (error) {
      this.logger.error({
        message: `Failed to fetch creators`,
        staffId,
        error: error.message,
        stack: error.stack,
      });
    }
  }

  // async getVideosForStaff(
  //   staffId: string,
  //   options: {
  //     taskId?: string;
  //     limit: number;
  //     offset: number;
  //   }
  // ): Promise<StaffVideoDTO[]> {
  //   const { taskId, limit, offset } = options;

  //   // If a specific taskId is provided, make sure we include its video
  //   if (taskId) {
  //     // 1. First get the video that contains this task
  //     const taskVideo = await this.getVideoByTaskId(staffId, taskId);

  //     if (!taskVideo) {
  //       throw new NotFoundException(`Task with ID ${taskId} not found or not assigned to staff`);
  //     }

  //     // 2. Get remaining videos up to the limit
  //     const remainingLimit = limit - 1; // -1 for the task's video

  //     if (remainingLimit <= 0) {
  //       // If limit is 1 or less, just return the task's video
  //       return [taskVideo];
  //     }

  //     // 3. Get other videos, excluding the one we already have
  //     const otherVideos = await this.getOtherVideosForStaff(
  //       staffId,
  //       taskVideo.id,
  //       remainingLimit,
  //       offset
  //     );

  //     // 4. Return the task's video first, then the others
  //     return [taskVideo, ...otherVideos];
  //   }

  //   // If no taskId provided, just get videos normally with pagination
  //   return this.getStaffVideos(staffId, limit, offset);
  // }

    /**
   * Generates a Box download URL for multiple videos
   * @param staffId Staff ID making the request
   * @param videoIds Array of video IDs to include in download
   * @param languageId Language ID for filtering content
   */
    async generateBulkDownloadUrl(
      staffId: number,
      videos: {
        id: number;
        taskIds: number[];
      }[],
      languageName: string
    ): Promise<string> {
      this.logger.log(`[StaffService.generateBulkDownloadUrl] Generating bulk download URL for staff ${staffId}, videos: ${JSON.stringify(videos, null, 2)}, languageName: ${languageName}`);

      try {
        const resources: {
          videoId: number;
          videoSrcFileId: string;
          taskFilesIds: string[];
        }[] = []
  


      const _videos = await this.prisma.video.findMany({
        where: {
          id: { in: videos.map(video => video.id) }
        },
        select: {
          id: true,
          title: true,
          mp4_folder_id: true,
        }
      });

      for (const video of _videos) {
        const videoSrcFileId = await this.boxService.getFileByName(video.mp4_folder_id, `${video.title}.mp4`).then(file => file.id);

        resources.push({
          videoId: video.id,
          videoSrcFileId,
          taskFilesIds: []
        })
      }

      const _tasks = await this.prisma.task.findMany({
        where: {
          id: { in: videos.map(video => video.taskIds).flat() }
        },
        select: {
          id: true,
          resources_folder_id: true,
        }
      });

      for (const task of _tasks) {
        const taskFilesIds = await this.boxService.getItems(task.resources_folder_id).then(files => files.map(file => file.id));

        const taskVideoId = videos.find(video => video.taskIds.includes(task.id))?.id;

        console.log("[1.5] task resources folder id: ", task.resources_folder_id);

        const resourcesVideo = resources.find(resource => resource.videoId === taskVideoId).taskFilesIds;
        resourcesVideo.push(...taskFilesIds);
      }

      console.log("[1] _tasks", _tasks);
      console.log("[2] _videos", _videos);
      console.log("[3] resources", resources);
      // Create a zip name
      const timestamp = new Date().toISOString().split("T")[0];
      const zipName = `${languageName}_bulk_download_${timestamp}`;

        // Create a zip download
        const fileIds = resources.map(resource => [resource.videoSrcFileId, ...resource.taskFilesIds]).flat();
        console.log("[3.5] fileIds", fileIds);
        const zipDownload = await this.boxService.createZipDownload(
          fileIds,
          zipName
        );

        console.log("[4] zipDownload", zipDownload);

        return zipDownload.downloadUrl;
    } catch (error) {
      this.logger.error({
        message: `Failed to generate bulk download URL`,
        staffId,
        videos,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  // async bulkDownload(data: { videos: { id: number; taskIds: number[] }[]; languageName: string }, userId: number) {
  //   const staff = await this.prisma.staff.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //     select: {
  //       staff_type: true,
  //       user: {
  //         select: {
  //           email: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!staff) {
  //     throw new Error(`Staff member with ID ${userId} not found`);
  //   }

  //   this.logger.log(`Bulk downloading videos with data: ${JSON.stringify(data)}`);

  //   try {
  //     // Fetch the videos to be downloaded
  //     const videos = await this.prisma.video.findMany({
  //       where: {
  //         id: {
  //           in: data.videos.map((v) => v.id),
  //         },
  //       },
  //       select: {
  //         title: true,
  //         transcription_task_id: true,
  //         audioDubs: {
  //           where: {
  //             language: {
  //               name: data.languageName,
  //             },
  //             tasks: {
  //               some: {
  //                 id: {
  //                   in: data.videos.flatMap((v) => v.taskIds),
  //                 },
  //               },
  //             },
  //           },
  //           select: {
  //             final_folder_id: true,
  //             tasks: {
  //               where: {
  //                 id: {
  //                   in: data.videos.flatMap((v) => v.taskIds),
  //                 },
  //               },
  //               select: {
  //                 id: true,
  //                 status: true,
  //               },
  //             },
  //           },
  //         },
  //         root_folder_id: true,
  //         creator: {
  //           select: {
  //             id: true,
  //           },
  //         },
  //       },
  //     });

  //     const downloadUrls: string[] = [];

  //     for (const video of videos) {
  //       switch (staff.staff_type) {
  //         case StaffType.TRANSCRIPTOR:
  //           const task = await this.prisma.task.findUnique({
  //             where: {
  //               id: video.transcription_task_id,
  //             },
  //           });
  //           if (task) {
  //             const downloadRequests: ZipDownloadRequest = {
  //               downloadFileName: video.title,
  //               items: [{ type: "folder", id: task.resources_folder_id }],
  //             };
  //             const downloadResponse = await this.boxService.downloadZip(downloadRequests, staff.user.email);
  //             downloadUrls.push(downloadResponse.downloadUrl);
  //           }
  //           break;

  //         default:
  //           const audioDubs = video.audioDubs;
  //           for (const audioDub of audioDubs) {
  //             if (audioDub.tasks.length > 0) {
  //               const downloadRequests: ZipDownloadRequest = {
  //                 downloadFileName: video.title,
  //                 items: [{ type: "folder", id: audioDub.final_folder_id }],
  //               };
  //               const downloadResponse = await this.boxService.downloadZip(downloadRequests, staff.user.email);
  //               downloadUrls.push(downloadResponse.downloadUrl);
  //             }
  //           }
  //           break;
  //       }
  //     }

  //     return downloadUrls;
  //   } catch (error) {
  //     this.logger.error("Error preparing bulk download", error);
  //     throw new Error("Failed to prepare bulk download");
  //   }
  // }

  async bulkUpload(data: { videos: { id: number; taskIds: number[] }[]; languageName: string }, userId: number) {
    const staff = await this.prisma.staff.findUnique({
      where: {
        id: userId,
      },
    });

    if (!staff) {
      throw new Error(`Staff member with ID ${userId} not found`);
    }

    this.logger.log(`Bulk uploading task resources with data: ${JSON.stringify(data)}`);
  }
}
