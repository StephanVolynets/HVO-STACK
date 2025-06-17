import { Injectable } from "@nestjs/common";
import { BoxService } from "./box.service";
import { PHASE_FOLDERS_NAMES, VIDEO_SUBFOLDERS } from "./box.constants";

@Injectable()
export class BoxInitializerService {
  constructor(private readonly boxService: BoxService) {}

  /**
   * Initializes folders for a creator, including Backlog, Ongoing, and Completed folders.
   *
   * @param creatorName - The name of the creator.
   * @returns A promise that resolves when the folders have been created.
   */
  async initializeCreatorFolders(creatorName: string): Promise<void> {
    const creatorFolder = await this.boxService.createFolder(process.env.HVO_APP_FOLDER_ID, creatorName);
    await this.boxService.createFolder(creatorFolder.id, PHASE_FOLDERS_NAMES.BACKLOG);
    await this.boxService.createFolder(creatorFolder.id, PHASE_FOLDERS_NAMES.ONGOING);
    await this.boxService.createFolder(creatorFolder.id, PHASE_FOLDERS_NAMES.COMPLETED);
  }

  /**
   * Initializes folders for a video within a creator's folder, including subfolders for source files,
   * original transcript, and language-specific folders.
   *
   * @param creatorFolderId - The ID of the creator's folder.
   * @param videoTitle - The title of the video.
   * @param languages - An array of language names for which folders will be created.
   * @returns A promise that resolves to an object containing a signed upload link for the Source Files.
   */
  async initializeVideoFolders(creatorFolderId: string, videoTitle: string, languages: string[]): Promise<string> {
    // Step 1: Locate the creator's backlog folder and create a video folder within it
    const backlogFolder = await this.boxService.getFolderByName(creatorFolderId, PHASE_FOLDERS_NAMES.BACKLOG);
    const videoFolder = await this.boxService.createFolder(backlogFolder.id, videoTitle);
    const secondLevelFolder = await this.boxService.createFolder(videoFolder.id, videoTitle);
    const thirdLevelFolder = await this.boxService.createFolder(secondLevelFolder.id, videoTitle);

    // Step 2: Create the Source Files folder within the video folder
    const sourceFilesFolder = await this.boxService.createFolder(secondLevelFolder.id, VIDEO_SUBFOLDERS.INTERNAL_FILES);

    // Step 3: Create subfolders within Original Transcript for Raw Script and Final Script
    const originalTranscriptFolder = await this.boxService.createFolder(sourceFilesFolder.id, VIDEO_SUBFOLDERS.RAW_TRANSCRIPT);
    // await this.boxService.createFolder(originalTranscriptFolder.id, VIDEO_SUBFOLDERS.RAW_SCRIPT);
    // await this.boxService.createFolder(originalTranscriptFolder.id, VIDEO_SUBFOLDERS.FINAL_SCRIPT);

    // Step 4: Create language-specific folders, each containing Script, Studio, and Deliverables subfolders
    for (const languageName of languages) {
      const internalLanguageFolder = await this.boxService.createFolder(sourceFilesFolder.id, languageName);
      const languageFolder = await this.boxService.createFolder(thirdLevelFolder.id, languageName);
      await this.boxService.createFolder(internalLanguageFolder.id, VIDEO_SUBFOLDERS.SCRIPT);
      await this.boxService.createFolder(internalLanguageFolder.id, VIDEO_SUBFOLDERS.STUDIO);
      await this.boxService.createFolder(internalLanguageFolder.id, VIDEO_SUBFOLDERS.DELIVERABLES);
    }

    // Step 5: Generate a pre-signed upload URL for the Source Files folder
    const uploadUrl = await this.boxService.getPreSignedUrl(sourceFilesFolder.id, `${videoTitle}_source.mp4`);

    // Return the video folder ID and the pre-signed upload link
    return uploadUrl;
  }
}
