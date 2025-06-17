import { google } from "googleapis";
import axios from "axios";

const drive = google.drive("v3");
const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
google.options({ auth });

export const streamFromGoogleDriveToSignedUrl = async (driveUrl: string, signedUrl: string): Promise<void> => {
  const fileId = extractGoogleDriveFileId(driveUrl);
  if (!fileId) {
    throw new Error("Invalid Google Drive URL");
  }

  const directDownloadUrl = convertToDirectDownloadUrl(fileId);

  try {
    console.log(`Streaming file from Google Drive: ${directDownloadUrl} -> ${signedUrl}`);

    await streamToBucket(directDownloadUrl, signedUrl);

    // Request the file from Google Drive
    console.log("Downloading file from Google Drive...");
    const response = await axios.get(directDownloadUrl);

    // Stream the file to the signed GCS URL
    await new Promise<void>((resolve, reject) => {
      axios
        .put(signedUrl, response.data, {
          headers: {
            "Content-Type": "video/mp4", // GCS expects this content type
            // ...(contentLength && { "Content-Length": contentLength }), // Include content-length if available
          },
          maxBodyLength: Infinity, // To handle large files
          maxContentLength: Infinity,
        })
        .then(() => {
          console.log("File successfully uploaded to GCS!");
          resolve();
        })
        .catch((error) => {
          console.error("Error uploading to GCS:", error.message);
          console.error("Upload Error Response:", error.response?.data);
          reject(error);
        });
    });
  } catch (error) {
    console.error("Error streaming from Google Drive:", error.message);
    throw new Error("Failed to stream the file from Google Drive to GCS");
  }
};

export const extractGoogleDriveFileId = (url: string): string | null => {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

export const convertToDirectDownloadUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

export const streamToBucket = async (driveUrl: string, gcsSignedUrl: string): Promise<void> => {
  try {
    // Extract file ID and get direct download URL
    const fileId = extractGoogleDriveFileId(driveUrl);
    const downloadUrl = convertToDirectDownloadUrl(fileId);

    // Get the drive file as a stream
    const driveResponse = await axios({
      method: "get",
      url: downloadUrl,
      responseType: "stream",
      maxBodyLength: Infinity,
      validateStatus: (status) => status === 200,
    });

    // Upload to GCS using the signed URL
    const uploadResponse = await axios.put(gcsSignedUrl, driveResponse.data, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": driveResponse.headers["content-length"],
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    if (uploadResponse.status !== 200) {
      throw new Error(`Upload failed with status ${uploadResponse.status}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Streaming failed: ${error.message}. Status: ${error.response?.status}`);
    }
    throw error;
  }
};
