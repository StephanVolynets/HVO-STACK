import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe, Header, StreamableFile, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { VideoService } from "./video.service";
import { AddVideoDTO, addVideoDTOSchema, ApproveDubDto, ApproveFeedbackDTO, CreateVideoDTO, createVideoDTOSchema, InitiateVideoUploadInputDTO, StaffType, SubmitFeedbackDTO, VideoProcessingIssueDTO, VideoStatus } from "hvo-shared";
import { ZodValidationPipe } from "nestjs-zod";
import { NotificationService } from "src/notifications/services/notifications.service";
import { BoxCcgAuth } from "box-typescript-sdk-gen";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { generateBulkUploadTemplate } from "./utils/excel-template";
import { FileInterceptor } from "@nestjs/platform-express";
import { ShareVideoDTO, shareVideoDTOSchema } from "hvo-shared";

@Controller("videos")
export class VideoController {
  constructor(private readonly videoService: VideoService, private readonly notificationService: NotificationService) {}


  

  @Get("/count")
  async countVideos(@Query("creatorId") creatorId: string, @Query("timePeriod") timePeriod: string, @Query("searchTerm") searchTerm: string) {
    return this.videoService.countVideos({ creatorId: creatorId, timePeriod, searchTerm });
  }

  // @Post("/assign-staff")
  // async assignStaff(@Body() assignStaffDTO: AssignStaffToVideoDTO) {
  //   return this.videoService.assignStaffToVideo(assignStaffDTO);
  // }

  @Get()
  async getVideos(@Query("timePeriod") timePeriod: string, @Query("creatorId") creatorId: number, @Query("searchTerm") searchTerm: string) {
    return this.videoService.getVideos({ timePeriod, creatorId, searchTerm });
  }

  // ----------------- Video Submission -----------------
  @Get("/youtube-channels/:creatorId")
  async getYoutubeChannels(@Param("creatorId") creatorId: string) {
    return this.videoService.getYoutubeChannels(creatorId);
  }

  @Post("/initiate-video-submission")
  initiateVideoSubmission(@Body() input: InitiateVideoUploadInputDTO) {
    return this.videoService.initiateVideoSubmission(input);
  }

  @Post("/finalize-video-submission/:creatorId")
  finalizeVideoSubmission(@Param("creatorId") creatorId: string, @Body() addVideoDTO: AddVideoDTO) {
    return this.videoService.finalizeVideoSubmission(addVideoDTO, creatorId);
  }

  @Post("/video-resource-uploaded/:videoId")
  videoResourceUploaded(@Param("videoId") videoId: string, @Body() { resourceType }: { resourceType: "video" | "audio" }) {
    return this.videoService.videoResourceUploaded({ videoId: +videoId, resourceType });
  }

  // ------------------------------

  @Get("/metadata-for-transcoder-completion/:videoId")
  async getMetadataForTranscoderCompletion(@Param("videoId") videoId: string) {
    return this.videoService.getMetadataForTranscoderCompletion({ videoId: +videoId });
  }

  @Post("/compression-completed/:videoId")
  compressionCompleted(@Param("videoId") videoId: string) {
    return this.videoService.compressionCompleted({ videoId: +videoId });
  }

  // ------------------------------
  // @UsePipes(new ZodValidationPipe(addVideoDTOSchema))
  // @Post("/add-single/:creatorId")
  // addVideo(@Param("creatorId") creatorId: string, @Body() addVideoDTO: AddVideoDTO) {
  //   return this.videoService.addVideo(addVideoDTO, creatorId);
  // }

  // @UsePipes(new ZodValidationPipe(createVideoDTOSchema))
  // @Post("/create")
  // createVideo(@Body() createVideoDto: CreateVideoDTO) {
  //   return this.videoService.createVideo(createVideoDto);
  // }

  @Get("/library/:creatorId")
  async getLibraryVideos(@Param("creatorId") creatorId: string, @Query("page", ParseIntPipe) page: number = 1, @Query("limit", ParseIntPipe) limit: number = 10, @Query("timePeriod") timePeriod: string, @Query("videoStatus") videoStatus: string, @Query("searchTerm") searchTerm: string) {
    return this.videoService.getLibraryVideos({
      page,
      limit,
      creatorId,
      timePeriod,
      searchTerm,
      videoStatus: videoStatus as VideoStatus,
    });
  }

  @Get("/review/count")
  async countVideosInReview(@Query("creatorId") creatorId: string) {
    return this.videoService.countVideosInReview({ creatorId });
  }

  @Get("/review/:creatorId")
  async getVideosInReview(@Param("creatorId") creatorId: string, @Query("page", ParseIntPipe) page: number = 1, @Query("limit", ParseIntPipe) limit: number = 10) {
    return this.videoService.getVideosInReview({
      page,
      limit,
      creatorId,
    });
  }

  // @Get("/preview/:videoId")
  // async getVideoPreview(@Param("videoId") videoId: number) {
  //   return this.videoService.getVideoPreview({ videoId });
  // }

