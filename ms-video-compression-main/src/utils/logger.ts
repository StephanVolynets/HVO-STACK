import winston from "winston";
import config from "../config";

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level based on environment
const level = () => {
  return config.nodeEnv === "development" ? "debug" : "info";
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

// Add colors to winston
winston.addColors(colors);

// Define the format
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console(),

  // File transport for errors
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),

  // File transport for all logs
  new winston.transports.File({ filename: "logs/all.log" }),
];

// Create the logger
const logger = winston.createLogger({
  level: config.nodeEnv === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf((info) => {
      // Ensure metadata is properly stringified
      const metadata = info.metadata || info[Symbol.for("splat")] || [];
      const metadataStr = Array.isArray(metadata) && metadata.length ? JSON.stringify(metadata[0]) : "";
      return `${info.timestamp} ${info.level}: ${info.message} ${metadataStr}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export default {
  info: (message: string, meta?: any) => logger.info(message, { meta }),
  error: (message: string, meta?: any) => logger.error(message, { meta }),
  warn: (message: string, meta?: any) => logger.warn(message, { meta }),
  debug: (message: string, meta?: any) => logger.debug(message, { meta }),
};
