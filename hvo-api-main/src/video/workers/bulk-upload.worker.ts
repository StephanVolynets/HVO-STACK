import { parentPort, workerData } from "worker_threads";
import { AddVideoDTO, FormType } from "hvo-shared";

interface WorkerData {
  row: {
    creatorId: string;
    title: string;
    description: string;
    videoUrl: string;
    soundtrackUrl: string;
    formType?: FormType;
    expectedBy?: string;
    channelId?: string;
  };
  channel?: {
    id: string;
    title: string;
  };
  sessionId: string;
}

async function processVideo(data: WorkerData) {
  try {
    const { row, channel, sessionId } = data;

    const addVideoDTO: AddVideoDTO = {
      title: row.title,
      description: row.description,
      video_file_id: row.videoUrl,
      soundtrack_file_id: row.soundtrackUrl,
      form_type: (row.formType || "LONG") as FormType,
      expected_by: row.expectedBy ? new Date(row.expectedBy) : undefined,
      youtubeChannelId: channel?.id ? parseInt(channel.id, 10) : undefined,
      session_id: sessionId,
    };

    // Send the result back to the main thread
    parentPort?.postMessage({ success: true, data: addVideoDTO });
  } catch (error) {
    parentPort?.postMessage({ success: false, error: error.message });
  }
}

// Start processing when worker receives data
processVideo(workerData);
