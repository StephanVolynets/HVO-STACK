import { Process, Processor } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { Job } from "bull";
import { EmailProvider } from "../providers/email.provider";
import { DiscordProvider } from "../providers/discord.provider";
import axios from "axios";

@Processor("notifications")
@Injectable()
export class NotificationsProcessor {
  private readonly logger: Logger = new Logger(NotificationsProcessor.name);
  private readonly clientUrl = process.env.CLIENT_URL;

  constructor(private readonly emailProvider: EmailProvider, private readonly discordProvider: DiscordProvider) {}

  // @Process("email")
  // async handleEmailJob(job: Job) {
  //   const { to, subject, text } = job.data;
  //   await this.emailProvider.sendEmail(to, subject, text);
  // }

  @Process("email")
  async handleEmailJob(job: Job) {
    const { name, props } = job.data;

    // Fetch the template dynamically from the web app
    const html = await this.fetchTemplate(name, props);

    // Send the email
    // await this.emailProvider.sendEmail(props.to, props.subject, html);

    // Log success
    console.log(`[NotificationsProcessor] Email sent for template: ${name}`, props);
  }

  @Process("discord")
  async handleDiscordJob(job: Job) {
    const { channelId, message } = job.data;
    await this.discordProvider.sendMessageDeprecated(channelId, message, 55);
  }

  //  ---- Utils -----
  private async fetchTemplate(templateName: string, props: Record<string, any>): Promise<string> {
    try {
      const response = await axios.get(`${this.clientUrl}`, {
        params: {
          template: templateName,
          ...props,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`[NotificationsProcessor] Error fetching template: ${templateName}`, error.message);
      throw error;
    }
  }
}
