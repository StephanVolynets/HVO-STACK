import { Injectable, Logger } from "@nestjs/common";
import { BoxClient, BoxJwtAuth, JwtConfig } from "box-typescript-sdk-gen";
import { Folder } from "box-typescript-sdk-gen/lib/schemas/folder.generated";
import { FileFullOrFolderMiniOrWebLink } from "box-typescript-sdk-gen/lib/schemas/fileFullOrFolderMiniOrWebLink.generated";
import { UpdateFolderByIdOptionalsInput, UpdateFolderByIdRequestBody } from "box-typescript-sdk-gen/lib/managers/folders.generated";
import { PreflightFileUploadCheckRequestBody, UploadFileRequestBody } from "box-typescript-sdk-gen/lib/managers/uploads.generated";
import { AccessType, EntityType, IStorageProvider } from "../interfaces/i-storage-provider";
import { UpdateFileByIdOptionalsInput, UpdateFileByIdRequestBody } from "box-typescript-sdk-gen/lib/managers/files.generated";
import { stringify } from "querystring";
import { Readable } from "stream";
import { UploadFileOutputDTO } from "hvo-shared";
import { decodeBase64 } from "box-typescript-sdk-gen/lib/internal/utils";
import { CreateFileUploadSessionCommitHeadersInput, CreateFileUploadSessionCommitRequestBody, CreateFileUploadSessionRequestBody } from "box-typescript-sdk-gen/lib/managers/chunkedUploads.generated";
import { UploadPart } from "box-typescript-sdk-gen/lib/schemas/uploadPart.generated";
import axios from "axios";
import { ZipDownloadRequest } from "box-typescript-sdk-gen/lib/schemas/zipDownloadRequest.generated";
export const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2GB in bytes

@Injectable()
export class BoxService implements IStorageProvider {
  private client: BoxClient;

  private readonly logger: Logger = new Logger(BoxService.name);

  constructor() {
    // Try to read it from the environment variable like JwtConfig.fromConfigJsonString(decodeBase64(process.env.JWT_CONFIG_BASE_64));
    // const jwtConfig = JwtConfig.fromConfigFile("./box-config.json");

    const jwtConfig: JwtConfig = JwtConfig.fromConfigJsonString(decodeBase64(process.env.BOX_CONFIG_BASE_64));

    const auth = new BoxJwtAuth({ config: jwtConfig });
    this.client = new BoxClient({ auth });
  }

  async createFolder(parentFolderId: string, folderName: string): Promise<Folder> {
    this.logger.log(`Creating folder "${folderName}" in parent folder ${parentFolderId}`);
    try {
      const folder = await this.client.folders.createFolder({
        parent: {
          id: parentFolderId,
        },
        name: folderName,
      });

      this.logger.log(`Created folder "${folderName}" with ID: ${folder.id}`);

      return folder;
    } catch (error) {
      this.logger.error(`Error creating folder "${folderName}" in parent folder ${parentFolderId}`, {
        error: error.message,
        stack: error.stack,
        parentFolderId,
        folderName,
        cause: error.cause,
      });
      throw new Error(`Failed to create folder "${folderName}": ${error.message}`);
    }
  }

  // async getFolderByName(parentFolderId: string, folderName: string): Promise<FileFullOrFolderMiniOrWebLink> {
  //   this.logger.log(`Searching for folder "${folderName}" in parent folder ${parentFolderId}`);
  //   try {
  //     const items = await this.client.folders.getFolderItems(parentFolderId);
  //     const folder = items.entries.find((item) => item.type === "folder" && item.name === folderName);

  //     if (folder) {
  //       return folder;
  //     } else {
  //       throw new Error(`Folder "${folderName}" not found in parent folder ${parentFolderId}`);
  //     }
  //   } catch (error) {
  //     // throw new Error(`Error retrieving folder: ${error.message}`);
  //     this.logger.error(`Error retrieving folder: ${error.message}`);
  //     return null;
  //   }
  // }

