import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { HealthModule } from "./health/health.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaModule } from "./prisma/src/prisma.module";
import { CreatorModule } from "./creator/creator.module";
import { CommonModule } from "./common/common.module";
import { StaffModule } from "./staff/staff.module";
import { VideoModule } from "./video/video.module";
import { TaskModule } from "./task/task.module";
// import { BoxModule } from './box/box.module';
import { StorageModule } from "./storage/storage.module";
import { TranscriptionModule } from "./transcription/transcription.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { PubSubModule } from "./other-modules/pubsub/pubsub.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === "development" ? [".env.development"] : undefined,
      ignoreEnvFile: process.env.NODE_ENV !== "development",
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    PrismaModule,
    UserModule,
    AuthModule,
    CreatorModule,
    CommonModule,
    StaffModule,
    VideoModule,
    TaskModule,
    // BoxModule,
    StorageModule,
    TranscriptionModule,
    NotificationsModule,
    PubSubModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_PIPE, useClass: ZodValidationPipe }, AppService],
})
export class AppModule {}
