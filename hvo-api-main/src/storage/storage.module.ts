import { forwardRef, Module } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { StorageController } from "./storage.controller";
import { IStorageProvider } from "./interfaces/i-storage-provider";
import { BoxService } from "./providers/box.service";
import { CreatorService } from "src/creator/creator.service";
import { TranscriptionModule } from "src/transcription/transcription.module";
import { GCSService } from "./providers/gcs.service";
@Module({
  imports: [forwardRef(() => TranscriptionModule)],
  controllers: [StorageController],
  providers: [
    // {
    //   provide: IStorageProvider,
    //   useClass: BoxService,
    // },
    CreatorService,
    BoxService,
    StorageService,
    GCSService,
  ],
  exports: [StorageService, BoxService, GCSService],
})
export class StorageModule {}