  @Get("/:videoId/preview")
  async getVideoPreviewBasic(@Param("videoId") videoId: number) {
    return this.videoService.getVideoPreview({ videoId });
  }

  @Get("/:videoId/preview-media")
  async getVideoPreviewMedia(@Param("videoId") videoId: number) {
    return this.videoService.getVideoPreviewMedia({ videoId: +videoId });
  }

  @Get("/:videoId/title")
  async getVideoTitle(@Param("videoId", ParseIntPipe) videoId: number) {
    return this.videoService.getVideoTitle(videoId);
  }

  // @Get("library/:creatorId/count")
  // async getLibraryVideosCount(
  //   @Param("creatorId") creatorId: string,
  //   @Query("timePeriod") timePeriod: string,
  //   @Query("searchTerm") searchTerm: string
  // ) {
  //   return this.videoService.getLibraryVideosCount({  creatorId, timePeriod, searchTerm });
  // }

  // ----------------- Feedbacks -----------------
  @Post("/add-feedback")
  async addFeedback(@Body() data: SubmitFeedbackDTO) {
    return this.videoService.addFeedback({ data });
  }

  @Get("/:videoId/feedbacks/creator")
  async getFeedbacksForVideo(@Param("videoId") videoId: string) {
    // return this.videoService.getFeedbacks({ videoId: +videoId });
    // TODO: Bring back the old one, right now its not completed, also check if there is a need for a separate method
    return this.videoService.getVendorFeedbacks(parseInt(videoId));
  }

  @Get(":videoId/feedbacks/vendor")
  async getVideoFeedbacks(@Param("videoId") videoId: string) {
    return this.videoService.getVendorFeedbacks(parseInt(videoId));
  }

  @Get(":taskId/feedbacks/staff")
  async getStaffFeedbacks(@Param("taskId") taskId: string) {
    return this.videoService.getStaffFeedbacks(+taskId);
  }

  @Post("/feedback-issues/:feedbackIssueId/reject")
  async rejectFeedbackIssue(@Param("feedbackIssueId") feedbackIssueId: string) {
    // For now we only have to reject the feedback issue, if we need to do more we can change this method to be status changer.
    return this.videoService.rejectFeedbackIssue(+feedbackIssueId);
  }

  @Post("/feedbacks/:feedbackId/approve")
  async approveFeedback(@Param("feedbackId") feedbackId: string, @Body() data: ApproveFeedbackDTO) {
    return this.videoService.approveFeedback(+feedbackId, data);
  }

  @Post("/feedbacks/:feedbackId/reject")
  async rejectFeedback(@Param("feedbackId") feedbackId: string) {
    return this.videoService.rejectFeedback(+feedbackId);
  }

  // ----------------- Dubs -----------------

  @Post("/:dubId/approve-dub")
  async approveDub(@Param("dubId") dubId: string, @Body() data: ApproveDubDto) {
    return this.videoService.approveDub({ dubId: +dubId, data });
  }

  @Post("processing-issue")
  @ApiOperation({ summary: "Log a video processing issue" })
  @ApiResponse({ status: 201, description: "Issue logged successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async logProcessingIssue(@Body() input: VideoProcessingIssueDTO) {
    return this.videoService.logProcessingIssue(input);
  }

  // ----------------- Bulk Actions -----------------

  @Post("/bulk-download")
  async bulkDownloadTasks(@Body() { videoIds, language }: { videoIds: number[]; language: string }) {
    return this.videoService.bulkDownload(videoIds, language);
  }

  @Post("/bulk-upload/:creatorId")
  @UseInterceptors(FileInterceptor("file"))
  async bulkUploadCsv(@UploadedFile() file: Express.Multer.File, @Param("creatorId") creatorId: string) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }
    return this.videoService.bulkUploadCsv(file, creatorId);
  }

  @Get("/bulk-upload-template/:creatorId")
  @Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  @Header("Content-Disposition", "attachment; filename=video_upload_template.xlsx")
  async getBulkUploadTemplate(@Param("creatorId") creatorId: string) {
    const channels = await this.videoService.getYoutubeChannels(creatorId);

    const stream = await generateBulkUploadTemplate(channels);
    return new StreamableFile(stream);
  }

  @Post("/share")
  @ApiOperation({ summary: "Share a video with optional email recipients" })
  @ApiResponse({ status: 201, description: "Video shared successfully" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async shareVideo(@Body() data: ShareVideoDTO) {
    return this.videoService.shareVideo(data);
  }

  @Get("/validate-share/:videoId/:token")
  @ApiOperation({ summary: "Validate a video share token" })
  @ApiResponse({ status: 200, description: "Token is valid" })
  @ApiResponse({ status: 400, description: "Invalid token" })
  async validateShareToken(@Param("videoId", ParseIntPipe) videoId: number, @Param("token") token: string) {
    return this.videoService.validateShareToken(videoId, token);
  }
}
