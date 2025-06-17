import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Auth, getAuth } from "firebase-admin/auth";
import { ConflictException } from "src/errors";
// import { FirestoreService } from "src/firestore/firestore.service";
import { UserService } from "src/user/user.service";
// import { RegisteRequestDto } from "./dto/RegisterRequestDto";
import { Timestamp } from "firebase-admin/firestore";
import { PrismaService } from "src/prisma/src/prisma.service";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  private auth: Auth = getAuth();

  private readonly JWT_SECRET = process.env.JWT_SECRET;
  private readonly JWT_EXPIRATION_DAYS = parseInt(process.env.JWT_EXPIRATION_DAYS, 10);

  constructor(protected readonly prisma: PrismaService) {}

  async getOrCreateJWT(userId: number): Promise<string> {
    // Fetch the latest token for the user
    const latestToken = await this.prisma.token.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();

    // Check if the latest token is valid and not expired
    if (latestToken) {
      //&& latestToken.expiresAt > now) {
      return latestToken.token;
    }

    // Generate a new JWT token
    const expiresAt = new Date();
    expiresAt.setDate(now.getDate() + this.JWT_EXPIRATION_DAYS);

    const token = jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn: `${this.JWT_EXPIRATION_DAYS}d`,
    });

    // Store the new token in the database
    await this.prisma.token.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return token;
  }

  async validateJWTAndGenerateFirebaseToken(token: string): Promise<string> {
    try {
      console.log("token", token, this.JWT_SECRET);
      // Verify the JWT
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: number };

      console.log("decoded", decoded);

      // Fetch the user from the database
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      console.log("user", user);

      if (!user || !user.firebase_uid) {
        throw new UnauthorizedException("User does not exist or is missing Firebase UID");
      }

      // Generate a Firebase custom token
      return await this.auth.createCustomToken(user.firebase_uid);
    } catch (error) {
      console.log("[Error] validateJWTAndGenerateFirebaseToken: ", error);
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  // Other
  async verifyAssistantOwnership(managerId: number, assistantId: number) {
    // const assistant = await this.prisma.assistant.findUnique({
    //   where: { id: assistantId },
    // });
    // if (!assistant) {
    //   throw new NotFoundException("Assistant not found");
    // }
    // if (assistant.managerId !== managerId) {
    //   throw new ForbiddenException("You do not have permission to manage this assistant");
    // }
  }
}

// async generateAndStoreToken(userId: number): Promise<string> {
//   const user = await this.prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user || !user.firebase_uid) {
//     throw new Error("User does not exist or is missing Firebase UID");
//   }

//   const customToken = await this.auth.createCustomToken(user.firebase_uid);

//   const expirationDate = new Date();
//   expirationDate.setDate(expirationDate.getDate() + parseInt(process.env.TOKEN_EXPIRATION_DAYS, 10));

//   await this.prisma.token.create({
//     data: {
//       userId,
//       token: customToken,
//       expiresAt: expirationDate,
//     },
//   });

//   return customToken;
// }

// async getOrCreateToken(userId: number): Promise<string> {
//   const latestToken = await this.prisma.token.findFirst({
//     where: { userId },
//     orderBy: { createdAt: "desc" },
//   });

//   const now = new Date();

//   if (latestToken && latestToken.expiresAt > now) {
//     // Return the valid token
//     return latestToken.token;
//   }

//   // Generate a new token if none exists or the latest is expired
//   return await this.generateAndStoreToken(userId);
// }
