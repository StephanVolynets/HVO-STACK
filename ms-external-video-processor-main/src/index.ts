import express from "express";
import { handleMessage } from "./message-handler"; // Reuse your existing logic

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Endpoint for Pub/Sub push notifications
app.post("/process", async (req, res) => {
  try {
    const pubsubMessage = req.body.message;

    // Decode the Pub/Sub message
    // const data = JSON.parse(Buffer.from(pubsubMessage.data, "base64").toString());
    console.log(req.body);
    const data = req.body; //JSON.parse(req.body);
    console.log(`Received message: ${JSON.stringify(data)}`);

    // Handle the message (download files and process them)
    await handleMessage(data);

    // Acknowledge the message
    res.status(204).send();
  } catch (error) {
    console.error("Failed to process message:", error);
    res.status(500).send();
  }
});

// Start the Express server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`[External Video Processor] Starting microservice on port: ${PORT}.`);
});
