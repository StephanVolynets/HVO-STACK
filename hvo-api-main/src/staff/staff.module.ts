import { Module } from "@nestjs/common";
import { StaffService } from "./staff.service";
import { StaffController } from "./staff.controller";
import { AuthModule } from "src/auth/auth.module";
import { StorageModule } from "src/storage/storage.module";
import { NotificationsModule } from "src/notifications/notifications.module";

@Module({
  controllers: [StaffController],
  providers: [StaffService],
  imports: [AuthModule, StorageModule, NotificationsModule],
})
export class StaffModule {}
