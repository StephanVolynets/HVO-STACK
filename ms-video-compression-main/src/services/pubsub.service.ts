import { PubSub } from "@google-cloud/pubsub";
import config from "../config";

// Create a singleton instance of PubSub client
const pubsubClient = new PubSub({ projectId: config.projectId });

export default pubsubClient;
