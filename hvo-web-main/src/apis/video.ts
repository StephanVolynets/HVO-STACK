import { get, post } from "@/services/api";
import { AxiosRequestConfig } from "axios";
import { AddVideoDTO, ApproveDubDto, CreateCreatorDTO, ShareVideoDTO, FeedbackDTO, InboxVideoDTO, InitiateVideoUploadInputDTO, InitiateVideoUploadOutputDTO, LibraryVideoDTO, StaffType, SubmitFeedbackDTO, VideoPreviewDTO, VideoPreviewMediaDTO, YoutubeChannelBasicDTO } from "hvo-shared";

export async function getVideosCount(creatorId: number | null, searchTerm: string) {
  try {
    const response = await get(`videos/count`, {
      params: {
        creatorId,
        // timePeriod,
        searchTerm,
      },
    });
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getVideosCount] ${error}`);
    throw error;
  }
}

export async function getVideosCountNew(creatorId: string | null, searchTerm: string) {
  try {
    const response = await get(`videos/count`, {
      params: {
        creatorId,
        // timePeriod,
        searchTerm,
      },
    });
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getVideosCount] ${error}`);
    throw error;
  }
}

export async function getVideos(
  // timePeriod: string,
  page: number,
  limit: number,
  creatorId: number | null,
  searchTerm: string
): Promise<InboxVideoDTO[]> {
  try {
    const response = await get(`videos`, {
      params: {
        // timePeriod,
        page,
        limit,
        creatorId,
        searchTerm,
      },
    });
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getVideos] ${error}`);
    throw error;
  }
}

export async function getLibraryVideos(page: number, limit: number, timePeriod: string, creatorId: number | null, videoStatus: string | null, searchTerm: string): Promise<LibraryVideoDTO[]> {
  try {
    const response = await get(`videos/library/${creatorId}`, {
      params: {
        page,
        limit,
        timePeriod,
        videoStatus,
        searchTerm,
      },
    });

    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getLibraryVideos] ${error}`);
    throw error;
  }
}

export async function getVideosInReview(page: number, limit: number, creatorId: number | null): Promise<LibraryVideoDTO[]> {
  try {
    const response = await get(`videos/review/${creatorId}`, {
      params: {
        page,
        limit,
      },
    });

    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getVideosInReview] ${error}`);
    throw error;
  }
}

export async function getVideosInReviewCount(creatorId: number | null) {
  try {
    const response = await get(`videos/review/count`, {
      params: {
        creatorId,
      },
    });
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getVideosInReviewCount] ${error}`);
    throw error;
  }
}

export async function addVideo(addVideoData: AddVideoDTO, creatorId: string) {
  try {
    const response = await post(`videos/finalize-video-submission/${creatorId}`, addVideoData);
    const data = response.data;
    return data;
  } catch (err) {
    console.error(`[addVideo] ${err}`);
    throw err;
  }
}

export async function getVideoPreview(videoId: number): Promise<VideoPreviewDTO> {
  try {
    const response = await get(`videos/${videoId}/preview`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getVideoPreview] ${error}`);
    throw error;
  }
}

export async function getVideoPreviewMedia(videoId: number): Promise<VideoPreviewMediaDTO> {
  try {
    const response = await get(`videos/${videoId}/preview-media`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getVideoPreviewMedia] ${error}`);
    throw error;
  }
}

//  ---- Video Upload ----
export async function initiateVideoUpload(inputData: InitiateVideoUploadInputDTO): Promise<InitiateVideoUploadOutputDTO> {
  try {
    const response = await post(`videos/initiate-video-submission`, inputData);
    const data = response.data;
    return data;
  } catch (err) {
    console.error(`[initiateVideoUpload] ${err}`);
    throw err;
  }
}

export async function approveDub(dubId: number, approveDubData: ApproveDubDto) {
  try {
    const response = await post(`videos/${dubId}/approve-dub`, approveDubData);
    const data = response.data;
    return data;
  } catch (err) {
    console.error(`[approveDub] ${err}`);
    throw err;
  }
}

export async function getYoutubeChannels(creatorId: string): Promise<YoutubeChannelBasicDTO[]> {
  try {
    const response = await get(`videos/youtube-channels/${creatorId}`);
    const data = await response.data;
    return data;
  } catch (error) {
    console.error(`[getYoutubeChannels] ${error}`);
    throw error;
  }
}

export async function downloadDubs(videoIds: number[]) {
  try {
    const response = await post(`videos/bulk-download`, { videoIds });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(`[downloadDubs] ${error}`);
    throw error;
  }
}

export async function getBulkUploadTemplate(creatorId: string) {
  try {
    const response = await get(`videos/bulk-upload-template/${creatorId}`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.error(`[getBulkUploadTemplate] ${error}`);
    throw error;
  }
}

export async function uploadBulkVideos(creatorId: string, file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await post(`videos/bulk-upload/${creatorId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error(`[uploadBulkVideos] ${error}`);
    throw error;
  }
}

export async function getShareToken(shareVideoData: ShareVideoDTO) {
  try {
    const response = await post(`videos/share`, shareVideoData);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(`[getShareToken] ${error}`);
    throw error;
  }
}


export async function getVideoTitleById(videoId: number) {
  try {
    const response = await get(`videos/${videoId}/title`);
    const data = await response.data;
    return data;
  } catch (error) {
    console.error(`[getVideoTitleById] ${error}`);
    throw error;
  }
}