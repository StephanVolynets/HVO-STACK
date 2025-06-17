import express from "express";
import routes from "./routes";
import logger from "./utils/logger";
import config from "./config";

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    body: req.method !== "GET" ? req.body : undefined,
  });
  next();
});

// Routes
app.use(routes);

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Unhandled error", { error: err.message, stack: err.stack });
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
const port = config.port;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

// Handle unhandled rejections and exceptions
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", { promise, reason });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", { error });
  // Give the logger time to flush, then exit
  setTimeout(() => process.exit(1), 1000);
});
