import { Router } from "express";
import * as transcodingRequestHandler from "../handlers/transcoding-request.handler";
import * as transcodingCompletionHandler from "../handlers/transcoding-completion.handler";
import * as boxToGcsHandler from "../handlers/box-to-gcs.handler";
import * as videoResourceTransferHandler from "../handlers/video-resource-transfer.handler";

const router = Router();

// Pub/Sub endpoints for the 3 topics
router.post("/api/video/transcode", transcodingRequestHandler.handleMessage);
router.post("/api/video/process-transcoded", transcodingCompletionHandler.handleMessage);
router.post("/api/box/mirror-to-gcs", boxToGcsHandler.handleMessage);

// Endpoint for Google Drive to GCS transfers
router.post("/api/video/transfer-external-resource", videoResourceTransferHandler.handleMessage);

export default router;
