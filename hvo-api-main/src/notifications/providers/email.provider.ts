import * as nodemailer from "nodemailer";
import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { NOTIFICATION_NAME, NotificationName } from "../constants";

@Injectable()
export class EmailProvider {
  private logger: Logger = new Logger("EmailProcessor");

  private transporter: nodemailer.Transporter;
  private email = process.env.EMAIL_USER;
  private pass = process.env.EMAIL_PASS;

  private clientUrl = process.env.CLIENT_URL;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: this.email, pass: this.pass },
    });
  }

  private async fetchTemplate(templateName: NotificationName, props: Record<string, any>): Promise<string> {
    try {
      const response = await axios.get(`${this.clientUrl}/api/email`, {
        params: {
          template: templateName,
          ...props,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`[NotificationService] Error fetching template: ${templateName}`, error.message);
      throw error;
    }
  }

  public async sendEmail(name: NotificationName, props: Record<string, any>): Promise<void> {
    const html = await this.fetchTemplate(name, props);
    const subject = NOTIFICATION_NAME[name];

    const mailOptions = {
      from: this.email,
      to: props.to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to: ${props.to}`);
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`);
      // TODO: Retry logic (Improvement)
    }
  }
}

// async sendEmail(to: string, subject: string, html: string): Promise<void> {
//   const mailOptions = {
//     from: this.email,
//     to,
//     subject,
//     html,
//   };

//   try {
//     await this.transporter.sendMail(mailOptions);
//     this.logger.log(`Email sent to: ${to}`);
//   } catch (error) {
//     this.logger.error(`Error sending email: ${error.message}`);
//     // TODO: Retry logic (Improvement)
//   }
// }
