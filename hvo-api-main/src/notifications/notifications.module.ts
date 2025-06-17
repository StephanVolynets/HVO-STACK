import { forwardRef, Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { QueueService } from "./services/queue.service";
import { EmailProvider } from "./providers/email.provider";
import { DiscordProvider } from "./providers/discord.provider";
import { NotificationsProcessor } from "./processors-(not-used)/notification.processor";
import { NotificationService } from "./services/notifications.service";
import { NotificationDataService } from "./services/notifications-data.service";
import { NotificationGeneratorService } from "./services/notifications-generator.service";
import { StorageModule } from "src/storage/storage.module";
import { AuthModule } from "src/auth/auth.module";
import { DiscordGeneratorService } from "./services/discord-generator.service";
// import { RedisTestService } from "./services/bulltest.service";

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: "127.0.0.1",
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: "notifications",
    }),
    forwardRef(() => StorageModule),
    // forwardRef(() => AuthModule),
    AuthModule,
  ],
  providers: [
    QueueService,
    EmailProvider,
    DiscordProvider,
    NotificationsProcessor,
    NotificationService,
    NotificationDataService,
    NotificationGeneratorService,
    DiscordGeneratorService,
    // RedisTestService,
  ],
  exports: [
    QueueService,
    NotificationService,
    NotificationDataService,
    NotificationGeneratorService,
    DiscordGeneratorService,
  ],
})
export class NotificationsModule {}
