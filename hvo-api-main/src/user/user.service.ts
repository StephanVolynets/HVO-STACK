import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Auth, getAuth, UserRecord } from "firebase-admin/auth";
import {
  AssistantDTO,
  CreateAssistantDTO,
  CreateCreatorDTO,
  CreateStaffDTO,
  CreateUserDTO,
  Role,
  StaffType,
  UpdateUserDTO,
  UpdateUserImageDTO,
  UserProfileDTO,
} from "hvo-shared";
import { PrismaService } from "src/prisma/src/prisma.service";
import { StorageService } from "src/storage/storage.service";
import { generateAvatarUrl } from "./utils/helpers";
import { format } from "date-fns";
import { Storage } from "@google-cloud/storage";
import { NotificationService } from "src/notifications/services/notifications.service";
import { randomUUID } from "node:crypto";

@Injectable()
export class UserService {
  private readonly storage: Storage;
  private readonly bucketName = process.env.STORAGE_BUCKET;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly storageService: StorageService,
    private readonly notificationService: NotificationService
  ) {
    this.storage = new Storage(); // Refactor this, create Module.
  }

  private auth: Auth = getAuth();
  private readonly logger: Logger = new Logger(UserService.name);

  async getUser(firebaseUid: string) {
    this.logger.log(`[UserService.getUser] Getting user with Firebase UID: ${firebaseUid}`);

    try {
      const user = await this.prisma.user.findUnique({
        where: { firebase_uid: firebaseUid },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          full_name: true,
          email: true,
          role: true,
          photo_url: true,
          firebase_uid: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with Firebase UID ${firebaseUid} not found`);
      }

      return user;
    } catch (error) {
      this.logger.error(`[UserService.getUser] Error getting user - ${error}`);
      throw error;
    }
  }

  async createUserInAuth(email: string, role: Role, displayName: string, photoURL: string): Promise<string> {
    this.logger.log(`[UsersService.createUserInAuth] Creating user in Auth - Data: { email: ${email}, role: ${role} }`);

    try {
      const userRecord = await this.auth.createUser({
        email,
        password: "Pass1234",
        displayName,
        // photoURL,
      });

      // Add role in custom claims
      await this.auth.setCustomUserClaims(userRecord.uid, { role });

      // Add firebase UID to the user record in the database
      // await this.prisma.user.update({
      //   data: {
      //     user: {
      //       create: {
      //         full_name,
      //         email,
      //         role: createUserDto.role,
      //         photo_url: avatarUrl,
      //       },
      //     },
      //   },
      // });
      return userRecord.uid;
    } catch (error) {
      this.logger.error(`[UsersService.createUserInAuth] Error creating user in Auth - ${error}`);

      if (error.message) {
        throw new HttpException(error.message, 400);
      } else {
        throw new HttpException("Error creating user in Auth", 400);
      }
    }
  }

  // async syncUsersWithAuth(): Promise<void> {
  //   this.logger.log(`[syncUsersWithAuth] Starting user synchronization`);

  //   try {
  //     // Fetch all users from the database
  //     const users: User[] = await this.prisma.user.findMany();

  //     for (const user of users) {
  //       const photoUrl = user.photo_url || generateAvatarUrl();

  //       try {
  //         const userRecord = await this.auth.getUserByEmail(user.email);

  //         // Update Firebase Auth user record
  //         await this.auth.updateUser(userRecord.uid, {
  //           displayName: user.full_name,
  //           photoURL: photoUrl,
  //         });

  //         this.logger.log(`[syncUsersWithAuth] Updated user ${user.email} in Firebase Auth`);
  //       } catch (updateError) {
  //         this.logger.error(`[syncUsersWithAuth] Failed to update user ${user.email}: ${updateError.message}`);
  //       }
  //     }

  //     this.logger.log(`[syncUsersWithAuth] User synchronization completed`);
  //   } catch (error) {
  //     this.logger.error(`[syncUsersWithAuth] Error during synchronization: ${error.message}`);
  //     throw error;
  //   }
  // }

  /**
   * Creates a new user, which can be either an Admin or a Vendor.
   */
  async createUser(createUserDto: CreateUserDTO): Promise<void> {
    this.logger.log(`[UsersService.createUser] Creating user - Data: ${JSON.stringify(createUserDto)}`);

    const { email, role, full_name } = createUserDto;
    const avatarUrl = generateAvatarUrl();

    const [firstName, lastName] =
      full_name.trim().split(" ").length > 1 ? full_name.trim().split(" ") : [full_name.trim(), null];

    try {
      const firebaseUid = await this.createUserInAuth(email, role, full_name, avatarUrl);

      // Create user in Database
      // await this.prisma.user.create({
      //   data: {
      //     full_name: createUserDto.full_name,
      //     email: createUserDto.email,
      //     role: createUserDto.role,
      //   },
      // });

      await this.prisma.vendor.create({
        data: {
          user: {
            create: {
              full_name,
              firstName: firstName,
              lastName: lastName,
              email,
              role: createUserDto.role,
              photo_url: avatarUrl,
              firebase_uid: firebaseUid,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`[UsersService.createUser] Error creating user - ${error}`);

      if (error.message) {
        throw new HttpException(error.message, 400);
      } else {
        throw new HttpException("Error creating user", 400);
      }
    }
  }

  async createCreator(createCreatorDTO: CreateCreatorDTO): Promise<void> {
    this.logger.log(`[UsersService.createUser] Creating Creator - Data: ${JSON.stringify(createCreatorDTO)}`);

    // First check if username exists
    const existingCreator = await this.prisma.creator.findUnique({
      where: {
        username: createCreatorDTO.username,
      },
    });

    if (existingCreator) {
      throw new HttpException("A user with this username already exists.", HttpStatus.BAD_REQUEST);
    }

    const { email, language_ids, full_name } = createCreatorDTO;
    const avatarUrl = generateAvatarUrl();

    const [firstName, lastName] =
      full_name.trim().split(" ").length > 1 ? full_name.trim().split(" ") : [full_name.trim(), null];

    try {
      const firebaseUid = await this.createUserInAuth(email, Role.CREATOR, full_name, avatarUrl);

      // Create user in Database
      const creator = await this.prisma.creator.create({
        data: {
          user: {
            create: {
              full_name,
              firstName: firstName,
              lastName: lastName,
              email,
              role: Role.CREATOR,
              photo_url: avatarUrl,
              firebase_uid: firebaseUid,
            },
          },
          username: createCreatorDTO.username,
          youtube_channel_link: createCreatorDTO.youtube_channel_link,
          rate: 0,
        },
        select: {
          id: true,
        },
      });

      // Connect languages via CreatorLanguage join table
      await this.prisma.creatorLanguage.createMany({
        data: language_ids.map((languageId) => ({
          creator_id: creator.id,
          language_id: languageId,
        })),
      });

      // Create YouTube channels for the creator
      if (createCreatorDTO.channels && createCreatorDTO.channels.length > 0) {
        await this.prisma.youtubeChannel.createMany({
          data: createCreatorDTO.channels.map((channel) => ({
            channel_id: randomUUID(),
            title: channel.name,
            url: channel.link,
            creator_id: creator.id,
          })),
        });
      }

      // Initialize Storage folders
      const { root_folder_id } = await this.storageService.initializeCreatorFolders({ creatorId: email });

      await this.prisma.creator.update({
        where: {
          id: creator.id,
        },
        data: {
          root_folder_id: root_folder_id,
        },
      });

      // Initialize Discord channels
      await this.notificationService.initializeCreatorDiscordChannels(creator.id, createCreatorDTO.username);
    } catch (error) {
      this.logger.error(`[UsersService.createUser] Error creating user - ${error}`);

      if (error.message) {
        throw new HttpException(error.message, 400);
      } else {
        throw new HttpException("Error creating user", 400);
      }
    }
  }

  async createAssistant(managerId: number, createAssistantDTO: CreateAssistantDTO): Promise<void> {
    this.logger.log(
      `[UsersService.createAssistant] Creating Assistant from manager ${managerId} - Data: ${JSON.stringify(
        createAssistantDTO
      )}`
    );

    const { firstName, lastName, email, role } = createAssistantDTO;
    const fullName = `${firstName} ${lastName}`;

    try {
      const firebaseUid = await this.createUserInAuth(email, role, fullName, null);

      await this.prisma.user.create({
        data: {
          firebase_uid: firebaseUid,
          firstName,
          lastName,
          full_name: fullName,
          email,
          role,
          assistant: {
            create: {
              managerId: managerId,
            },
          },
        },
      });

      // Send <email> to assistant
    } catch (error) {
      this.logger.error(`[UsersService.createUser] Error creating user - ${error}`);

      if (error.message) {
        throw new HttpException(error.message, 400);
      } else {
        throw new HttpException("Error creating user", 400);
      }
    }
  }

  async deleteUser(userId: number): Promise<void> {
    this.logger.log(`[UsersService.deleteUser] Deleting User - ID: ${userId}`);

    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          firebase_uid: true,
        },
      });

      // Use transaction to ensure all operations succeed or none do
      await this.prisma.$transaction(async (prisma) => {
        // Delete user from Database
        await prisma.user.delete({
          where: { id: userId },
        });

        // Delete user from Firebase Auth
        await this.auth.deleteUser(user.firebase_uid);
      });
    } catch (error) {
      this.logger.error(`[UsersService.deleteUser] Error deleting User - ${error}`);
      throw new HttpException(error.message, 400);
    }
  }

  async createStaff(createStaffDTO: CreateStaffDTO): Promise<void> {
    this.logger.log(`[UsersService.createUser] Creating Staff - Data: ${JSON.stringify(createStaffDTO)}`);

    const { email, full_name } = createStaffDTO;
    const avatarUrl = generateAvatarUrl();

    const [firstName, lastName] =
      full_name.trim().split(" ").length > 1 ? full_name.trim().split(" ") : [full_name.trim(), null];

    try {
      const firebaseUid = await this.createUserInAuth(email, Role.STAFF, full_name, avatarUrl);

      // Create user in Database
      await this.prisma.staff.create({
        data: {
          user: {
            create: {
              full_name,
              firstName: firstName,
              lastName: lastName,
              email,
              role: Role.STAFF,
              photo_url: avatarUrl,
              firebase_uid: firebaseUid,
            },
          },
          staff_type: createStaffDTO.staff_type,
          rate: 0,
          language: {
            connect: { id: createStaffDTO.language_id },
          },
          // defaultCreator: {
          //   connect: { id: createStaffDTO.default_creator_id },
          // },
        },
      });
    } catch (error) {
      this.logger.error(`[UsersService.createUser] Error creating user - ${error}`);

      if (error.message) {
        throw new HttpException(error.message, 400);
      } else {
        throw new HttpException("Error creating user", 400);
      }
    }
  }

  async getUserProfile(userId: string): Promise<UserProfileDTO> {
    this.logger.log(`Getting profile for user ${userId}`);

    try {
      // Get user with Firebase UID
      const user = await this.prisma.user.findUnique({
        where: { email: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          full_name: true,
          email: true,
          role: true,
          photo_url: true,
          staff: {
            select: {
              id: true,
              staff_type: true,

            }
          }
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const userProfileDTO: UserProfileDTO = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        full_name: user.full_name,
        email: user.email,
        role: user.role as Role,
        photo_url: user.photo_url,
        staffType: user.staff?.staff_type as StaffType,
      };

      return userProfileDTO;
    } catch (error) {
      this.logger.error(`Failed to get profile for user ${userId}:`, error);
      throw error;
    }
  }

  async updateProfile(userId: string, dto: UpdateUserDTO): Promise<void> {
    this.logger.log(`Updating profile for user ${userId}`);

    try {
      // Start transaction to ensure consistency
      const result = await this.prisma.$transaction(async (prisma) => {
        // Get user with Firebase UID
        const user = await prisma.user.findUnique({
          where: { email: userId },
          select: { firebase_uid: true },
        });

        if (!user?.firebase_uid) {
          throw new Error("User not found or no Firebase UID");
        }

        // Update Firebase Auth
        await this.auth.updateUser(user.firebase_uid, {
          displayName: `${dto.firstName} ${dto.lastName}`.trim(),
        });

        // Update database
        return prisma.user.update({
          where: { email: userId },
          data: {
            firstName: dto.firstName,
            lastName: dto.lastName,
            full_name: `${dto.firstName} ${dto.lastName}`.trim(),
          },
        });
      });
    } catch (error) {
      this.logger.error(`Failed to update profile for user ${userId}:`, error);
      throw error;
    }
  }

  async updateProfileImage(userId: string, file: Express.Multer.File): Promise<UpdateUserImageDTO> {
    this.logger.log(`Updating profile image for user ${userId}`);

    try {
      // Get user
      const user = await this.prisma.user.findUnique({
        where: { email: userId },
        select: {
          firebase_uid: true,
          photo_url: true,
        },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Generate unique file path
      const timestamp = format(new Date(), "yyyyMMdd-HHmmss");
      const extension = file.originalname.split(".").pop();
      const filename = `${timestamp}.${extension}`;
      const filePath = `users/avatars/${userId}/${filename}`;

      // Upload to GCS
      const bucket = this.storage.bucket(this.bucketName);
      const gcsFile = bucket.file(filePath);

      await gcsFile.save(file.buffer, {
        contentType: file.mimetype,
        metadata: {
          contentType: file.mimetype,
          metadata: {
            originalname: file.originalname,
            userId,
          },
        },
      });

      // Make file public and get URL
      await gcsFile.makePublic();
      const imageUrl = `https://storage.googleapis.com/${this.bucketName}/${filePath}`;

      // If there's an existing image, delete it
      if (user.photo_url) {
        try {
          const oldFilePath = new URL(user.photo_url).pathname.slice(1);
          const oldFile = bucket.file(oldFilePath.split("/").slice(1).join("/"));
          await oldFile.delete().catch(() => { });
        } catch (error) {
          this.logger.warn(`Failed to delete old profile image for user ${userId}:`, error);
        }
      }

      // Update both Firebase and database
      await this.prisma.$transaction(async (prisma) => {
        // Update Firebase Auth
        if (user.firebase_uid) {
          await this.auth.updateUser(user.firebase_uid, {
            photoURL: imageUrl,
          });
        }

        // Update database
        await prisma.user.update({
          where: { email: userId },
          data: { photo_url: imageUrl },
        });
      });

      return { imageUrl };
    } catch (error) {
      this.logger.error(`Failed to update profile image for user ${userId}:`, error);
      throw error;
    }
  }

  async removeProfileImage(userId: string): Promise<void> {
    this.logger.log(`Removing profile image for user ${userId}`);

    try {
      const user = await this.prisma.user.findUnique({
        where: { email: userId },
        select: {
          firebase_uid: true,
          photo_url: true,
        },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      if (user.photo_url) {
        // Delete from GCS
        if (!user.photo_url.startsWith("https://robohash.org")) {
          // This is temporary, we will remove these robhash on register.
          const bucket = this.storage.bucket(this.bucketName);
          const filePath = new URL(user.photo_url).pathname.slice(1);
          const file = bucket.file(filePath.split("/").slice(1).join("/"));
          await file.delete().catch(() => { });
        }

        // Update both Firebase and database
        await this.prisma.$transaction(async (prisma) => {
          // Update Firebase Auth
          if (user.firebase_uid) {
            await this.auth.updateUser(user.firebase_uid, {
              photoURL: null,
            });
          }

          // Update database
          await prisma.user.update({
            where: { email: userId },
            data: { photo_url: null },
          });
        });
      }
    } catch (error) {
      this.logger.error(`Failed to remove profile image for user ${userId}:`, error);
      throw error;
    }
  }

  async getAssistants(managerId: number): Promise<AssistantDTO[]> {
    this.logger.log(`Getting assistants for manager ${managerId}`);

    try {
      const assistants = await this.prisma.assistant.findMany({
        where: {
          managerId: managerId,
        },
        select: {
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
        },
      });

      const assistantsDTOs: AssistantDTO[] = assistants.map((assistant) => ({
        id: assistant.user.id,
        displayName: assistant.user.full_name,
        email: assistant.user.email,
        totalPermissions: 15,
        assistantPermissionsCount: 15,
      }));

      return assistantsDTOs;
    } catch (error) {
      this.logger.error(`Failed to get assistants for manager ${managerId}:`, error);
      throw error;
    }
  }
}
