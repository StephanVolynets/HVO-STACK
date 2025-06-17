import { FileFullOrFolderMiniOrWebLink } from "box-typescript-sdk-gen/lib/schemas/fileFullOrFolderMiniOrWebLink.generated";
import { Folder } from "box-typescript-sdk-gen/lib/schemas/folder.generated";

export const IBoxService = Symbol("IBoxService");

export interface IBoxService {
  /**
   * Creates a new folder under a specified parent folder.
   *
   * @param parentFolderId - The ID of the parent folder where the new folder will be created.
   * @param folderName - The name of the new folder to create.
   * @returns A promise that resolves to the ID of the created folder.
   */
  createFolder(parentFolderId: string, folderName: string): Promise<Folder>;

  /**
   * Retrieves the ID of a folder by its name within a specified parent folder.
   *
   * @param parentFolderId - The ID of the parent folder where the search will be performed.
   * @param folderName - The name of the folder to search for.
   * @returns A promise that resolves to the ID of the folder if found.
   * @throws An error if the folder is not found within the parent folder.
   */
  getFolderByName(parentFolderId: string, folderName: string): Promise<Folder>;

  /**
   * Retrieves the ID of a folder by its name within a specified parent folder,
   * or creates the folder if it does not exist.
   *
   * @param parentFolderId - The ID of the parent folder where the search will be performed.
   * @param folderName - The name of the folder to search for or create.
   * @returns A promise that resolves to the ID of the folder.
   */
  getOrCreateFolderByName(parentFolderId: string, folderName: string): Promise<Folder>;

  /**
   * Generates a pre-signed URL for direct file upload to a specific folder.
   *
   * @param folderId - The ID of the folder where the file will be uploaded.
   * @param fileName - The name of the file to upload.
   * @returns A promise that resolves to the pre-signed URL for uploading the file.
   */
  getPreSignedUrl(folderId: string, fileName: string): Promise<string>;

  /**
   * Generates pre-signed URLs for direct file uploads to a specific folder.
   *
   * @param folderId - The ID of the folder where the files will be uploaded.
   * @param files - An array of objects containing the names of the files to upload.
   * @returns A promise that resolves to an array of objects containing file names and their corresponding pre-signed URLs.
   */
  getPreSignedUrls(folderId: string, fileNames: string[]): Promise<{ fileName: string; uploadUrl: string }[]>;

  /**
   * Retrieves the items within a specified folder.
   *
   * @param folderId - The ID of the folder from which items will be retrieved.
   * @returns A promise that resolves to a list of items within the folder.
   */
  getItems(folderId: string): Promise<FileFullOrFolderMiniOrWebLink[]>;

  /**
   * Moves a folder to a new parent folder.
   *
   * @param folderId - The ID of the folder to move.
   * @param targetParentFolderId - The ID of the new parent folder.
   * @returns A promise that resolves when the folder has been moved.
   */
  moveFolder(folderId: string, targetParentFolderId: string): Promise<void>;
}