  async getFileByName(parentFolderId: string, fileName: string): Promise<FileFullOrFolderMiniOrWebLink> {
    this.logger.log(`Searching for file "${fileName}" in parent folder ${parentFolderId}`);
    try {
      const items = await this.client.folders.getFolderItems(parentFolderId);
      const folder = items.entries.find((item) => item.name === fileName);
      // const folder = items.entries.find((item) => item.type === "folder" && item.name === fileName);

      if (folder) {
        return folder;
      } else {
        throw new Error(`File "${fileName}" not found in parent folder ${parentFolderId}`);
      }
    } catch (error) {
      // Log detailed error information
      this.logger.error(`Error retrieving file "${fileName}" from parent folder ${parentFolderId}`, {
        error: error.message,
        stack: error.stack,
        parentFolderId,
        fileName,
        cause: error.cause,
      });

      // Return null to indicate file was not found, allowing caller to handle gracefully
      return null;
    }
  }

  async getOrCreateFolderByName(parentFolderId: string, folderName: string): Promise<FileFullOrFolderMiniOrWebLink> {
    this.logger.log(`Searching for or creating folder "${folderName}" in parent folder ${parentFolderId}`);
    try {
      // const items = await this.client.folders.getFolderItems(parentFolderId);

      // const folder = items.entries.find((item) => item.type === "folder" && item.name === folderName);
      const folder = await this.getFileByName(parentFolderId, folderName);

      if (folder) {
        return folder;
      } else {
        const newFolder = await this.createFolder(parentFolderId, folderName);
        return newFolder;
      }
    } catch (error) {
      // throw new Error(`Error in getOrCreateFolderByName: ${error.message}`);
      this.logger.error(`Error in getOrCreateFolderByName: ${error.message}`);
      return null;
    }
  }

  async getPresignedUrlChunked(folderId: string, fileName: string): Promise<{ uploadUrl: string; sessionId: string; accessToken: string }> {
    this.logger.log(`Getting presigned URL for chunked upload for file ${fileName} in folder ${folderId}`);
    try {
      const uploadSessionRequest: CreateFileUploadSessionRequestBody = {
        folderId,
        fileName,
        fileSize: MAX_FILE_SIZE_BYTES,
      };

      const uploadSessionResponse = await this.client.chunkedUploads.createFileUploadSession(uploadSessionRequest);

      const tokenResponse = await this.client.auth.retrieveToken();

      // return preflightResponse.sessionEndpoints.uploadPart;
      return {
        uploadUrl: uploadSessionResponse.sessionEndpoints.uploadPart,
        sessionId: uploadSessionResponse.id, // Store this for committing later
        accessToken: tokenResponse.accessToken,
      };
    } catch (error) {
      this.logger.error(`Error getting presigned URL for chunked upload: ${error.message}`);
      throw error;
    }
  }

  // async commitUploadSession(uploadUrl: string, parts: any[], digest: string) {
  //   return await this.client.chunkedUploads.createFileUploadSessionCommitByUrl(
  //     uploadUrl,
  //     {
  //       parts,
  //     },
  //     {
  //       digest,
  //     }
  //   );
  // }

  async getPreSignedUrl(folderId: string, fileName: string): Promise<string> {
    this.logger.log(`Getting pre-signed URL for file ${fileName} in folder ${folderId}`);
    try {
      const preflightRequest: PreflightFileUploadCheckRequestBody = {
        parent: { id: folderId },
        name: fileName,
        size: MAX_FILE_SIZE_BYTES,
      };

      const preflightResponse = await this.client.uploads.preflightFileUploadCheck(preflightRequest);

      this.logger.log(`Pre-signed URL generated for file ${fileName} in folder ${folderId} -> ${JSON.stringify(preflightResponse)}`);

      // Extract the upload URL from the preflight response
      const uploadUrl = preflightResponse.uploadUrl;

      if (!uploadUrl) {
        // throw new Error("Upload URL not found in the preflight response.");
        this.logger.error(`Upload URL not found in the preflight response. FolderId: ${folderId}, FileName: ${fileName}`);
        return null;
        // TODO: think: How to handle this, what should we return here? Whats the best way to handle this?
      }

      return uploadUrl;
    } catch (error) {
      this.logger.error(`Error getting pre-signed URL: ${error.message}`);
      throw error;
    }
  }

  async getPreSignedUrls(folderId: string, fileNames: string[]): Promise<{ fileName: string; uploadUrl: string | null }[]> {
    this.logger.log(`Getting pre-signed URLs for multiple files in folder ${folderId}, files: ${fileNames}`);
    try {
      const uploadSessions = await Promise.all(
        fileNames.map(async (fileName) => {
          const uploadUrl = await this.getPreSignedUrl(folderId, fileName);
          return { fileName, uploadUrl };
        })
      );
      return uploadSessions;
    } catch (error) {
      this.logger.error("Could not generate pre-signed URLs for multiple files");
      throw error;
    }
  }

