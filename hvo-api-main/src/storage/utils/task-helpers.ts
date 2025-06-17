import { ResourceItemDTO } from "hvo-shared";
import { IStorageProvider } from "../interfaces/i-storage-provider";
import { TaskType } from "@prisma/client";
import { VIDEO_SUBFOLDERS } from "../constants/storage.constants";
import { FileFullOrFolderMiniOrWebLink } from "box-typescript-sdk-gen/lib/schemas/fileFullOrFolderMiniOrWebLink.generated";

export const createResourcesDTOs = async (
  storageProvider: IStorageProvider,
  resourceFolderID: string,
  videoFolderId: string,
  videoTitle: string
): Promise<ResourceItemDTO[]> => {
  const resources: ResourceItemDTO[] = [];

  // Get video file file from box
  const videoFile = await storageProvider.getFileByName(
    videoFolderId,
    `${videoTitle}.mp4`
  );
  const videoFileDownloadUrl = await storageProvider.generateDownloadUrl(
    videoFile.id
  );
  const videoFileResourceItem: ResourceItemDTO = {
    fileId: videoFile.id,
    name: videoFile.name,
    type: videoFile.type,
    downloadUrl: videoFileDownloadUrl,
  };
  resources.push(videoFileResourceItem);

  // Get all files from resource folder
  const files = await storageProvider.getItems(resourceFolderID);
  for (const file of files) {
    const downloadUrl = await storageProvider.generateDownloadUrl(file.id);

    const resourceItem: ResourceItemDTO = {
      fileId: file.id,
      name: file.name,
      type: file.type,
      downloadUrl: downloadUrl,
    };

    resources.push(resourceItem);
  }

  return resources;
};

export const createUploadedFilesDTOs = async (
  storageProvider: IStorageProvider,
  resourceFolderID
): Promise<ResourceItemDTO[]> => {
  const uploadedFiles: ResourceItemDTO[] = [];

  const files = await storageProvider.getItems(resourceFolderID);

  for (const file of files) {
    const downloadUrl = await storageProvider.generateDownloadUrl(file.id);

    const uploadedFile: ResourceItemDTO = {
      fileId: file.id,
      name: file.name,
      type: file.type,
      downloadUrl: downloadUrl,
    };

    uploadedFiles.push(uploadedFile);
  }

  return uploadedFiles;
};

export const getTaskResourcesFolder = async (
  storageProvider: IStorageProvider,
  videoRootFolderId: string,
  tasktype: TaskType,
  languageName: string
): Promise<FileFullOrFolderMiniOrWebLink> => {
  switch (tasktype) {
    case TaskType.TRANSCRIPTION:
      // const originalTranscriptFolder = await storageProvider.getFileByName(videoRootFolderId, VIDEO_SUBFOLDERS.ENGLISH_TRANSCRIPT);
      const rawScriptFolder = await storageProvider.getFileByName(
        videoRootFolderId,
        VIDEO_SUBFOLDERS.RAW_TRANSCRIPT
      );
      return rawScriptFolder;

    case TaskType.TRANSLATION:
      const englishTranscriptFolder = await storageProvider.getFileByName(
        videoRootFolderId,
        VIDEO_SUBFOLDERS.ENGLISH_TRANSCRIPT
      );
      // const finalScriptFolder = await storageProvider.getFileByName(_originalTranscriptFolder.id, VIDEO_SUBFOLDERS.FINAL_SCRIPT);
      return englishTranscriptFolder;

    case TaskType.VOICE_OVER:
      const languageFolder = await storageProvider.getFileByName(
        videoRootFolderId,
        languageName
      );
      // const scriptFolder = await storageProvider.getFileByName(languageFolder.id, VIDEO_SUBFOLDERS.SCRIPT);
      return languageFolder;
    case TaskType.AUDIO_ENGINEERING:
      const _languageFolder = await storageProvider.getFileByName(
        videoRootFolderId,
        languageName
      );
      // const studioFolder = await storageProvider.getFileByName(_languageFolder.id, VIDEO_SUBFOLDERS.STUDIO);
      return _languageFolder;
  }
};

export const getTaskUploadFolder = async (
  storageProvider: IStorageProvider,
  videoRootFolderId: string,
  tasktype: TaskType,
  languageName: string
): Promise<FileFullOrFolderMiniOrWebLink> => {
  switch (tasktype) {
    case TaskType.TRANSCRIPTION:
      const originalTranscriptFolder = await storageProvider.getFileByName(
        videoRootFolderId,
        VIDEO_SUBFOLDERS.ENGLISH_TRANSCRIPT
      );
      // const finalScriptFolder = await storageProvider.getFileByName(originalTranscriptFolder.id, VIDEO_SUBFOLDERS.FINAL_SCRIPT);
      return originalTranscriptFolder;
    case TaskType.TRANSLATION:
      const languageFolder = await storageProvider.getFileByName(
        videoRootFolderId,
        languageName
      );
      // const scriptFolder = await storageProvider.getFileByName(languageFolder.id, VIDEO_SUBFOLDERS.DELIVERABLES);
      return languageFolder;
    case TaskType.VOICE_OVER:
      const _languageFolder = await storageProvider.getFileByName(
        videoRootFolderId,
        languageName
      );
      // const studioFolder = await storageProvider.getFileByName(_languageFolder.id, VIDEO_SUBFOLDERS.DELIVERABLES);
      return _languageFolder;
    case TaskType.AUDIO_ENGINEERING:
      const __languageFolder = await storageProvider.getFileByName(
        videoRootFolderId,
        languageName
      );
      // const deliverablesFolder = await storageProvider.getFileByName(__languageFolder.id, VIDEO_SUBFOLDERS.DELIVERABLES);
      return __languageFolder;
  }
};
