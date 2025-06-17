import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { CommonService } from "./common.service";
import { LanguageDTO } from "hvo-shared";

@Controller("common")
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get("/languages")
  async getAllLanguages(): Promise<LanguageDTO[]> {
    return this.commonService.getAllLanguages();
  }

  // @Get("/init-users")
  // async initUsers(): Promise<void> {
  //   return this.commonService.populateFirebaseUIDs();
  // }
}
