import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/src/prisma.module";
import { FirebaseStrategy } from "./strategies/firebase-auth.strategy";
import { RolesGuard } from "./guards/roles.guard";
import { FirebaseAuthGuard } from "./guards/firebase-auth.guard";
import { DefaultAuthGuard } from "./auth.guard";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "firebase-jwt" })],
  controllers: [AuthController],
  providers: [FirebaseStrategy,
    FirebaseAuthGuard,
    DefaultAuthGuard,
    RolesGuard, AuthService],
  exports: [PassportModule, AuthService, FirebaseAuthGuard,
    DefaultAuthGuard,
    RolesGuard],
})
export class AuthModule { }
