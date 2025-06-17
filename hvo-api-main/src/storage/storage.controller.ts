import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageService } from "./storage.service";
import {
  CompleteVideoUploadInputDTO,
  InitializeCreatorFoldersInputDTO,
  // InitializeVideoUploadInputDTO,
} from "hvo-shared";
import { MAX_FILE_SIZE_BYTES } from "./providers/box.service";
import { UploadProgressInterceptor } from "../common/interceptors/upload-progress.interceptor";
import { AdvancedUploadProgressInterceptor } from "src/common/interceptors/advanced-upload-progress.interceptor";
import { Readable } from "stream";

@Controller("storage")
export class StorageController {
  private readonly logger: Logger = new Logger(StorageController.name);

  constructor(private readonly storageService: StorageService) {}

  @Get("/rename-file")
  renameFile(@Query("fileId") fileId: string, @Query("newName") newName: string) {
    return this.storageService.testRename(fileId, newName);
  }

  @Get("/get-files")
  getFiles(@Query("parentId") parentId: string) {
    return this.storageService.testGetFiles(parentId);
  }

  @Get("/get-url")
  getUrl(@Query("folderId") folderId: string) {
    return this.storageService.testGetUrl(folderId);
  }

  @Post("/get-pre-signed-url")
  getPreSignedUrl(@Body() body: { folderId: string; fileName: string }) {
    return this.storageService.getPreSignedUrl(body.folderId, body.fileName);
  }

  @Get("/get-file-id")
  getFileId(@Query("folderId") folderId: string, @Query("fileName") fileName: string) {
    return this.storageService.getFileId(folderId, fileName);
  }

  // @Post("/commit-upload-session")
  // commitUploadSession(@Body() body: { uploadUrl: string; parts: any[]; digest: string }) {
  //   return this.storageService.commitUploadSession(body.uploadUrl, body.parts, body.digest);
  // }

  // ------------------------------

  // @Post("/initialize-creator-folders")
  // initializeCreatorFolders(@Body() input: InitializeCreatorFoldersInputDTO) {
  //   return this.storageService.initializeCreatorFolders(input);
  // }

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
      },
    }),
    // UploadProgressInterceptor
    AdvancedUploadProgressInterceptor
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body("folderId") folderId: string) {
    return await this.storageService.uploadFileToBox(folderId, file);
  }

  @Get("/generate-folder-url")
  generateFolderUrl(@Query("folderId") folderId: string) {
    return this.storageService.generateUrlFromFolderId(folderId);
  }

  // @Post("/initialize-video-upload")
  // initializeVideoUpload(@Body() input: InitializeVideoUploadInputDTO) {
  //   return this.storageService.initializeVideoUpload(input);
  // }

  @Post("/complete-video-upload")
  completeVideoUpload(@Body() input: CompleteVideoUploadInputDTO) {
    return this.storageService.completeVideoUpload(input);
  }

  @Delete(":fileId")
  async deleteFile(@Param("fileId") fileId: string) {
    return await this.storageService.deleteFileFromStorage(fileId);
  }

  // ------------------------------
  // Chunked upload
  // ------------------------------

  @Post("create-upload-session")
  async createUploadSession(@Body() body: { folderId: string; fileName: string; fileSize: number }) {
    const { folderId, fileName, fileSize } = body;
    return this.storageService.createUploadSession(folderId, fileName, fileSize);
  }

  @Post("commit-upload-session")
  async commitUploadSession(
    @Body() body: { sessionId: string; parts: Array<{ part_id: string; offset: number; size: number }>; digest: string }
  ) {
    const { sessionId, parts, digest } = body;
    // Extract the SHA1 hash from the digest (format: "sha=<hash>")
    const sha1 = digest.startsWith("sha=") ? digest.substring(4) : digest;
    return this.storageService.commitUploadSession(sessionId, parts, sha1);
  }

  @Post("abort-upload-session")
  async abortUploadSession(@Body() body: { sessionId: string }) {
    const { sessionId } = body;
    await this.storageService.abortUploadSession(sessionId);
    return { success: true };
  }

  // @Post("upload-chunk")
  // @UseInterceptors(FileInterceptor("chunk"))
  // async uploadChunk(
  //   @UploadedFile() chunk: Express.Multer.File,
  //   @Body() body: { sessionId: string; contentRange: string; digest: string }
  // ) {
  //   const { sessionId, contentRange, digest } = body;

  //   // Extract range information from the content-range header
  //   const [, rangeStr] = contentRange.split("bytes ");
  //   const [range, total] = rangeStr.split("/");
  //   const [startStr, endStr] = range.split("-");
  //   const start = parseInt(startStr);

  //   // Create a readable stream from the chunk buffer
  //   const chunkStream = Readable.from(chunk.buffer);

  //   // Upload the part to Box
  //   const uploadedPart = await this.storageService.uploadFilePart(
  //     sessionId,
  //     chunk.buffer,
  //     start,
  //     parseInt(total),
  //     digest.substring(4) // Remove "sha=" prefix
  //   );

  //   return uploadedPart;
  // }
  @Post("upload-chunk")
  @UseInterceptors(FileInterceptor("chunk"))
  async uploadChunk(
    @UploadedFile() chunk: Express.Multer.File,
    @Body()
    body: {
      sessionId: string;
      offset: string;
      totalSize: string;
      digest: string;
    }
  ) {
    const { sessionId, digest } = body;

    // Parse numeric values, ensuring they're valid numbers
    const offset = parseInt(body.offset, 10);
    const totalSize = parseInt(body.totalSize, 10);

    // Validate that we have proper numeric values
    if (isNaN(offset) || isNaN(totalSize)) {
      this.logger.error(`Invalid parameters: offset=${body.offset}, totalSize=${body.totalSize}`);
      throw new BadRequestException("Invalid offset or totalSize parameters");
    }

    this.logger.log(
      `Uploading chunk for session ${sessionId}, offset: ${offset}, size: ${chunk.size}, totalSize: ${totalSize}`
    );

    // Extract the SHA1 hash from the digest (format: "sha=<hash>")
    const sha1 = digest.startsWith("sha=") ? digest.substring(4) : digest;

    // Create a buffer from the chunk file
    const buffer = Buffer.from(chunk.buffer);

    // Upload the part to Box
    try {
      const uploadedPart = await this.storageService.uploadFilePart(sessionId, buffer, offset, totalSize, sha1);

      return uploadedPart;
    } catch (error) {
      this.logger.error(`Failed to upload chunk: ${error.message}`);
      throw error;
    }
  }
}
