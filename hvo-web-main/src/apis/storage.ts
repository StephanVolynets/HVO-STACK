import { del, get, post } from "@/services/api";
import axios from "axios";
import {
  //  InitializeVideoUploadInputDTO, InitializeVideoUploadOutputDTO,
  UploadFileOutputDTO,
} from "hvo-shared";

// export async function initializeVideoUpload(
//   inputData: InitializeVideoUploadInputDTO
// ): Promise<InitializeVideoUploadOutputDTO> {
//   try {
//     const response = await post(`storage/initialize-video-upload`, inputData);
//     const data = response.data;
//     return data;
//   } catch (err) {
//     console.error(`[initializeVideoUpload] ${err}`);
//     throw err;
//   }
// }

export async function getFileId(fileName: string, folderId: string): Promise<string> {
  try {
    const response = await get(`storage/get-file-id`, {
      params: { fileName, folderId },
    });
    return response.data;
  } catch (err) {
    console.error(`[getFileId] ${err}`);
    throw err;
  }
}

export async function getBoxUploadUrl(
  folderId: string,
  fileName: string
): Promise<{ uploadUrl: string; sessionId: string; accessToken: string }> {
  try {
    const response = await post("storage/get-pre-signed-url", {
      fileName,
      folderId,
    });
    const data = response.data;
    return {
      uploadUrl: data.uploadUrl,
      sessionId: data.sessionId,
      accessToken: data.accessToken,
    };
  } catch (err) {
    console.error(`[getBoxUploadUrl] ${err}`);
    throw err;
  }
}

export async function uploadFileToStorage(file: File, folderId: string): Promise<UploadFileOutputDTO> {
  console.log("Uplaoding file: ", file.name);
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId);

    const response = await post("storage/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.error(`[uploadFileToStorage] ${err}`);
    throw err;
  }
}

export async function deleteFileFromStorage(fileId: string): Promise<void> {
  try {
    const response = await del(`storage/${fileId}`);
    return response.data;
  } catch (err) {
    console.error(`[deleteFileFromStorage] ${err}`);
    throw err;
  }
}

export async function generateFolderUrl(folderId: string): Promise<string> {
  try {
    const response = await get(`storage/generate-folder-url`, {
      params: { folderId },
    });
    return response.data;
  } catch (err) {
    console.error(`[generateFolderUrl] ${err}`);
    throw err;
  }
}

export async function computeSHA1Digest(data: Blob): Promise<string> {
  const buffer = await data.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-1", buffer);

  // Convert to base64 in a TypeScript-friendly way
  const hashArray = new Uint8Array(hashBuffer);
  let hashString = "";
  for (let i = 0; i < hashArray.length; i++) {
    hashString += String.fromCharCode(hashArray[i]);
  }
  return btoa(hashString);
}

// Function to create an upload session
export async function createUploadSession(
  folderId: string,
  fileName: string,
  fileSize: number
): Promise<{
  sessionId: string;
  uploadUrl: string;
  expiresAt: string;
  partSize: number;
}> {
  try {
    const response = await post("storage/create-upload-session", {
      folderId,
      fileName,
      fileSize,
    });
    return response.data;
  } catch (error) {
    console.error("[createUploadSession] Failed to create upload session:", error);
    throw error;
  }
}

// Function to commit an upload session
export async function commitUploadSession(
  sessionId: string,
  parts: Array<{ part_id: string; offset: number; size: number }>,
  digest: string
): Promise<any> {
  try {
    const response = await post("storage/commit-upload-session", {
      sessionId,
      parts,
      digest,
    });
    return response.data;
  } catch (error) {
    console.error("[commitUploadSession] Failed to commit upload session:", error);
    throw error;
  }
}

// Function to abort an upload session
export async function abortUploadSession(sessionId: string): Promise<void> {
  try {
    await post("storage/abort-upload-session", { sessionId });
  } catch (error) {
    console.error("[abortUploadSession] Failed to abort upload session:", error);
    throw error;
  }
}

