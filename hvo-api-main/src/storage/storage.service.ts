import { Injectable, Logger } from "@nestjs/common";
import { IStorageProvider } from "./interfaces/i-storage-provider";
import {
  CREATOR_FOLDERS,
  VIDEO_SUBFOLDERS,
} from "./constants/storage.constants";
import { v4 as uuidv4 } from "uuid";
import { BoxService } from "./providers/box.service";
import { CreatorService } from "src/creator/creator.service";
import { PrismaService } from "src/prisma/src/prisma.service";
import {
  CompleteVideoUploadInputDTO,
  InitializeCreatorFoldersInputDTO,
  // InitializeVideoUploadInputDTO,
  // InitializeVideoUploadOutputDTO,
  ResourceItemDTO,
  UploadFileOutputDTO,
  VideoPreviewMediaDTO,
} from "hvo-shared";
import {
  getCreatorFolderIdAndLanguages,
  getCreatorRootFolderId,
} from "./utils/prisma-utils";
import { TranscriptionService } from "src/transcription/transcription.service";
import { Readable } from "stream";
import {
  createResourcesDTOs,
  createUploadedFilesDTOs,
  getTaskResourcesFolder,
  getTaskUploadFolder,
} from "./utils/task-helpers";
import { TaskType } from "@prisma/client";
import { GCSService } from "./providers/gcs.service";
@Injectable()
export class StorageService {
  private readonly logger: Logger = new Logger(StorageService.name);

  constructor(
    private readonly storageProvider: BoxService,
    private readonly creatorService: CreatorService,
    private readonly transcriptionService: TranscriptionService,
    private readonly prismaService: PrismaService,
    private readonly gcsService: GCSService
  ) {}

  async testRename(fileId: string, newName: string) {
    return this.storageProvider.renameFile(fileId, newName, "folder");
  }

  async testGetFiles(parentId: string) {
    const files = await this.storageProvider.getItems(parentId);
    return files;
  }

  async testGetUrl(folderId: string) {
    const url = await this.storageProvider.generateSharedLink(folderId, "open");
    return url;
  }

  async getPreSignedUrl(folderId: string, fileName: string) {
    this.logger.log(
      `Getting pre-signed URL for folder ID: ${folderId} and file name: ${fileName}`
    );
    const url = await this.storageProvider.getPresignedUrlChunked(
      folderId,
      fileName
    );
    return url;
  }

  // async commitUploadSession(uploadUrl: string, parts: any[], digest: string) {
  //   const result = await this.storageProvider.commitUploadSession(
  //     uploadUrl,
  //     parts,
  //     digest
  //   );
  //   return result;
  // }

  async getFileId(folderId: string, fileName: string) {
    const file = await this.storageProvider.getFileByName(folderId, fileName);
    return file.id;
  }

  /**
   * Initializes folders for a creator, including Backlog, Ongoing, Completed and Staging folders.
   *
   * @param creatorId - The id of the creator.
   * @returns A promise that resolves when the folders have been created.
   */
  async initializeCreatorFolders(
    input: InitializeCreatorFoldersInputDTO
  ): Promise<{ root_folder_id: string }> {
    const { creatorId } = input;
    const creatorName = await this.creatorService.getCreatorUsername(creatorId);
    this.logger.log(`Creating folders for creator: ${creatorName}`);

    const creatorFolder = await this.storageProvider.createFolder(
      process.env.HVO_APP_FOLDER_ID,
      creatorName
    );
    await this.storageProvider.createFolder(
      creatorFolder.id,
      CREATOR_FOLDERS.BACKLOG
    );
    await this.storageProvider.createFolder(
      creatorFolder.id,
      CREATOR_FOLDERS.ONGOING
    );
    await this.storageProvider.createFolder(
      creatorFolder.id,
      CREATOR_FOLDERS.COMPLETED
    );
    await this.storageProvider.createFolder(
      creatorFolder.id,
      CREATOR_FOLDERS.STAGING
    );

    return { root_folder_id: creatorFolder.id };
  }

