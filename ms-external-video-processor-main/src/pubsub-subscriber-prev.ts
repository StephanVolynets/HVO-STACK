import { PubSub } from "@google-cloud/pubsub";
import { handleMessage } from "./message-handler";
// import { handleMessage } from "./messageHandler";

const pubSubClient = new PubSub();
const subscriptionName = "process-external-videos";

export const startSubscription = () => {
  const subscription = pubSubClient.subscription(subscriptionName);

  subscription.on("message", async (message) => {
    try {
      const data = JSON.parse(Buffer.from(message.data, "base64").toString());
      console.log(`Received message: ${JSON.stringify(data)}`);
      await handleMessage(data);
      message.ack();
    } catch (error) {
      console.error("Failed to process message:", error);
      message.nack();
    }
  });

  subscription.on("error", (error) => {
    console.error("Subscription error:", error);
  });
};
