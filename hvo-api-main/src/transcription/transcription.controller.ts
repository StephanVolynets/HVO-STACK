import { Body, Controller, Get, Header, Headers, Param, Post, Query, Req, UnauthorizedException } from "@nestjs/common";
import { TranscriptionService } from "./transcription.service";
import { createHmac } from "crypto";

@Controller("transcription")
export class TranscriptionController {
  constructor(private readonly transcriptionService: TranscriptionService) {}

  @Post("/uploaded-to-sonix/:videoId")
  uploadedToSonix(@Param("videoId") videoId: string, @Body() payload: { mediaId: string }) {
    return this.transcriptionService.uploadedToSonix(+videoId, payload);
  }

  @Get("/check-transcription-status")
  generateFolderUrl(
    @Query("videoId") videoId: string,
    @Query("mediaId") mediaId: string,
    @Query("rawScriptFolderId") rawScriptFolderId: string,
    @Query("fileName") fileName: string
  ) {
    return this.transcriptionService.startTranscriptionProcess(+videoId, mediaId, rawScriptFolderId, fileName);
  }

  @Post("/webhook")
  @Header("Content-Type", "application/json")
  async handleSonixWebhook(
    @Headers("X-Webhook-Signature") signature: string,
    @Body() payload: any,
    @Req() request: Request
  ) {
    // Verify the webhook signature
    const isValid = this.transcriptionService.verifyWebhookSignature(signature, payload.toString());

    // if (!isValid) {
    //   throw new UnauthorizedException("Invalid webhook signature");
    // }

    // Handle the webhook event
    return this.transcriptionService.handleWebhookEvent(payload);
  }
}