  // async initializeVideoUpload(input: InitializeVideoUploadInputDTO): Promise<InitializeVideoUploadOutputDTO> {
  //   const { creatorId } = input;
  //   this.logger.log(`Creating staging folders for creator: ${creatorId}`);
  //   const creatorFolderId = await getCreatorRootFolderId(this.prismaService, creatorId);

  //   const sessionId = `session-${uuidv4()}`; // Generate a unique session ID
  //   // const stagingFolder = await this.storageProvider.createFolder(creatorFolderId, "Staging");
  //   const stagingFolder = await this.storageProvider.getFileByName(creatorFolderId, CREATOR_FOLDERS.STAGING);

  //   // Create a subfolder for this session
  //   const sessionFolder = await this.storageProvider.createFolder(stagingFolder.id, sessionId);

  //   // const uploadUrls = {
  //   //   video: await this.storageProvider.getPreSignedUrl(sessionFolder.id, "video.mp4"),
  //   //   soundtrack: await this.storageProvider.getPreSignedUrl(sessionFolder.id, "soundtrack.mp4"),
  //   // };

  //   // const output: InitializeVideoUploadOutputDTO = { sessionId, uploadUrls };
  //   const output: InitializeVideoUploadOutputDTO = { folderId: sessionFolder.id };

  //   return output;
  // }

  /**
   * Initializes folders for a video within a creator's folder, including subfolders for source files,
   * original transcript, and language-specific folders.
   *
   * [Obsolete] This method is no longer used.
   *
   * @param creatorId - The ID of the creator.
   * @param sessionId - The ID of the session.
   * @param videoTitle - The title of the video.
   * @returns A promise that resolves when the folders have been created and files have been moved.
   */
  async completeVideoUpload(
    input: CompleteVideoUploadInputDTO
  ): Promise<{ videoFolderId: string }> {
    const {
      videoTitle,
      creatorId,
      session_folder_id,
      video_file_id,
      soundtrack_file_id,
    } = input;

    const { creatorFolderId, languages } = await getCreatorFolderIdAndLanguages(
      this.prismaService,
      creatorId
    );

    // Step 1: Locate the creator's ongoing folder and create a video folder within it
    const ongoingFolder = await this.storageProvider.getFileByName(
      creatorFolderId,
      CREATOR_FOLDERS.ONGOING
    );
    const videoFolder = await this.storageProvider.createFolder(
      ongoingFolder.id,
      videoTitle
    );

    // Step 2: Create the Source Files folder within the video folder
    const sourceFilesFolder = await this.storageProvider.createFolder(
      videoFolder.id,
      VIDEO_SUBFOLDERS.SOURCE_FILES
    );

    // Step 3: Create subfolders within Original Transcript for Raw Script and Final Script
    const originalTranscriptFolder = await this.storageProvider.createFolder(
      videoFolder.id,
      VIDEO_SUBFOLDERS.ORIGINAL_TRANSCRIPT
    );
    const rawScriptFolder = await this.storageProvider.createFolder(
      originalTranscriptFolder.id,
      VIDEO_SUBFOLDERS.RAW_SCRIPT
    );
    // await this.storageProvider.createFolder(originalTranscriptFolder.id, VIDEO_SUBFOLDERS.FINAL_SCRIPT);

    // Step 4: Create language-specific folders, each containing Script, Studio, and Deliverables subfolders
    for (const languageName of languages) {
      const languageFolder = await this.storageProvider.createFolder(
        videoFolder.id,
        languageName
      );
      await this.storageProvider.createFolder(
        languageFolder.id,
        VIDEO_SUBFOLDERS.SCRIPT
      );
      await this.storageProvider.createFolder(
        languageFolder.id,
        VIDEO_SUBFOLDERS.STUDIO
      );
      await this.storageProvider.createFolder(
        languageFolder.id,
        VIDEO_SUBFOLDERS.DELIVERABLES
      );
    }

    // Step 5: Move the video and soundtrack files to the source files folder
    await this.storageProvider.moveFile(
      video_file_id,
      sourceFilesFolder.id,
      "file"
    );
    await this.storageProvider.moveFile(
      soundtrack_file_id,
      sourceFilesFolder.id,
      "file"
    );

    // Step 6: Delete session folder
    await this.storageProvider.deleteFile(session_folder_id, "folder");

    // Step 7: Start the transcription process (this is a non-blocking operation - running in the background)
    setImmediate(() => {
      this.transcriptionService
        .startTranscriptionProcessDeprecated(video_file_id, rawScriptFolder.id)
        .then(() => console.log("Transcription completed"));
      // .catch((error) => console.error("Transcription failed:", error));
    });

    return {
      videoFolderId: videoFolder.id,
    };
  }

