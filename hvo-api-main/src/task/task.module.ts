import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { StorageModule } from "src/storage/storage.module";
import { NotificationsModule } from "src/notifications/notifications.module";
import { NotificationGeneratorService } from "src/notifications/services/notifications-generator.service";
import { PubSubModule } from "src/other-modules/pubsub/pubsub.module";
@Module({
  imports: [StorageModule, NotificationsModule, PubSubModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
