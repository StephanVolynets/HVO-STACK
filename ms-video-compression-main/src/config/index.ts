import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const config = {
  // Server configuration
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || "development",

  // Google Cloud configuration
  projectId: process.env.PROJECT_ID || "",
  region: process.env.GCP_REGION || "us-central1",
  bucketName: process.env.GCS_BUCKET || "",

  // Pub/Sub topics
  videoTranscodingRequestsTopic: process.env.PUBSUB_VIDEO_TRANSCODING_REQUESTS_TOPIC || "video-transcoding-requests",
  videoTranscodingCompletionsTopic:
    process.env.PUBSUB_VIDEO_TRANSCODING_COMPLETIONS_TOPIC || "video-transcoding-completions",
  boxToGcsTopic: process.env.PUBSUB_BOX_TO_GCS_TOPIC || "box-to-gcs",

  driveToGcsCompletionsTopic: process.env.PUBSUB_GDRIVE_TO_GCS_COMPLETIONS_TOPIC || "gdrive-to-gcs-completions",

  // Box API configuration
  box: {
    clientId: process.env.BOX_CLIENT_ID || "",
    clientSecret: process.env.BOX_CLIENT_SECRET || "",
    enterpriseId: process.env.BOX_ENTERPRISE_ID || "",
    jwtKeyId: process.env.BOX_JWT_KEY_ID || "",
    privateKey: process.env.BOX_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
    passphrase: process.env.BOX_PASSPHRASE || "",
  },

  // API configuration
  api: {
    url: process.env.API_ENDPOINT,
    // token: process.env.API_TOKEN || "",
  },

  // Sonix API configuration
  sonix: {
    apiKey: process.env.SONIX_API_KEY || "",
    apiUrl: process.env.SONIX_API_URL || "https://api.sonix.ai/v1",
  },
};

// Validate required configuration
const validateConfig = () => {
  const requiredVars = ["projectId", "bucketName", "box.clientId", "box.clientSecret", "sonix.apiKey"];

  const missingVars = requiredVars.filter((path) => {
    const keys = path.split(".");
    let current: any = config;

    for (const key of keys) {
      current = current[key];
      if (!current) return true;
    }

    return false;
  });

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
  }
};

// Only validate in production to make development easier
if (config.nodeEnv === "production") {
  validateConfig();
}

export default config;
