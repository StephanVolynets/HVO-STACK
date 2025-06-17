import { Injectable, Logger } from "@nestjs/common";
import { IBoxService } from "./box.service.interface";
import { BoxClient, BoxJwtAuth, JwtConfig } from "box-typescript-sdk-gen";
import { Folder } from "box-typescript-sdk-gen/lib/schemas/folder.generated";
import { FileFullOrFolderMiniOrWebLink } from "box-typescript-sdk-gen/lib/schemas/fileFullOrFolderMiniOrWebLink.generated";
import { UpdateFolderByIdRequestBody } from "box-typescript-sdk-gen/lib/managers/folders.generated";
import { PreflightFileUploadCheckRequestBody } from "box-typescript-sdk-gen/lib/managers/uploads.generated";

// @Injectable()
export class BoxService implements IBoxService {
  private client;

  private readonly logger: Logger = new Logger(BoxService.name);

  // constructor() {
  //   this.sdk = new BoxSDK({
  //     clientID: process.env.BOX_CLIENT_ID,
  //     clientSecret: process.env.BOX_CLIENT_SECRET,
  //   });
  //   this.client = this.sdk.getAppAuthClient("enterprise", process.env.BOX_ENTERPRISE_ID);
  // }

  constructor() {
    //   const jwtConfig: JwtConfig = JwtConfig.fromConfigJsonString(decodeBase64(process.env.JWT_CONFIG_BASE_64));
    // const jwtConfig = JwtConfig.fromConfigFile("./box-config.json");
    // Try to read it from the environment variable like JwtConfig.fromConfigJsonString(decodeBase64(process.env.JWT_CONFIG_BASE_64));
    // const auth = new BoxJwtAuth({ config: jwtConfig });
    // this.client = new BoxClient({ auth });
    // this.getUserInfo().catch(console.error);
    // this.logger.log("HI!");
    // this.test2().catch(console.error);
  }

  // constructor() {
  //   const jwtConfig: JwtConfig = JwtConfig.fromConfigJsonString(decodeBase64(process.env.JWT_CONFIG_BASE_64));
  //   const auth: BoxJwtAuth = new BoxJwtAuth({ config: jwtConfig });
  //   // const userAuth: BoxJwtAuth = auth.withUserSubject("37709003362");
  //   // const userClient: BoxClient = new BoxClient({ auth: userAuth });
  //   // const jwtAuth = new BoxJwtAuth({ config: config as any as JwtConfig });

  //   this.client = new BoxClient({ auth: auth });

  //   console.log(this.client.folders);
  //   // this.test();
  // }

  async test() {
    // let entries = (await this.client.folders.getFolderItems(process.env.HVO_APP_FOLDER_ID)).entries;
    // entries.forEach((entry) => this.logger.log("---->" + entry));
    // const stuff = await this.client.folders.getFolderItems("0");
    // this.logger.log("Staff->" + JSON.stringify(stuff));
    // const newFolder = await this.client.folders.createFolder({
    //   parent: { id: "0" },
    //   name: "New Folder",
    // });
    // console.log("Created Folder ID:", newFolder.id);
    const folder = await this.getFolderByName("0", "New Folder");
    console.log(folder);
  }

  async test2() {
    // const folderNew = await this.createFolder("0", "Folder 3");

    const files = await this.getItems("0");
    console.log("Created Folder ID:", files);
  }

  async testCreateFolder(parentId: string, folderName: string) {
    const file = await this.getOrCreateFolderByName(parentId, folderName);
    return file;
  }

  async testMoveFolder(parentId: string, folderName: string) {
    const file = await this.getFolderByName("0", folderName);

    this.moveFolder(file.id, parentId).catch(console.error);
    return { message: "Folder moved successfully" };
  }

  async testGetFiles(parentId: string) {
    const files = await this.getItems(parentId);
    return files;
  }

  async getUserInfo() {
    const user = await this.client.users.getUserMe();
    this.logger.log(`Authenticated as user: ${user.name}`);
  }

  async createFolder(parentFolderId: string, folderName: string): Promise<Folder> {
    this.logger.log(`Creating folder "${folderName}" in parent folder ${parentFolderId}`);
    const folder = await this.client.folders.createFolder({
      parent: {
        id: parentFolderId,
      },
      name: folderName,
    });

    this.logger.log(`Created folder "${folderName}" with ID: ${folder.id}`);

    return folder;
  }

  async getFolderByName(parentFolderId: string, folderName: string): Promise<Folder> {
    this.logger.log(`Searching for folder "${folderName}" in parent folder ${parentFolderId}`);
    try {
      const items = await this.client.folders.getFolderItems(parentFolderId);
      const folder = items.entries.find((item) => item.type === "folder" && item.name === folderName);

      if (folder) {
        return folder;
      } else {
        throw new Error(`Folder "${folderName}" not found in parent folder ${parentFolderId}`);
      }
    } catch (error) {
      // throw new Error(`Error retrieving folder: ${error.message}`);
      this.logger.error(`Error retrieving folder: ${error.message}`);
      return null;
    }
  }

  async getOrCreateFolderByName(parentFolderId: string, folderName: string): Promise<Folder> {
    this.logger.log(`Searching for or creating folder "${folderName}" in parent folder ${parentFolderId}`);
    try {
      // const items = await this.client.folders.getFolderItems(parentFolderId);

      // const folder = items.entries.find((item) => item.type === "folder" && item.name === folderName);
      const folder = await this.getFolderByName(parentFolderId, folderName);

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

  // async moveFolderToStage(folderId: string, creatorName: string, targetStage: FolderStage) {
  //   // Get or create the creator's main folder under HVO_APP
  //   const creatorFolderId = await this.getOrCreateCreatorFolder(creatorName);

  //   // Get or create the specific stage folder under the creator's folder
  //   const targetParentFolderId = await this.getOrCreateStageFolder(creatorFolderId, targetStage);

  //   try {
  //     // Move the folder by updating its parent_folder_id
  //     await this.client.folders.update(folderId, { parent: { id: targetParentFolderId } });
  //     return { message: `Folder moved to ${targetStage} successfully` };
  //   } catch (error) {
  //     throw new Error(`Failed to move folder: ${error.message}`);
  //   }
  // }

  async getPreSignedUrl(folderId: string, fileName: string): Promise<string> {
    this.logger.log(`Getting pre-signed URL for file ${fileName} in folder ${folderId}`);
    try {
      // Perform a preflight check: verifies that the file can be uploaded to the specified folder. It checks for potential issues such as file size limits, storage quotas, and file name conflicts
      // const preflightResponse = await this.client.files.getPreflightCheck({
      //   name: fileName,
      //   parent: { id: folderId },
      // });

      const preflightRequest: PreflightFileUploadCheckRequestBody = {
        parent: { id: folderId },
        name: fileName,
        size: 20000000, // 20mb
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

      return items.entries;
    } catch (error) {
      // throw error;
      this.logger.error(`Error retrieving items for folderId ${folderId}: ${error.message}`);
      return null;
    }
  }

  async moveFolder(folderId: string, targetParentFolderId: string): Promise<void> {
    this.logger.log(`Moving folder ${folderId} to parent folder ${targetParentFolderId}`);
    try {
      const requestBody: UpdateFolderByIdRequestBody = {
        parent: { id: targetParentFolderId },
      };

      await this.client.folders.updateFolderById(folderId, { requestBody });

      this.logger.log(`Folder ${folderId} successfully moved to ${targetParentFolderId}.`);
    } catch (error) {
      console.error(`Error moving folder ${folderId} to ${targetParentFolderId}: ${error.message}`);
      throw error;
    }
  }
}
