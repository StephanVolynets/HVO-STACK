import { Injectable } from "@nestjs/common";
import { PubSub, Topic } from "@google-cloud/pubsub";

@Injectable()
export class PubSubService {
  private readonly pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub({ projectId: process.env.GCP_PROJECT_ID });
  }

  async publishMessage(topicName: string, data: object, attributes?: { [key: string]: string }): Promise<string> {
    try {
      // Convert the JSON object to a string and then to a buffer
      const dataBuffer = Buffer.from(JSON.stringify(data));

      // Retrieve the topic; this does not perform any network request
      const topic: Topic = this.pubSub.topic(topicName);

      // Prepare the message payload
      const message = {
        data: dataBuffer,
        attributes: attributes || {}, // Optional attributes
      };

      // Publish the message using publishMessage
      const [messageId] = await topic.publishMessage(message);

      console.log(`Message ${messageId} published to topic ${topicName}`);
      return messageId;
    } catch (error) {
      console.error("Error publishing message:", error);
      throw error;
    }
  }
}