  /**
   * Initializes folders for a video within a creator's folder, including subfolders for source files,
   * original transcript, and language-specific folders.
   *
   *
   * @param creatorId - The ID of the creator.
   * @returns A promise that resolves when the folders have been created and files have been moved.
   */
  async finalizeVideoUpload(input: CompleteVideoUploadInputDTO): Promise<{
    videoFolderId: string;
    deliverablesFolderId: string;
    internalFilesFolderId: string;
    mp4FolderId: string;
    mAndEFolderId: string;
    rawScriptFolderId: string;
    rawAudioFolderId: string;
    englishTranscriptFolderId: string;
    languagesWithFolderIds: {
      id: number;
      languageDeliverablesFolderId: string;
      languageRawAudioFolderId: string;
      languageFinalScriptFolderId: string;
      languageMixedAudioFolderId: string;
    }[];
  }> {
    const { videoTitle, creatorId } = input;

    const { creatorFolderId, languages } = await getCreatorFolderIdAndLanguages(
      this.prismaService,
      creatorId
    );

    // Step 1: Locate the creator's ongoing folder and create a video folder within it
    const ongoingFolder = await this.storageProvider.getFileByName(
      creatorFolderId,
      CREATOR_FOLDERS.ONGOING
    );
    const videoFolder = await this.storageProvider.createFolder(
      ongoingFolder.id,
      videoTitle
    );

    // Step 2: Create 2 main folders (Internal Files & Deliverables folder (video title))
    const internalFilesFolder = await this.storageProvider.createFolder(
      videoFolder.id,
      VIDEO_SUBFOLDERS.INTERNAL_FILES
    );
    const deliverablesFolder = await this.storageProvider.createFolder(
      videoFolder.id,
      videoTitle
    );

    // Step 3: Create Internal Files subfolders
    const mp4Folder = await this.storageProvider.createFolder(
      internalFilesFolder.id,
      VIDEO_SUBFOLDERS.MP4
    );
    const mAndEFolder = await this.storageProvider.createFolder(
      internalFilesFolder.id,
      VIDEO_SUBFOLDERS.M_AND_E
    );
    const rawTranscriptFolder = await this.storageProvider.createFolder(
      internalFilesFolder.id,
      VIDEO_SUBFOLDERS.RAW_TRANSCRIPT
    );
    const rawAudioFolder = await this.storageProvider.createFolder(
      internalFilesFolder.id,
      VIDEO_SUBFOLDERS.RAW_AUDIO
    );

    // Step 4: Create Deliverables subfolders
    const englishTranscriptFolder = await this.storageProvider.createFolder(
      deliverablesFolder.id,
      VIDEO_SUBFOLDERS.ENGLISH_TRANSCRIPT
    );

    // Step 4: Create language-specific folders, each containing: Final Script & Mixed Audio
    const languagesWithFolderIds = [];
    for (const language of languages) {
      const languageName = language.name;
      const rawAudioLanguageFolder = await this.storageProvider.createFolder(
        rawAudioFolder.id,
        languageName
      );
      const deliverablesLanguageFolder =
        await this.storageProvider.createFolder(
          deliverablesFolder.id,
          languageName
        );
      const finalScriptFolder = await this.storageProvider.createFolder(
        deliverablesLanguageFolder.id,
        VIDEO_SUBFOLDERS.FINAL_SCRIPT
      );
      const mixedAudioFolder = await this.storageProvider.createFolder(
        deliverablesLanguageFolder.id,
        VIDEO_SUBFOLDERS.MIXED_AUDIO
      );

      languagesWithFolderIds.push({
        id: language.id,
        languageDeliverablesFolderId: deliverablesLanguageFolder.id,
        languageRawAudioFolderId: rawAudioLanguageFolder.id,
        languageFinalScriptFolderId: finalScriptFolder.id,
        languageMixedAudioFolderId: mixedAudioFolder.id,
      });
    }

    this.logger.log(
      `Finalized video upload for creator: ${creatorId}, video folder: ${videoFolder.id}, deliverables folder: ${deliverablesFolder.id}, internal files folder: ${internalFilesFolder.id}, mp4 folder: ${mp4Folder.id}, m&e folder: ${mAndEFolder.id}, raw script folder: ${rawTranscriptFolder.id}, raw audio folder: ${rawAudioFolder.id}, languages with folder ids: ${languagesWithFolderIds}`
    );

    return {
      videoFolderId: videoFolder.id,
      deliverablesFolderId: deliverablesFolder.id,
      internalFilesFolderId: internalFilesFolder.id,
      mp4FolderId: mp4Folder.id,
      mAndEFolderId: mAndEFolder.id,
      rawScriptFolderId: rawTranscriptFolder.id,
      rawAudioFolderId: rawAudioFolder.id,
      englishTranscriptFolderId: englishTranscriptFolder.id,
      languagesWithFolderIds,
    };
  }

