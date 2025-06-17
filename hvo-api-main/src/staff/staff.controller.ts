import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { StaffService } from "./staff.service";
import { StaffTaskDTO, StaffVideoDTO } from "hvo-shared";
import { DefaultAuthGuard } from "src/auth/auth.guard";
import { TaskOwnershipGuard } from "./guards/task-ownership.guard";

// Add interface for bulk download request
interface BulkDownloadRequestDTO {
  languageName: string;
  videos: {
    id: number;
    taskIds: number[];
  }[];
}

@Controller("staff")
@UseGuards(DefaultAuthGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // Admin Guard
  // @Get("/summaries")
  // findAll(@Query("searchTerm") searchTerm: string) {
  //   return this.staffService.findAll(searchTerm);
  // }

  // Admin, Vendor guard
  // @Get("/count")
  // countAllCreators() {
  //   return this.staffService.countAllStaff();
  // }

  // -----

  // Admin, Vendor guard
  @Get()
  async getStaff(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Query("searchTerm") searchTerm: string,
    @Query("languages") languages: string, // Comma-separated IDs
    @Query("role") role: string | null
  ) {
    const languageIds = languages ? languages.split(",").map(Number) : [];
    return this.staffService.getStaff({ page: +page, limit: +limit, searchTerm, languageIds, role });
  }

  // Admin, Vendor guard
  @Get("/count")
  async getStaffCount(@Query("searchTerm") searchTerm: string, @Query("languages") languages: string, @Query("role") role: string | null) {
    const languageIds = languages ? languages.split(",").map(Number) : [];
    return this.staffService.getStaffCount({ searchTerm, languageIds, role });
  }

  @Get("/task/:taskId")
  findByTask(@Param("taskId") taskId: number) {
    return this.staffService.findByTask(taskId);
  }

  // --------------- Staff Portal ---------------
  @Get("videos/count")
  async getVideoCount(@Req() request): Promise<number> {
    const staffId = request.user.id;
    return this.staffService.getAssignedVideosCount(staffId);
  }

  @Get("videos")
  async getVideos(@Req() request, @Query("filter") filter: string, @Query("searchTerm") searchTerm: string, @Query("taskId") taskId?: string, @Query("limit") limit: number = 10, @Query("page") page: number = 0, @Query("creatorId") creatorId?: string   ): Promise<StaffVideoDTO[]> {
    const staffId = request.user.id;

    return this.staffService.getAssignedVideos(staffId, {
      filter,
      searchTerm,
      taskId: taskId ? +taskId : undefined,
      limit: +limit,
      page: +page,
      creatorId: creatorId ? +creatorId : undefined,
    });
  }

  @Get("tasks/:taskId")
  @UseGuards(TaskOwnershipGuard)
  async getTask(@Req() request, @Param("taskId") taskId: string): Promise<StaffTaskDTO> {
    return this.staffService.getTaskDetails(+taskId);
  }

  @Get("creators")
  async getCreators(@Req() request) {
    const userId = request.user.id;
    return this.staffService.getCreators(+userId);
  }

  // @Get('tasks/:taskId/feedbacks')
  // async getTaskFeedback(
  //   @Req() request,
  //   @Param('taskId') taskId: string
  // ): Promise<StaffFeedbackDTO[]> {
  //   const staffId = request.user.id;
  //   return this.staffService.getTaskFeedbacks(staffId, taskId);
  // }
  // ---------------------------------------------

  // @Get('tasks/:taskId/resources')
  // async getTaskResources(
  //   @Req() request,
  //   @Param('taskId') taskId: string
  // ): Promise<ResourceDTO[]> {
  //   const staffId = request.user.id;
  //   return this.staffService.getTaskResources(staffId, taskId);
  // }

  @Post("/bulk-download")
  async bulkDownloadTasks(@Req() request, @Body() data: { videos: { id: number; taskIds: number[] }[]; languageName: string }) {
    const userId = request.user.id;
    return this.staffService.generateBulkDownloadUrl(userId, data.videos, data.languageName);
  }

  @Post("/bulk-upload")
  async bulkUploadTaskResources(@Req() request, @Body() data: { videos: { id: number; taskIds: number[] }[]; languageName: string }) {
    const userId = request.user.id;
    return this.staffService.bulkUpload(data, userId);
  }
}
