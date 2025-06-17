import { Body, Controller, Get, Header, Param, ParseIntPipe, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TaskService } from "./task.service";
import { AssignStaffDTO, StaffType, UpdateTaskStaffDTO } from "hvo-shared";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("tasks")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get("/pending-staff-assignment")
  async getPendingStaffAssignmentVideos(@Query("staffId", ParseIntPipe) staffId: number) {
    return this.taskService.getPendingStaffAssignmentTasks(staffId);
  }

  @Get("/count")
  async getTasksCount(@Query("staffId") staffId: string, @Query("filter") filter: string, @Query("searchTerm") searchTerm: string) {
    return this.taskService.getTasksCount({ staffId, filter, searchTerm });
  }

  // @Get("/:taskId/details")
  // async getTask(@Param("taskId") taskId: string) {
  //   return this.taskService.getTask({ taskId: +taskId });
  // }

  // @Get("/:taskId/resources/count")
  // async getResources(@Param("taskId") taskId: string) {
  //   return this.taskService.getResources(+taskId);
  // }

  @Get("/resources")
  async getResourcesCount(@Query("videoId") videoId: string, @Query("folderId") folderId: string, @Query("taskId") taskId: string) {
    return this.taskService.getResources(folderId, taskId, +videoId);
  }

  @Get("/uploaded-files")
  async getUploadedFiles(@Query("folderId") folderId: string, @Query("taskId") taskId: string) {
    return this.taskService.getUploadedFiles(folderId, taskId);
  }

  // @Header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
  // @Header("Pragma", "no-cache")
  // @Header("Expires", "0")
  // @Get("/:staffId")
  // async getTasks(
  //   @Param("staffId") staffId: string,
  //   @Query("page", ParseIntPipe) page: number = 1,
  //   @Query("limit", ParseIntPipe) limit: number = 10,
  //   @Query("filter") filter: string,
  //   @Query("searchTerm") searchTerm: string
  // ) {
  //   return this.taskService.getTasks({ page, limit, staffId, filter, searchTerm });
  // }

  @Post("/assign-staff")
  async assignStaff(@Body() assignStaffDTO: AssignStaffDTO) {
    return this.taskService.assignStaff(assignStaffDTO);
  }

  @Post("/update-staff")
  async updateStaff(@Body() updateTaskStaffDTO: UpdateTaskStaffDTO) {
    return this.taskService.updateStaff(updateTaskStaffDTO);
  }

  // @Post("upload")
  // @UseInterceptors(FileInterceptor("file"))
  // async uploadFile(@UploadedFile() file: Express.Multer.File, @Body("taskId") taskId: string) {
  //   return await this.taskService.uploadFile(+taskId, file);
  // }

  @Post("/:taskId/complete")
  async completeTask(@Param("taskId", ParseIntPipe) taskId: number) {
    return this.taskService.completeTask(taskId);
  }
}
