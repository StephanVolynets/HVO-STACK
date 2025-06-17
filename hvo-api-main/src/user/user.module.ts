import { Global, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { StorageModule } from "src/storage/storage.module";
import { NotificationsModule } from "src/notifications/notifications.module";
@Global()
@Module({
  imports: [StorageModule, NotificationsModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
