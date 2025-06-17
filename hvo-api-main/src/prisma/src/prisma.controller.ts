import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Controller("prisma")
export class PrismaController {
  constructor(protected readonly prisma: PrismaService) {}

  @Get("/user/:id")
  getUser(@Param("id") id: string) {
    return "Got user with id: " + id;
    // return this.prisma.user.findUnique({ where: { id } });
  }
}
