import { Module } from "@nestjs/common";
import { VideoService } from "./video.service";
import { VideoController } from "./video.controller";
import { StorageModule } from "src/storage/storage.module";
import { PubSubModule } from "src/other-modules/pubsub/pubsub.module";
import { NotificationsModule } from "src/notifications/notifications.module";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    StorageModule,
    PubSubModule,
    NotificationsModule,
    ConfigModule,
    MulterModule.register({
      dest: "./uploads",
    }),
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