// Function to upload a chunk through the backend
export async function uploadChunk(
  sessionId: string,
  chunk: Blob,
  offset: number,
  totalSize: number,
  digest: string
): Promise<any> {
  try {
    // Create FormData to send the chunk to your server
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("sessionId", sessionId);

    // Ensure these are sent as strings
    formData.append("offset", offset.toString());
    formData.append("totalSize", totalSize.toString());

    formData.append("digest", digest);

    console.log(`Uploading chunk: sessionId=${sessionId}, offset=${offset}, totalSize=${totalSize}, digest=${digest}`);

    const response = await post("storage/upload-chunk", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error(`[uploadChunk] Error uploading chunk at offset ${offset}:`, error);
    throw error;
  }
}

// The main chunked upload function - through backend
export async function uploadFileToBoxChunked(
  file: File,
  folderId: string
): Promise<{ fileId: string; fileName: string }> {
  try {
    // Step 1: Compute file hash for integrity verification
    console.log(`[uploadFileToBoxChunked] Computing SHA-1 hash for ${file.name} (${file.size} bytes)`);
    const fileDigest = await computeSHA1Digest(file);

    // Step 2: Create an upload session
    console.log("[uploadFileToBoxChunked] Creating upload session");
    const session = await createUploadSession(folderId, file.name, file.size);
    const { sessionId, partSize } = session;

    console.log(`[uploadFileToBoxChunked] Upload session created: ${sessionId}`);
    console.log(`[uploadFileToBoxChunked] Part size: ${partSize} bytes`);

    let adjustedPartSize = partSize;
    if (partSize > 30 * 1024 * 1024) {
      // If part size is larger than 30 MB
      adjustedPartSize = 30 * 1024 * 1024; // Cap at 30 MB
      console.log(`[uploadFileToBoxChunked] Part size capped at 30 MB`);
    }

    // Step 3: Upload the file in chunks through the backend
    const totalParts = Math.ceil(file.size / adjustedPartSize);
    let uploadedParts: Array<{ part_id: string; offset: number; size: number }> = [];

    console.log(`[uploadFileToBoxChunked] Uploading file in ${totalParts} parts`);

    for (let i = 0; i < totalParts; i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, file.size);
      const chunkSize = end - start;
      const chunk = file.slice(start, end);

      // Compute SHA-1 digest for the chunk
      const chunkDigest = await computeSHA1Digest(chunk);

      console.log(
        `[uploadFileToBoxChunked] Uploading part ${i + 1}/${totalParts}, bytes ${start}-${end - 1}/${file.size}`
      );

      try {
        // Upload chunk through the backend
        const partResponse = await uploadChunk(sessionId, chunk, start, file.size, `sha=${chunkDigest}`);

        // Check partResponse structure and extract part_id
        let partId: string;

        console.log("[uploadFileToBoxChunked] Part response:", partResponse);

        if (partResponse?.part?.partId) {
          // If using your current response format
          partId = partResponse.part.partId;
        } else if (partResponse?.rawData?.part?.part_id) {
          // If using Box's raw format
          partId = partResponse.rawData.part.part_id;
        } else if (partResponse?.part_id) {
          // Direct format
          partId = partResponse.part_id;
        } else {
          console.error("Unexpected part response format:", partResponse);
          throw new Error(`Failed to upload part ${i + 1}: Invalid response format`);
        }

        console.log(`[uploadFileToBoxChunked] Part ${i + 1}/${totalParts} uploaded successfully, part_id: ${partId}`);

        // Add part info to the list of uploaded parts
        uploadedParts.push({
          part_id: partId,
          offset: start,
          size: chunkSize,
        });
      } catch (error) {
        console.error(`[uploadFileToBoxChunked] Error uploading part ${i + 1}:`, error);

        // Abort the upload session and throw the error
        try {
          await abortUploadSession(sessionId);
        } catch (abortError) {
          console.error("[uploadFileToBoxChunked] Failed to abort upload session:", abortError);
        }

        throw error;
      }
    }

    // Step 4: Commit the upload session
    console.log("[uploadFileToBoxChunked] All parts uploaded. Committing upload session");

    const fileInfo = await commitUploadSession(sessionId, uploadedParts, `sha=${fileDigest}`);
    console.log(`[uploadFileToBoxChunked] Upload complete. File ID: ${fileInfo.fileId}`);

    return fileInfo;
  } catch (error) {
    console.error("[uploadFileToBoxChunked] Upload failed:", error);
    throw error;
  }
}
