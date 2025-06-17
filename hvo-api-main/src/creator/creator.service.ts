import { Injectable, Logger } from "@nestjs/common";
import {
  CreatorAddLanguageDTO,
  CreatorBasicDTO,
  CreatorStatsDTO,
  CreatorSummaryDTO,
  LanguageDTO,
  VideoStatus,
} from "hvo-shared";
import { PrismaService } from "src/prisma/src/prisma.service";

@Injectable()
export class CreatorService {
  private readonly logger: Logger = new Logger(CreatorService.name);
  constructor(protected readonly prisma: PrismaService) {}

  async getCreatorUsername(creatorId: string): Promise<string> {
    const creatorName = await this.prisma.creator
      .findFirst({
        where: {
          user: {
            email: creatorId,
          },
        },
        select: {
          username: true,
        },
      })
      .then((creator) => {
        return creator.username;
      });

    return creatorName;
  }

  async findAll(page: number, limit: number): Promise<CreatorSummaryDTO[]> {
    this.logger.log(`[CreatorService.findAll] Retreiving creators - Data: { page: ${page}, limit: ${limit} }`);

    const skip = (page - 1) * limit;
    const take = limit;

    const creators = await this.prisma.creator.findMany({
      select: {
        id: true,
        username: true,
        videos_in_queue: true,
        videos_in_progress: true,
        videos_completed: true,
        user: {
          select: {
            full_name: true,
            photo_url: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      skip,
      take,
    });

    const creatorSummaryDTOs: CreatorSummaryDTO[] = creators.map((creator) => ({
      id: creator.id,
      full_name: creator.user.full_name,
      photo_url: creator.user.photo_url,
      username: creator.username,
      videos_in_queue: creator.videos_in_queue,
      videos_in_progress: creator.videos_in_progress,
      videos_completed: creator.videos_completed,
    }));

    return creatorSummaryDTOs;
  }

  async getAllBasicCreators(): Promise<CreatorBasicDTO[]> {
    this.logger.log(`[CreatorService.getAllBasicCreators] Retreiving all creators (basic data)`);

    const creators = await this.prisma.creator.findMany({
      include: {
        user: true,
      },
    });
    const creatorBasicDTOs: CreatorBasicDTO[] = creators.map((creator) => ({
      id: creator.id,
      full_name: creator.user.full_name,
      photo_url: creator.user.photo_url,
      username: creator.username,
    }));

    return creatorBasicDTOs;
  }

  async countAllCreators(): Promise<number> {
    this.logger.log(`[CreatorService.countAllCreators] Counting all creators`);
    return await this.prisma.creator.count();
  }

  async getCreatorStats(creatorId: string): Promise<CreatorStatsDTO> {
    this.logger.log(`[CreatorService.getCreatorStats] Retreiving creator stats - Data: { creatorId: ${creatorId} }`);

    // const stats = await this.prisma.creator.findFirst({
    //   where: {
    //     user: {
    //       email: creatorId,
    //     },
    //   },
    //   select: {
    //     videos_in_queue: true,
    //     videos_in_progress: true,
    //     videos_completed: true,
    //   },
    // });

    const videos = await this.prisma.video.findMany({
      where: {
        creator: {
          user: { email: creatorId },
        },
      },
      select: {
        status: true,
      },
    });

    const creatorStatsDTO: CreatorStatsDTO = {
      videos_in_queue: videos.filter((video) => video.status === VideoStatus.BACKLOG).length,
      videos_in_progress: videos.filter((video) => video.status === VideoStatus.IN_PROGRESS).length,
      videos_completed: videos.filter((video) => video.status === VideoStatus.COMPLETED).length,
    };

    return creatorStatsDTO;
  }

  async getCreatorLanguages(creatorId: string): Promise<LanguageDTO[]> {
    this.logger.log(
      `[CreatorService.getCreatorLanguages] Retreiving creator languages - Data: { creatorId: ${creatorId} }`
    );

    const creatorLanguages = await this.prisma.creatorLanguage.findMany({
      where: {
        creator: {
          user: {
            email: creatorId,
          },
        },
      },
      select: {
        language: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    const languageDTOs: LanguageDTO[] = creatorLanguages.map((creatorLanguage) => ({
      id: creatorLanguage.language.id,
      code: creatorLanguage.language.code,
      name: creatorLanguage.language.name,
    }));
    this.logger.log(`[CreatorService.getCreatorLanguages] Retreived languages - Data: { languages: ${languageDTOs} }`);

    return languageDTOs;
  }

  async addCreatorLanguage(creatorAddLanguageDTO: CreatorAddLanguageDTO) {
    this.logger.log(
      `[CreatorService.addCreatorLanguage] Adding Language to Creator - Data: { creatorAddLanguageDTO: ${creatorAddLanguageDTO} }`
    );

    const user = await this.prisma.user.findUnique({
      where: {
        email: creatorAddLanguageDTO.creatorId,
      },
    });

    await this.prisma.creatorLanguage.create({
      data: {
        creator: {
          connect: { id: user.id },
        },
        language: {
          connect: { id: creatorAddLanguageDTO.languageId },
        },
      },
    });
  }

  // async updateAllCreatorsVideoCounts(): Promise<{ message: string; updatedCreators: number }> {
  //   this.logger.log(`[CreatorService.updateAllCreatorsVideoCounts] Starting to update all creators' video counts`);

  //   // Get all creators
  //   const creators = await this.prisma.creator.findMany({
  //     select: {
  //       id: true,
  //       username: true,
  //     },
  //   });

  //   let updatedCreators = 0;

  //   // Update each creator's video counts
  //   for (const creator of creators) {
  //     // Get all videos for this creator
  //     const videos = await this.prisma.video.findMany({
  //       where: {
  //         creator_id: creator.id,
  //       },
  //       select: {
  //         status: true,
  //       },
  //     });

  //     // Calculate counts based on actual video statuses
  //     const videosInQueue = videos.filter((video) => video.status === VideoStatus.BACKLOG).length;
  //     const videosInProgress = videos.filter((video) => video.status === VideoStatus.IN_PROGRESS).length;
  //     const videosCompleted = videos.filter((video) => video.status === VideoStatus.COMPLETED).length;

  //     // Update the creator with the new counts
  //     await this.prisma.creator.update({
  //       where: {
  //         id: creator.id,
  //       },
  //       data: {
  //         videos_in_queue: videosInQueue,
  //         videos_in_progress: videosInProgress,
  //         videos_completed: videosCompleted,
  //       },
  //     });

  //     updatedCreators++;
  //     this.logger.log(
  //       `[CreatorService.updateAllCreatorsVideoCounts] Updated creator ${creator.username} - Queue: ${videosInQueue}, Progress: ${videosInProgress}, Completed: ${videosCompleted}`
  //     );
  //   }

  //   this.logger.log(
  //     `[CreatorService.updateAllCreatorsVideoCounts] Completed updating video counts for ${updatedCreators} creators`
  //   );

  //   return {
  //     message: `Successfully updated video counts for ${updatedCreators} creators`,
  //     updatedCreators,
  //   };
  // }

  async getAssistantManagerName(userId: number): Promise<{ managerName: string }> {
    this.logger.log(`[CreatorService.getAssistantManagerName] Getting manager name for assistant - Data: { userId: ${userId} }`);

    const assistant = await this.prisma.assistant.findUnique({
      where: {
        id: userId,
      },
      select: {
        manager: {
          select: {
            full_name: true,
          },
        },
      },
    });

    if (!assistant) {
      throw new Error(`Assistant with userId ${userId} not found`);
    }

    return {
      managerName: assistant.manager.full_name,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} creator`;
  }

  // update(id: number, updateCreatorDto: UpdateCreatorDto) {
  //   return `This action updates a #${id} creator`;
  // }

  remove(id: number) {
    return `This action removes a #${id} creator`;
  }
}
