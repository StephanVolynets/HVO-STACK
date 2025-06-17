import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "src/prisma/src/prisma.service";
import { StorageService } from "src/storage/storage.service";

@Injectable()
export class NotificationDataService {
  private readonly logger = new Logger(NotificationDataService.name);

  private CLIENT_URL = process.env.CLIENT_URL;
  constructor(private readonly prisma: PrismaService) {}

  public getNewVideoSubmissionDPA = async (videoId: number) => {
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

    const props = {
      title: video.title,
      creatorName: video.creator.username,
      url: `${this.CLIENT_URL}/dashboard/vendor/videos/${video.id}`,
    };

    return props;
  };

  public getSonixCompletedPA = async (videoId: number, transcriptFolderUrl: string) => {
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

    const props = {
      to: "pejovski97@gmail.com",
      creatorName: video.creator.username,
      title: video.title,
      boxLink: transcriptFolderUrl,
    };

    return props;
  };

  // public getRawTranscriptReady = async (videoId: number, transcriptFolderUrl: string) => {
  //   const video = await this.prisma.video.findUnique({
  //     where: {
  //       id: videoId,
  //     },
  //     select: {
  //       title: true,
  //       id: true,
  //       creator: {
  //         select: {
  //           username: true,
  //         },
  //       },
  //       transcriptionTask: {
  //         select: {
  //           id: true,
  //           expected_delivery_date: true,
  //         },
  //       },
  //     },
  //   });

  //   const props = {
  //     title: video.title,
  //     creatorName: video.creator.username,
  //     videoLink: `${this.CLIENT_URL}/dashboard/staff/tasks/${video.transcriptionTask.id}`,
  //     transcriptLink: transcriptFolderUrl,
  //     dueDate: video.transcriptionTask.expected_delivery_date.toLocaleDateString(),
  //     taskLink: `${this.CLIENT_URL}/dashboard/staff/tasks/${video.transcriptionTask.id}`,
  //   };

  //   return props;
  // };

  public getRawTranscriptReady = async (videoId: number, transcriptFolderUrl: string) => {
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
        transcriptionTask: {
          select: {
            id: true,
            expected_delivery_date: true,

            staffs: {
              select: {
                staff: {
                  select: {
                    user: {
                      select: {
                        email: true,
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

    // Email content props
    const props = {
      title: video.title,
      creatorName: video.creator.username,
      videoLink: `${this.CLIENT_URL}/dashboard/staff/tasks/${video.transcriptionTask.id}`,
      transcriptLink: transcriptFolderUrl,
      dueDate: video.transcriptionTask.expected_delivery_date.toLocaleDateString(),
      taskLink: `${this.CLIENT_URL}/dashboard/staff/tasks/${video.transcriptionTask.id}`,
    };

    // Get the email of the person assigned to the transcription task
    const recipient = video.transcriptionTask.staffs[0].staff.user.email;

    return {
      props,
      recipient,
    };
  };

  public getRawTranscriptSentPA = async (videoId: number) => {
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
        transcriptionTask: {
          select: {
            id: true,
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
    });

    const props = {
      title: video.title,
      creatorName: video.creator.username,
      transcriptorName: video.transcriptionTask.staffs?.[0].staff.user.full_name || "Not assigned yet",
      dueDate: video.transcriptionTask.expected_delivery_date.toLocaleDateString(),
    };

    return props;
  };

  public getTranscriptorSubbmittedPAData = async (videoId: number) => {
    // TODO: Implement
  };

  public getFinalTranscriptReadyData = async (videoId: number, transcriptFolderUrl: string) => {
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

    const props = {
      // title: video.title,
      // creatorName: video.creator.username,
      // videoLink,
      // englishScriptLink,
      // language: ,
      // dueDate,
      // uploadLink,
    };

    return props;
  };
}
