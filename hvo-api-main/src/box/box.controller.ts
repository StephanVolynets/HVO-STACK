import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common";
import { BoxService } from "./box.service";
import { BoxInitializerService } from "./box-initializer.service";

@Controller("box")
export class BoxController {
  constructor(private readonly boxService: BoxService, private readonly boxInitializer: BoxInitializerService) {}

  // @Post()
  // create(@Body() createBoxDto: any) {
  //   return this.boxService.create(createBoxDto);
  // }

  @Get("/create-folder")
  createFolder(@Query("parentId") parentId: string, @Query("name") name: string) {
    return this.boxService.testCreateFolder(parentId, name);
  }

  @Get("/move-folder")
  test(@Query("parentId") parentId: string, @Query("name") name: string) {
    return this.boxService.testMoveFolder(parentId, name);
  }

  @Get("/get-files")
  getFiles(@Query("parentId") parentId: string) {
    return this.boxService.testGetFiles(parentId);
  }

  @Get("/test-initialize-creator")
  testInitializeCreator(@Query("creatorName") creatorName: string) {
    return this.boxInitializer.initializeCreatorFolders(creatorName);
  }

  @Get("/test-initialize-video")
  testInitializeVideo(@Query("creatorFolderId") creatorFolderId: string) {
    return this.boxInitializer.initializeVideoFolders(creatorFolderId, "Cooking a dog", ["English", "Spanish"]);
  }

  // @Get()
  // findAll() {
  //   return this.boxService.findAll();
  // }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.boxService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateBoxDto: any) {
  //   return this.boxService.update(+id, updateBoxDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.boxService.remove(+id);
  // }
}