  async getItems(folderId: string): Promise<FileFullOrFolderMiniOrWebLink[]> {
    this.logger.log(`Retrieving items for folderId ${folderId}`);
    try {
      const items = await this.client.folders.getFolderItems(folderId);

      return items.entries.slice();
    } catch (error) {
      // throw error;
      this.logger.error(`Error retrieving items for folderId ${folderId}: ${error.message}`);
      return null;
    }
  }

  async moveFile(fileId: string, targetParentFolderId: string, type: EntityType): Promise<void> {
    this.logger.log(`Moving (${type}) file ${fileId} to parent folder ${targetParentFolderId}`);
    try {
      if (type === "file") {
        const requestBody: UpdateFileByIdRequestBody = {
          parent: { id: targetParentFolderId },
        };

        await this.client.files.updateFileById(fileId, { requestBody });
      } else {
        const requestBody: UpdateFolderByIdRequestBody = {
          parent: { id: targetParentFolderId },
        };

        await this.client.folders.updateFolderById(fileId, { requestBody });
      }

      this.logger.log(`File ${fileId} successfully moved to ${targetParentFolderId}.`);
    } catch (error) {
      console.error(`Error moving file ${fileId} to ${targetParentFolderId}: ${error.message}`);
      throw error;
    }
  }

  async renameFile(fileId: string, newName: string, type: EntityType): Promise<void> {
    this.logger.log(`Renaming (${type}) file with ID ${fileId} to ${newName}`);
    try {
      if (type === "file") {
        const requestBody: UpdateFileByIdRequestBody = {
          name: newName,
        };

        await this.client.files.updateFileById(fileId, {
          requestBody,
        });
      } else {
        const requestBody: UpdateFolderByIdRequestBody = {
          name: newName,
        };

        await this.client.folders.updateFolderById(fileId, {
          requestBody,
        });
      }
    } catch (error) {
      console.error(`Failed to rename file with ID ${fileId}:`, error);
      throw error;
    }
  }

  async generateSharedLink(folderId: string, access: AccessType, expirationHours = 24 * 15): Promise<string> {
    try {
      const expirationDate = new Date(Date.now() + expirationHours * 60 * 60 * 1000); // Set expiration to 24 hours from now
      const requestBody: UpdateFolderByIdRequestBody = {
        sharedLink: {
          access,
          // unsharedAt: {
          //   value: expirationDate,
          // },
        },
      };

      const folder = await this.client.folders.updateFolderById(folderId, {
        requestBody,
      });
      if (folder.sharedLink && folder.sharedLink.url) {
        this.logger.log(`Shared link generated for folder with ID ${folderId}: ${folder.sharedLink.url}`);
        return folder.sharedLink.url;
      } else {
        throw new Error("Failed to retrieve the shared link URL.");
      }
    } catch (error) {
      this.logger.error(`Failed to generate shared link for folder with ID ${folderId}. Error: ${error.message}. Status: ${error.status}. Details:`, error);
      return null;
      // throw error;
    }
  }

  async uploadFile(folderId: string, fileStream: Readable, fileName: string, contentType?: string): Promise<UploadFileOutputDTO> {
    this.logger.log(`Uploading file ${fileName} to folder ID: ${folderId}`);
    try {
      // const stream = Readable.from(file.buffer);
      const requestBody: UploadFileRequestBody = {
        attributes: {
          name: fileName,
          parent: { id: folderId },
        },
        file: fileStream,
      };

      // Perform the upload
      const response = await this.client.uploads.uploadFile(requestBody);

      const uploadedFile = response.entries[0];
      this.logger.log(`File uploaded successfully with ID: ${uploadedFile.id}`);

      // Return details of the uploaded file
      return { fileId: uploadedFile.id, fileName: uploadedFile.name };
    } catch (error) {
      this.logger.error(`Failed to upload file ${fileName} to folder ID: ${folderId}:`, error);
      throw error;
    }
  }

  async deleteFile(fileId: string, type: EntityType): Promise<void> {
    this.logger.log(`Deleting (${type}) file with ID: ${fileId}`);
    try {
      if (type === "file") {
        await this.client.files.deleteFileById(fileId);
      } else {
        await this.client.folders.deleteFolderById(fileId);
      }

      this.logger.log(`File with ID: ${fileId} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete file with ID: ${fileId}:`, error);
      throw error;
    }
  }

