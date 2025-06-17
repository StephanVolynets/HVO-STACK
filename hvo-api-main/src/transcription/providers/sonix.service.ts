import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import FormData from "form-data";
import { Readable } from "stream";

@Injectable()
export class SonixService {
  private readonly apiKey: string;
  private readonly apiUrl: string = "https://api.sonix.ai/v1";

  private readonly logger: Logger = new Logger(SonixService.name);
  constructor() {
    this.apiKey = process.env.SONIX_API_KEY;
  }

  async uploadMedia(fileStream: Readable, fileName: string): Promise<string> {
    this.logger.log(`Uploading media: ${fileName}`);

    const formData = new FormData();
    formData.append("file", fileStream, { filename: fileName });
    formData.append("language", "en");
    formData.append("name", fileName);

    const response = await axios.post(`${this.apiUrl}/media`, formData, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        ...formData.getHeaders(),
      },
    });

    this.logger.log(`Media uploaded: ${fileName} -> ${JSON.stringify(response.data)}`);

    return response.data.id;
  }

  async checkTranscriptionStatus(mediaId: string): Promise<any> {
    // this.logger.log(`Checking transcription status for media: ${mediaId}`);

    const response = await axios.get(`${this.apiUrl}/media/${mediaId}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
    this.logger.log(`Transcription status check (${mediaId}) - status: ${response.data.status}`);

    return response.data;
  }

  // async getTranscription(mediaId: string, format: "srt" | "txt" = "srt"): Promise<string> {
  //   this.logger.log(`Getting transcription for media: ${mediaId}`);

  //   const checkInterval = 2000; // 2 seconds
  //   const maxAttempts = 10; // Poll up to 10 times for captions

  //   // Wait briefly before trying to fetch captions
  //   await new Promise((resolve) => setTimeout(resolve, checkInterval));

  //   // Poll for captions availability
  //   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  //     try {
  //       const captionsResponse = await axios.get(`${this.apiUrl}/media/${mediaId}/transcript.srt`, {
  //         headers: { Authorization: `Bearer ${this.apiKey}` },
  //         params: { output_format: "srt" },
  //       });
  //       return captionsResponse.data; // Return or process captions as needed
  //     } catch (error) {
  //       if (error.response && error.response.status === 404) {
  //         this.logger.log(`Attempt ${attempt}: Captions not ready, retrying...`);
  //         await new Promise((resolve) => setTimeout(resolve, checkInterval));
  //       } else {
  //         throw error; // Throw if error is not 404
  //       }
  //     }
  //   }

  //   // return response.data;
  // }
  /**
   * Retrieves the transcription for a given media ID in the specified format.
   * 
   * @param mediaId - The unique identifier of the media file in Sonix
   * @param format - The desired format of the transcription, either 'srt' or 'txt' (defaults to 'srt')
   * @returns A Promise that resolves to the transcription text (returns string)
   * @throws {Error} If the transcription is not found (404) or other API errors occur
   * 
   * @example
   * ```typescript
   * const transcription = await sonixService.getTranscription('abc123', 'srt');
   * ```
   */

  async getTranscription(mediaId: string, format: "srt" | "txt" = "srt"): Promise<string> {
    this.logger.log(`Getting transcription for media: ${mediaId}`);

    try {
      const captionsResponse = await axios.get(`${this.apiUrl}/media/${mediaId}/transcript.${format}`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
        // params: { output_format: format },
      });

      return captionsResponse.data;
    } catch (error) {
      this.logger.error(`Failed to get transcription for media ${mediaId}:`, error);

      if (error.response?.status === 404) {
        throw new Error(`Transcription not found for media ID: ${mediaId}`);
      }

      throw error;
    }
  }
}
