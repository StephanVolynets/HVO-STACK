import { Injectable, Logger } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import { readFile } from "fs/promises";

@Injectable()
export class GCSService {
  private readonly logger: Logger = new Logger(GCSService.name);
  private storage: Storage;
  private readonly bucketName: string;

  constructor() {
    // this.storage = new Storage();
    this.bucketName = process.env.STORAGE_BUCKET;
    this.initStorage();
  }

  async getSignedUrl(filePath: string, expiresInMinutes: number = 60 * 48) {
    const [url] = await this.storage
      .bucket(this.bucketName)
      .file(filePath)
      .getSignedUrl({
        action: "read",
        expires: Date.now() + expiresInMinutes * 60 * 1000,
      });
    return url;
  }

  async initStorage() {
    const APP_ENV = process.env.APP_ENV;
    const readServiceAccount = async () => JSON.parse(await readFile("service-account-dev.json", "utf8"));
    const serviceAccount = APP_ENV === "local" ? await readServiceAccount() : null;

    this.storage = new Storage({
      credentials: serviceAccount,
    });
  }
}