  async downloadFile(fileId: string): Promise<{ file: Readable; name: string }> {
    this.logger.log(`Downloading file with ID: ${fileId}`);
    try {
      const file = await this.client.files.getFileById(fileId);
      this.logger.log(`› Downloading file with name: ${file.name}`);
      const fileStream = await this.client.downloads.downloadFile(fileId);
      this.logger.log(`File with ID ${fileId} downloaded successfully`);

      return {
        file: fileStream,
        name: file.name,
      };
    } catch (error) {
      this.logger.error(`Failed to download file with ID ${fileId}:`, error);
      throw error;
    }
  }

  async generateDownloadUrl(fileId: string): Promise<string> {
    this.logger.log(`Generating download URL for file with ID: ${fileId}`);

    try {
      const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Set expiration to 24 hours from now
      const requestBody: UpdateFileByIdRequestBody = {
        sharedLink: {
          access: "open",
          unsharedAt: {
            value: expirationDate,
          },
        },
      };

      const file = await this.client.files.updateFileById(fileId, {
        requestBody,
      });

      if (file.sharedLink && file.sharedLink.url) {
        return file.sharedLink.url;
      } else {
        throw new Error("Failed to generate the shared link URL.");
      }
    } catch (error) {
      this.logger.error(`Failed to generate download URL for file ID ${fileId}:`, error);
      throw error;
    }
  }

  async generateDirectDownloadUrl(fileId: string): Promise<string> {
    this.logger.log(`Generating direct download URL for file with ID: ${fileId}`);

    try {
      const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Set expiration to 7 * 24 hours from now
      const requestBody: UpdateFileByIdRequestBody = {
        sharedLink: {
          access: "open",
          unsharedAt: {
            value: expirationDate,
          },
        },
      };

      const file = await this.client.files.updateFileById(fileId, {
        requestBody,
      });

      if (file.sharedLink && file.sharedLink.downloadUrl) {
        return file.sharedLink.downloadUrl;
      } else {
        throw new Error("Failed to generate the shared download URL.");
      }
    } catch (error) {
      this.logger.error(`Failed to generate download URL for file ID ${fileId}:`, error);
      throw error;
    }
  }

  async listFiles(folderId: string): Promise<FileFullOrFolderMiniOrWebLink[]> {
    this.logger.log(`Listing files in folder ${folderId}`);
    try {
      const items = await this.client.folders.getFolderItems(folderId);
      return items.entries.slice();
    } catch (error) {
      this.logger.error(`Failed to list files in folder ${folderId}:`, error);
      throw error;
    }
  }

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
    this.logger.log(`Creating upload session for ${fileName} (${fileSize} bytes) in folder ${folderId}`);

