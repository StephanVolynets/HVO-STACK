import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DefaultAuthGuard } from "src/auth/auth.guard";
import { Locked } from "src/decorators/locked.decorator";
import { Public } from "src/decorators/public.decorator";
import { UserGuard } from "./user.guard";
import { UserService } from "./user.service";
import { CreateAssistantDTO, CreateCreatorDTO, CreateStaffDTO, CreateUserDTO, UpdateUserDTO } from "hvo-shared";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("users")
@Controller("users")
// @UseGuards(DefaultAuthGuard, UserGuard)
@UseGuards( UserGuard)
export class UserController {
  constructor(protected readonly service: UserService) { }

  @Public()
  // @Locked()
  @Post()
  /**
   * Creates a new user, which can be either an Admin or a Vendor.
   */
  async createUser(@Body() createUserDto: CreateUserDTO): Promise<void> {
    await this.service.createUser(createUserDto);
  }

  @Delete(":userId")
  async deleteAssistant(@Param("userId") userId: string) {
    // First verify the assistant belongs to this user
    // await this.userService.verifyAssistantOwnership(currentUser.id, parseInt(assistantId));

    return await this.service.deleteUser(+userId);

    // Todo:
    // Create 2 methods: deleteUser and deleteAssistant
    // 1. deleteUser will check authroization header and delete the user if it is the same user or its admin
    // 2. deleteAssistant will check if the assistant belongs to the user and delete it
  }

  @Public()
  // @Locked()
  @Post("/creator")
  /**
   * Creates a new Creator.
   */
  async createCreator(@Body() createCreator: CreateCreatorDTO): Promise<void> {
    await this.service.createCreator(createCreator);
  }

  @Public()
  // @Locked()
  @Post("/staff")
  /**
   * Creates a new Creator.
   */
  async createStaff(@Body() createStaff: CreateStaffDTO): Promise<void> {
    await this.service.createStaff(createStaff);
  }

  @Get("/:userId/profile")
  async getUserProfile(@Param("userId") userId: string) {
    return this.service.getUserProfile(userId);
  }

  @Post("/:userId/update-profile")
  async updateProfile(@Param("userId") userId: string, @Body() dto: UpdateUserDTO) {
    return this.service.updateProfile(userId, dto);
  }

  @Post(":userId/profile-image")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 4 * 1024 * 1024, // 8MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
          callback(new BadRequestException("File must be JPEG, PNG, or WebP"), false);
          return;
        }
        callback(null, true);
      },
    })
  )
  async uploadProfileImage(@Param("userId") userId: string, @UploadedFile() file: Express.Multer.File) {
    return this.service.updateProfileImage(userId, file);
  }

  @Post(":userId/remove-profile-image")
  async removeProfileImage(@Param("userId") userId: string) {
    return this.service.removeProfileImage(userId);
  }

  // @Public()
  @Post("/:managerId/create-assistant")
  async createAssistant(
    @Param("managerId") managerId: string,
    @Body() createAssistant: CreateAssistantDTO
  ): Promise<void> {
    return await this.service.createAssistant(+managerId, createAssistant);
  }

  @Get("/:managerId/assistants")
  async getAllAssistants(@Param("managerId") managerId: string) {
    return await this.service.getAssistants(+managerId);
  }

  // @Public()
  // // @Locked()
  // @Post()
  // /**
  //  * Creates a new Creator.
  //  */
  // async createStaff(@Body() createStaff: CreateStaffDTO): Promise<void> {
  //   await this.service.createStaff(createStaff);
  // }

  // @Get("/list")
  // async getUsers(
  //   @Query("page", ParseIntPipe) page: number = 1,
  //   @Query("limit", ParseIntPipe) limit: number = 24,
  //   @Query("verificationStatus") verificationStatus?: string
  // ) {
  //   // return await this.service.getUsers(page, limit, verificationStatus);
  // }

  // @Get("/:id")
  // async getUser(@Param("id") id: string): Promise<User> {
  //   // return await this.service.getUser(id);
  // }

  // @Public()
  // @Locked()
  // @Get("/public/:id")
  // async getPublicUser(@Param("id") id: string): Promise<User> {
  //   // return await this.service.getPublicUser(id);
  // }
}