  async getVideoPreviewMediaSources(
    videoId: number
  ): Promise<VideoPreviewMediaDTO> {
    const video = await this.prismaService.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        root_folder_id: true,
        id: true,
        title: true,
        creator: {
          select: {
            username: true,
          },
        },
        audioDubs: {
          select: {
            languageId: true,
            root_folder_id: true,
            phase: true,
            approved: true,
            language: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });

    // Video Source
    const gcsDestinationPath = `videos/${video.creator.username}/${video.id}/compressed/hd.mp4`;
    const videoSrc = await this.gcsService.getSignedUrl(gcsDestinationPath);

    const videoPreviewMedia: VideoPreviewMediaDTO = {
      videoSrc,
      audioTracks: [],
    };

    // Audio Dubs Sources

    for (const audioDub of video.audioDubs) {
      const languageId = audioDub.languageId;
      if (!audioDub.approved) continue;

      const gcsDestinationPath = `videos/${video.creator.username}/${video.id}/dubs/${audioDub.language.code}/final_audio.wav`;
      const audioDubSrc = await this.gcsService.getSignedUrl(
        gcsDestinationPath
      );
      // const audioDubFolderId = audioDub.root_folder_id;
      // const deliverablesFolder = await this.storageProvider.getFileByName(
      //   audioDubFolderId,
      //   VIDEO_SUBFOLDERS.DELIVERABLES
      // );
      // // Find the first WAV or MP3 file in the deliverables folder
      // const audioFiles = await this.storageProvider.listFiles(deliverablesFolder.id);
      // const audioDubSrcFile = audioFiles.find(
      //   (file) => file.name.toLowerCase().endsWith(".wav") || file.name.toLowerCase().endsWith(".mp3")
      // );

      // if (!audioDubSrcFile) {
      //   throw new Error("No WAV or MP3 audio file found in deliverables folder");
      // }
      // const audioDubSrc = await this.storageProvider.generateDirectDownloadUrl(audioDubSrcFile.id);

      videoPreviewMedia.audioTracks.push({
        languageId: languageId,
        src: audioDubSrc,
        available: audioDub.approved,
      });
    }

    return videoPreviewMedia;
  }

