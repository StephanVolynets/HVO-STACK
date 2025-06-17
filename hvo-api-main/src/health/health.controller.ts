import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { Public } from "src/decorators/public.decorator";
import { HealthService } from "./health.service";
// import { FirestoreService } from "src/firestore/firestore.service";

@Public()
@ApiTags("_health")
@Controller("_health")
export class HealthController {
  constructor(protected readonly healthService: HealthService) // , private firestore: FirestoreService
  {}

  @Public()
  @Get("live")
  healthLive(@Res() response: Response): Response<void> {
    return response.status(HttpStatus.NO_CONTENT).send();
  }

  @Public()
  @Get("ready")
  async healthReady(@Res() response: Response): Promise<Response<void>> {
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
