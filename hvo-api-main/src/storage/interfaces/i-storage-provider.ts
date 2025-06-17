import { FileFullOrFolderMiniOrWebLink } from "box-typescript-sdk-gen/lib/schemas/fileFullOrFolderMiniOrWebLink.generated";
import { Readable } from "stream";

export const IStorageProvider = Symbol("IStorageProvider");

export type EntityType = "file" | "folder";
export type AccessType = "open" | "company" | "collaborators";

/**
 * Interface representing a storage provider with various methods for folder and file management.
 */
export interface IStorageProvider {
  /**
   * Creates a new folder under a specified parent folder.
   *
   * @param parentFolderId - The ID of the parent folder where the new folder will be created.
   * @param folderName - The name of the new folder to create.
   * @returns A promise that resolves to the created folder.
   */
  createFolder(parentFolderId: string, folderName: string): Promise<FileFullOrFolderMiniOrWebLink>;

  // /**
  //  * Retrieves the ID of a folder by its name within a specified parent folder.
  //  *
  //  * @param parentFolderId - The ID of the parent folder where the search will be performed.
  //  * @param folderName - The name of the folder to search for.
  //  * @returns  A promise that resolves to the created folder if found.
  //  * @throws An error if the folder is not found within the parent folder.
  //  */
  // getFolderByName(parentFolderId: string, folderName: string): Promise<FileFullOrFolderMiniOrWebLink>;

  /**
   * Retrieves the ID of a file by its name within a specified parent folder.
   *
   * @param parentFolderId - The ID of the parent folder where the search will be performed.
   * @param fileName - The name of the file to search for.
   * @returns  A promise that resolves to the found file if found.
   * @throws An error if the file is not found within the parent folder.
   */
  getFileByName(parentFolderId: string, fileName: string): Promise<FileFullOrFolderMiniOrWebLink>;

  /**
   * Retrieves the ID of a folder by its name within a specified parent folder,
   * or creates the folder if it does not exist.
   *
   * @param parentFolderId - The ID of the parent folder where the search will be performed.
   * @param folderName - The name of the folder to search for or create.
   * @returns A promise that resolves to the created folder.
   */
  getOrCreateFolderByName(parentFolderId: string, folderName: string): Promise<FileFullOrFolderMiniOrWebLink>;

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
   * @param fileNames - An array of objects containing the names of the files to upload.
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

  // /**
  //  * Moves a folder to a new parent folder.
  //  *
  //  * @param folderId - The ID of the folder to move.
  //  * @param targetParentFolderId - The ID of the new parent folder.
  //  * @returns A promise that resolves when the folder has been moved.
  //  */
  // moveFolder(folderId: string, targetParentFolderId: string): Promise<void>;

  /**
   * Moves a file to a new parent folder.
   *
   * @param fileId - The ID of the file to move.
   * @param targetParentFolderId - The ID of the new parent folder.
   * @param type - type of the entity. It can be "File" or "Folder".
   * @returns A promise that resolves when the file has been moved.
   */
  moveFile(fileId: string, targetParentFolderId: string, type: EntityType): Promise<void>;

  /**
   * Renames a file in the storage provider.
   * @param fileId - The unique identifier of the file to rename.
   * @param newName - The new name for the file.
   * @param type - type of the entity. It can be "File" or "Folder".
   * @returns A promise that resolves when the file is renamed.
   */
  renameFile(fileId: string, newName: string, type: EntityType): Promise<void>;

  /**
   * Generates a shared link for a folder.
   * @param folderId - The unique identifier of the folder.
   * @param access - The access level for the shared link (e.g., 'open', 'company', 'collaborators').
   * @returns A promise that resolves to the shared link URL.
   */
  generateSharedLink(folderId: string, access: AccessType): Promise<string>;

  /**
   * Uploads a file to the specified folder in the storage provider.
   * @param folderId - The unique identifier of the folder to upload the file to.
   * @param file - The file to upload.
   * @returns A promise that resolves with the uploaded file's details.
   */
  uploadFile(folderId: string, fileStream: Readable, fileName: string, contentType?: string): Promise<{ fileId: string; fileName: string }>;

  /**
   * Deletes a file from the storage provider.
   * @param fileId - The unique identifier of the file to delete.
   * @param type - type of the entity. It can be "File" or "Folder".
   * @returns A promise that resolves when the file is deleted.
   */
  deleteFile(fileId: string, type: EntityType): Promise<void>;

  /**
   * Downloads a file from the storage provider.
   * @param fileId - The unique identifier of the file to download.
   * @returns A promise that resolves with a readable stream of the file.
   */
  downloadFile(fileId: string): Promise<{ file: Readable; name: string }>;

  /**
   * Generates a download URL for a file.
   * @param fileId - The unique identifier of the file to generate a URL for.
   * @returns A promise that resolves with the download URL as a string.
   */
  generateDownloadUrl(fileId: string): Promise<string>;
}

// Even further improvements: We can create our own custom Interface for File and Folder, and use a converter to convert the Box SDK types to our custom types.
// This way we can decouple our application from the Box SDK and make it easier to switch to another storage provider in the future.
