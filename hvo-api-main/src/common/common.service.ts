import { Injectable, Logger } from "@nestjs/common";
import { LanguageDTO } from "hvo-shared";
import { PrismaService } from "src/prisma/src/prisma.service";
import * as admin from "firebase-admin";

@Injectable()
export class CommonService {
  private readonly logger: Logger = new Logger(CommonService.name);
  constructor(protected readonly prisma: PrismaService) {}

  async getAllLanguages(): Promise<LanguageDTO[]> {
    this.logger.log(`[CommonService.getAllLanguages] Retreiving all languages`);

    const languages = await this.prisma.language.findMany();
    return languages as LanguageDTO[];
  }

  // One time use
  async populateFirebaseUIDs() {
    // Step 1: Fetch users without firebase_uid
    const usersWithoutUIDs = await this.prisma.user.findMany({
      where: { firebase_uid: null },
    });

    for (const user of usersWithoutUIDs) {
      try {
        let firebaseUser;

        // Step 2: Check if the user already exists in Firebase Auth
        try {
          firebaseUser = await admin.auth().getUserByEmail(user.email);
          console.log(`Firebase user exists for email: ${user.email}`);
        } catch (error) {
          if (error.code === "auth/user-not-found") {
            // Step 3: Create the user in Firebase Auth if not found
            firebaseUser = await admin.auth().createUser({
              email: user.email,
              displayName: user.full_name,
            });
            console.log(`Created Firebase user for email: ${user.email}`);
          } else {
            throw error; // Rethrow other errors
          }
        }

        // Step 4: Update the database with the Firebase UID
        await this.prisma.user.update({
          where: { id: user.id },
          data: { firebase_uid: firebaseUser.uid },
        });

        console.log(`Updated Firebase UID for user: ${user.email}`);
      } catch (error) {
        console.error(`Failed to process user: ${user.email}`, error);
      }
    }
  }
}
