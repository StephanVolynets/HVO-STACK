import { streamFromGoogleDriveToSignedUrl } from "./services/google-drive";
import { streamFromYouTubeToSignedUrl } from "./services/youtube";

export const handleMessage = async (data: any): Promise<void> => {
  const { video_file_id, soundtrack_file_id, uploadUrls } = data;
  if (!uploadUrls) throw new Error("No signed URLs provided");

  try {
    // Process video file
    if (video_file_id?.startsWith("http")) {
      if (video_file_id.includes("youtube.com") || video_file_id.includes("youtu.be")) {
        await streamFromYouTubeToSignedUrl(video_file_id, uploadUrls.video);
      } else if (video_file_id.includes("drive.google.com")) {
        await streamFromGoogleDriveToSignedUrl(video_file_id, uploadUrls.video);
      }
    }

    // Process soundtrack file
    if (soundtrack_file_id?.startsWith("http")) {
      if (soundtrack_file_id.includes("drive.google.com")) {
        await streamFromGoogleDriveToSignedUrl(soundtrack_file_id, uploadUrls.meAudio);
      } else {
        throw new Error("Unsupported soundtrack URL format");
      }
    }
  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
};
