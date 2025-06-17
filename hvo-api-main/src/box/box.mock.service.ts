import { Folder } from "box-typescript-sdk-gen/lib/schemas/folder.generated";
import { IBoxService } from "./box.service.interface";

// export class MockBoxService implements IBoxService {
//   private folders: { [key: string]: { name: string; id: string; parentId: string }[] } = {};
//   private items: { [key: string]: any[] } = {};
//   private idCounter = 1;

//   async createFolder(parentFolderId: string, folderName: string): Promise<Folder> {
//     const newFolderId = `folder_${this.idCounter++}`;
//     const newFolder: Folder = {
//       id: newFolderId,
//       name: folderName,
//       parent: { id: parentFolderId }
//     };
//     this.folders[parentFolderId] = this.folders[parentFolderId] || [];
//     this.folders[parentFolderId].push(newFolder);
//     return newFolder;
//   }

//   async getFolderByName(parentFolderId: string, folderName: string): Promise<Folder> {
//     const folder = this.folders[parentFolderId]?.find((f) => f.name === folderName);
//     if (!folder) {
//       throw new Error(`Folder "${folderName}" not found in parent folder ${parentFolderId}`);
//     }
//     return folder;
//   }

//   async getOrCreateFolderByName(parentFolderId: string, folderName: string): Promise<Folder> {
//     const folder = this.folders[parentFolderId]?.find((f) => f.name === folderName);
//     if (folder) {
//       return folder;
//     }
//     return this.createFolder(parentFolderId, folderName);
//   }

//   async getPreSignedUrl(folderId: string, fileName: string): Promise<string> {
//     // Returns a mock pre-signed URL
//     return `https://mock.box.com/upload/${folderId}/${fileName}`;
//   }

//   async getPreSignedUrls(
//     folderId: string,
//     files: { name: string }[]
//   ): Promise<{ fileName: string; uploadUrl: string }[]> {
//     // Returns mock pre-signed URLs for the given files
//     return files.map((file) => ({
//       fileName: file.name,
//       uploadUrl: `https://mock.box.com/upload/${folderId}/${file.name}`,
//     }));
//   }

//   async getItems(folderId: string): Promise<any[]> {
//     // Return a list of mock items for the given folder
//     return this.items[folderId] || [];
//   }

//   async moveFolder(folderId: string, targetParentFolderId: string): Promise<void> {
//     const folderEntry = Object.values(this.folders)
//       .flat()
//       .find((f) => f.id === folderId);
//     if (folderEntry) {
//       const oldParentId = folderEntry.parentId;
//       this.folders[oldParentId] = this.folders[oldParentId].filter((f) => f.id !== folderId);
//       this.folders[targetParentFolderId] = this.folders[targetParentFolderId] || [];
//       this.folders[targetParentFolderId].push(folderEntry);
//       folderEntry.parentId = targetParentFolderId;
//     } else {
//       throw new Error(`Folder with ID "${folderId}" not found`);
//     }
//   }
// }