  async uploadFileToBox(
    folderId: string,
    file: Express.Multer.File
  ): Promise<UploadFileOutputDTO> {
    this.logger.log(`Initiating upload to Box for folder ID ${folderId}`);
    try {
      const fileStream = Readable.from(file.buffer);
      const uploadResult = await this.storageProvider.uploadFile(
        folderId,
        fileStream,
        file.originalname
      );
      this.logger.log(`File uploaded to Box with ID ${uploadResult.fileId}`);

      return uploadResult;
    } catch (error) {
      this.logger.error(
        `Failed to upload file to Box for folder ID ${folderId}`,
        error
      );
      throw error;
    }
  }

  async deleteFileFromStorage(fileId: string): Promise<void> {
    this.logger.log(`Deleting file with ID: ${fileId}`);
    try {
      await this.storageProvider.deleteFile(fileId, "file");
    } catch (error) {
      return null;
      // throw error;
    }
  }

  async getTaskResources(
    resourcesFolderId: string,
    videoFolderId: string,
    videoTitle: string
  ): Promise<ResourceItemDTO[]> {
    const resources = await createResourcesDTOs(
      this.storageProvider,
      resourcesFolderId,
      videoFolderId,
      videoTitle
    );
    return resources;
  }

  async getTaskUploadedFiles(
    uploadedFilesFolderId: string
  ): Promise<ResourceItemDTO[]> {
    const files = await createUploadedFilesDTOs(
      this.storageProvider,
      uploadedFilesFolderId
    );
    return files;
  }

  async getTaskResourcesFolderId(
    videoFolderId: string,
    taskType: TaskType,
    languageName: string
  ): Promise<string> {
    const folder = await getTaskResourcesFolder(
      this.storageProvider,
      videoFolderId,
      taskType,
      languageName
    );
    return folder.id;
  }
  async getTaskUploadFolderId(
    videoFolderId: string,
    taskType: TaskType,
    languageName: string
  ): Promise<string> {
    const folder = await getTaskUploadFolder(
      this.storageProvider,
      videoFolderId,
      taskType,
      languageName
    );
    return folder.id;
  }

  async generateUrlFromFolderId(folderId: string): Promise<string> {
    this.logger.log(`Generating shared link for folder ID: ${folderId}`);
    const url = await this.storageProvider.generateSharedLink(folderId, "open");
    return url;
  }

  // Chunked upload

  async createUploadSession(
    folderId: string,
    fileName: string,
    fileSize: number
  ): Promise<{
    sessionId: string;
    uploadUrl: string;
    expiresAt: string;
    partSize: number;
  }> {
    this.logger.log(
      `Creating upload session for file ${fileName} (${fileSize} bytes)`
    );
    return this.storageProvider.createUploadSession(
      folderId,
      fileName,
      fileSize
    );
  }

  async commitUploadSession(
    sessionId: string,
    parts: Array<{ part_id: string; offset: number; size: number }>,
    sha1: string
  ): Promise<UploadFileOutputDTO> {
    this.logger.log(`Committing upload session ${sessionId}`);
    return this.storageProvider.commitUploadSession(sessionId, parts, sha1);
  }

  async abortUploadSession(sessionId: string): Promise<void> {
    this.logger.log(`Aborting upload session ${sessionId}`);
    await this.storageProvider.abortUploadSession(sessionId);
  }

  async uploadFilePart(
    sessionId: string,
    partData: Buffer,
    offset: number,
    totalSize: number,
    sha1Digest: string
  ): Promise<any> {
    this.logger.log(`Uploading part ${offset} of ${totalSize} bytes`);
    return this.storageProvider.uploadFilePart(
      sessionId,
      partData,
      offset,
      totalSize,
      sha1Digest
    );
  }
}
