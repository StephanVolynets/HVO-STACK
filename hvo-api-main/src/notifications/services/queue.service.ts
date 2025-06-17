import { Injectable } from "@nestjs/common";
import { NotificationPayload } from "../interfaces/notifications.intefaces";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";

@Injectable()
export class QueueService {
  constructor(@InjectQueue("notifications") private readonly queue: Queue) {}

  async addToQueue(jobName: string, jobData: any): Promise<void> {
    await this.queue.add(jobName, jobData);
  }

  //   async processQueue() {
  //     this.queue.process("email", async (job) => {
  //       await this.emailProvider.send(job.data);
  //     });

  //     this.queue.process("discord", async (job) => {
  //       await this.discordProvider.send(job.data);
  //     });
  //   }
}