    try {
      // Create an upload session using the Box SDK's chunked upload API
      const sessionResponse = await this.client.chunkedUploads.createFileUploadSession({
        folderId: folderId,
        fileSize: fileSize,
        fileName: fileName,
      });

      return {
        sessionId: sessionResponse.id,
        uploadUrl: sessionResponse.sessionEndpoints.uploadPart,
        expiresAt: sessionResponse.sessionExpiresAt.value.toISOString(),
        partSize: sessionResponse.partSize,
      };
    } catch (error) {
      this.logger.error(`Failed to create upload session: ${error.message}`);
      throw error;
    }
  }

  async commitUploadSession(sessionId: string, parts: Array<{ part_id: string; offset: number; size: number }>, sha1: string): Promise<UploadFileOutputDTO> {
    this.logger.log(`Committing upload session ${sessionId} with ${parts.length} parts`);

    try {
      // Convert from hex to base64 if needed
      let digestToUse = sha1;
      if (/^[0-9a-f]{40}$/i.test(sha1)) {
        const buffer = Buffer.from(sha1, "hex");
        digestToUse = buffer.toString("base64");
      }

      this.logger.log(`Committing with digest sha=${digestToUse}`);

      // Format parts as expected by the UploadPart type
      // Note that we're using partId (camelCase) not part_id (snake_case)
      const formattedParts = parts.map((part) => ({
        partId: part.part_id,
        offset: part.offset,
        size: part.size,
        // Include the SHA1 hash if available from your part data
        // If not available, you might need to store this from the upload response
      }));

      this.logger.log(`Formatted parts: ${JSON.stringify(formattedParts)}`);

      // Use the SDK to commit the upload
      const commitResponse = await this.client.chunkedUploads.createFileUploadSessionCommit(sessionId, { parts: formattedParts as any }, { digest: `sha=${digestToUse}` });

      const entries = commitResponse.entries;
      if (!entries || entries.length === 0) {
        throw new Error("No file entries found in commit response");
      }

      const uploadedFile = entries[0];
      this.logger.log(`File uploaded successfully with ID: ${uploadedFile.id}`);

      return { fileId: uploadedFile.id, fileName: uploadedFile.name };
    } catch (error) {
      this.logger.error(`Failed to commit upload session: ${error.message || error}`);

      // Log the full error details
      if (error instanceof Error) {
        this.logger.error(`Error stack: ${error.stack}`);
        this.logger.error(`Error details: ${JSON.stringify(error)}`);
      }

      throw error;
    }
  }

  async abortUploadSession(sessionId: string): Promise<void> {
    this.logger.log(`Aborting upload session ${sessionId}`);

    try {
      await this.client.chunkedUploads.deleteFileUploadSessionById(sessionId);
      this.logger.log(`Upload session ${sessionId} aborted successfully`);
    } catch (error) {
      this.logger.error(`Failed to abort upload session: ${error.message}`);
      throw error;
    }
  }

  async uploadFilePart(sessionId: string, partData: Buffer, offset: number, totalSize: number, sha1Digest: string): Promise<any> {
    const endByte = Math.min(offset + partData.length - 1, totalSize - 1);

    try {
      // Create a readable stream from the buffer
      const partStream = Readable.from(partData);

      // Important: Box expects the SHA1 digest to be base64 encoded
      // If sha1Digest is in hex format, we need to convert it to base64
      let digestToUse = sha1Digest;

      // Check if the digest is in hex format (typical output of crypto libraries)
      if (/^[0-9a-f]{40}$/i.test(sha1Digest)) {
        // Convert from hex to Buffer and then to base64
        const buffer = Buffer.from(sha1Digest, "hex");
        digestToUse = buffer.toString("base64");
      }

      // Log detailed information for debugging
      this.logger.log(`Uploading part details:
        - Session ID: ${sessionId}
        - Offset: ${offset}
        - End byte: ${endByte}
        - Total size: ${totalSize}
        - Content range: bytes ${offset}-${endByte}/${totalSize}
        - Part size: ${partData.length} bytes
        - Digest: sha=${digestToUse}`);

      // Use the Box SDK to upload the part
      const uploadedPart = await this.client.chunkedUploads.uploadFilePart(sessionId, partStream, {
        digest: `sha=${digestToUse}`,
        contentRange: `bytes ${offset}-${endByte}/${totalSize}`,
      });

      this.logger.log(`Successfully uploaded part: ${JSON.stringify(uploadedPart)}`);
      return uploadedPart;
    } catch (error) {
      this.logger.error(`Failed to upload part at offset ${offset}:`, error);
      throw error;
    }
  }

  async downloadZip(downloadRequests: ZipDownloadRequest, email: string) {
    const downloadResponse = await this.client.zipDownloads.createZipDownload(downloadRequests);

    const downloadUrl = downloadResponse.downloadUrl;

    return downloadResponse;
  }

  async createZipDownload(fileIds: string[], zipName: string): Promise<{ downloadUrl: string; statusUrl: string }> {
    this.logger.log(`[BoxService.createZipDownload] Creating ZIP "${zipName}" with ${fileIds.length} files`);

    try {
      const requestBody: ZipDownloadRequest = {
        downloadFileName: zipName,
        items: fileIds.map((id) => ({
          id,
          type: "file",
        })),
      };

      const response = await this.client.zipDownloads.createZipDownload(requestBody);

      this.logger.log(`[BoxService.createZipDownload] ZIP URL generated: ${response.downloadUrl}`);
      return {
        downloadUrl: response.downloadUrl,
        statusUrl: response.statusUrl,
      };
    } catch (error) {
      this.logger.error(`[BoxService.createZipDownload] Failed to create ZIP "${zipName}"`, {
        error: error.message,
        stack: error.stack,
      });
      throw new Error(`Failed to create ZIP download: ${error.message}`);
    }
  }
}
