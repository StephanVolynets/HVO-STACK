import { forwardRef, Module } from "@nestjs/common";
import { TranscriptionService } from "./transcription.service";
import { TranscriptionController } from "./transcription.controller";
import { SonixService } from "./providers/sonix.service";
import { StorageModule } from "src/storage/storage.module";
import { NotificationsModule } from "src/notifications/notifications.module";

@Module({
  imports: [forwardRef(() => StorageModule), NotificationsModule],
  providers: [SonixService, TranscriptionService],
  exports: [TranscriptionService],
  controllers: [TranscriptionController],
})
export class TranscriptionModule {}
