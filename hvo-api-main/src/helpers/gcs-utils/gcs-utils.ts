import { Storage } from "@google-cloud/storage";

export const renameFolderInGCS = async (
  storage: Storage,
  oldFolderPath: string,
  newFolderPath: string,
  bucketName: string
) => {
  const bucket = storage.bucket(bucketName);

  // List all files in the old folder
  const [files] = await bucket.getFiles({ prefix: oldFolderPath });

  for (const file of files) {
    const newFilePath = file.name.replace(oldFolderPath, newFolderPath);
    await file.move(newFilePath);
    // this.logger.log(`Moved file from ${file.name} to ${newFilePath}`);
  }
};

export const renameFileInGCS = async (storage: Storage, oldPath: string, newPath: string, bucketName: string) => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(oldPath);
  await file.move(newPath);
  // this.logger.log(`Renamed file from ${oldPath} to ${newPath}`);
};
