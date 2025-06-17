import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from "@nestjs/common";
import { CreatorService } from "./creator.service";
import { CreatorAddLanguageDTO, CreatorBasicDTO } from "hvo-shared";

@Controller("creators")
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  // Admin Guard
  @Get("/summaries")
  findAll(@Query("page") page: number = 1, @Query("limit") limit: number = 10) {
    return this.creatorService.findAll(+page, +limit);
  }

  // Admin Guard
  @Get("/count")
  countAllCreators() {
    return this.creatorService.countAllCreators();
  }

  // Admin Guard
  // Vendor Guard
  @Get("/all-basic")
  getAllCreatorsBasic(): Promise<CreatorBasicDTO[]> {
    return this.creatorService.getAllBasicCreators();
  }

  // Admin Guard
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.creatorService.findOne(+id);
  }

  // Creator Guard
  @Get("/stats/:id")
  getCreatorStats(@Param("id") id: string) {
    return this.creatorService.getCreatorStats(id);
  }

  @Get("/:id/languages")
  getCreatorLanguages(@Param("id") id: string) {
    return this.creatorService.getCreatorLanguages(id);
  }

  @Post("/add-language")
  addCreatorLanguage(@Body() creatorAddLanguageDTO: CreatorAddLanguageDTO) {
    return this.creatorService.addCreatorLanguage(creatorAddLanguageDTO);
  }

  // Admin Guard
  // @Post("/update-video-counts")
  // updateAllCreatorsVideoCounts() {
  //   return this.creatorService.updateAllCreatorsVideoCounts();
  // }

  // Creator Guard
  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateCreatorDto: UpdateCreatorDto) {
  //   return this.creatorService.update(+id, updateCreatorDto);
  // }

  // Admin Guard
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.creatorService.remove(+id);
  }

  @Get("/assistant/:userId/manager-name")
  getAssistantManagerName(@Param("userId") userId: string) {
    return this.creatorService.getAssistantManagerName(+userId);
  }

  
}
