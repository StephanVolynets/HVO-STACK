import ytdl from "ytdl-core";
import axios from "axios";
import { PassThrough } from "stream";

export const streamFromYouTubeToSignedUrl = async (url: string, signedUrl: string): Promise<void> => {
  if (!ytdl.validateURL(url)) throw new Error("Invalid YouTube URL");

  console.log(`Downloading video from YouTube: ${url} -> ${signedUrl}`);

  return new Promise((resolve, reject) => {
    try {
      const passThrough = new PassThrough();
      const videoStream = ytdl(url, { 
        quality: "highest",
        filter: "videoandaudio"
      });

      // Handle video stream errors
      videoStream.on('error', (err) => {
        console.error('YouTube stream error:', err);
        reject(err);
      });

      // Pipe video stream through PassThrough
      videoStream.pipe(passThrough);

      // Set up the upload
      const uploadPromise = axios.put(signedUrl, passThrough, {
        headers: {
          'Content-Type': 'video/mp4',
          'Transfer-Encoding': 'chunked'
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 0,
      });

      uploadPromise
        .then(() => {
          console.log('Upload completed successfully');
          resolve();
        })
        .catch((err) => {
          console.error('Upload error:', err);
          reject(err);
        });

    } catch (error) {
      console.error('Setup error:', error);
      reject(error);
    }
  });
};