import { BulkDownloadRequestDTO } from "@/sections/staff/tasks/components/workspace/components/task-area/components/task-details/components/bulk-view/components/step-3-download/step-3-download";
import { get, post } from "@/services/api";
import { AxiosRequestConfig } from "axios";
import { CreateStaffDTO, StaffSummaryDTO, StaffVideoDTO, StaffTaskDTO } from "hvo-shared";

export async function createStaff(staffData: CreateStaffDTO) {
  try {
    const response = await post(`users/staff`, staffData);
    const data = response.data;
    return data;
  } catch (err) {
    console.error(`[createStaff] ${err}`);
    throw err;
  }
}

export async function getStaffCount({
  searchTerm,
  languageIds,
  role,
}: {
  searchTerm: string | null;
  languageIds: string | null;
  role: string | null;
}) {
  try {
    const response = await get(`staff/count`, {
      params: {
        searchTerm,
        languages: languageIds,
        role,
      },
    });
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getStaffCount] ${error}`);
    throw error;
  }
}

export async function getStaff({
  page,
  limit,
  searchTerm,
  languageIds,
  role,
}: {
  page: number;
  limit: number;
  searchTerm: string | null;
  languageIds: string | null | undefined;
  role: string | null;
}): Promise<StaffSummaryDTO[]> {
  console.log("LANGS-BEFORE-RETREIVE", languageIds);
  try {
    const response = await get(`staff`, {
      params: {
        page,
        limit,
        searchTerm,
        languages: languageIds,
        role,
      },
    });
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getStaff] ${error}`);
    throw error;
  }
}

// export async function getAllStaffSummaries(searchTerm: string) {
//   try {
//     const response = await get(`staff/summaries`, {
//       params: {
//         searchTerm,
//       },
//     });
//     const data = await response.data;

//     return data;
//   } catch (error) {
//     console.error(`[getAllStaffSummaries] ${error}`);
//     // throw error;
//   }
// }

export async function getStaffByTaskId(taskId: number) {
  try {
    const response = await get(`staff/task/${taskId}`);
    const data = response.data;

    return data;
  } catch (error) {
    console.error(`[getStaffByTaskId] ${error}`);
    // throw error;
  }
}

// -------- Staff Portal --------
export async function getStaffVideosCount() {
  try {
    const response = await get(`staff/videos/count`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getStaffVideosCount] ${error}`);
    throw error;
  }
}

export async function getStaffVideos(
  page: number,
  limit: number,
  taskId: number | undefined,
  filter: string,
  searchTerm: string,
  creatorId: number | undefined
): Promise<StaffVideoDTO[]> {
  try {
    const response = await get(`staff/videos`, {
      params: {
        offset: page,
        limit,
        taskId: taskId,
        filter,
        searchTerm,
        creatorId,
      },
    });

    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getStaffVideos] ${error}`);
    throw error;
  }
}

export async function getStaffTask(taskId: number): Promise<StaffTaskDTO> {
  try {
    const response = await get(`staff/tasks/${taskId}`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getStaffTask] ${error}`);
    throw error;
  }
}

export async function getStaffCreators() {
  try {
    const response = await get(`staff/creators`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getStaffCreators] ${error}`);
    throw error;
  }
}


export async function downloadBulkVideos(bulkDownloadRequestDTO: BulkDownloadRequestDTO) {
  try {
    const response = await post(`staff/bulk-download`, {
      videos: bulkDownloadRequestDTO.videos,
      languageName: bulkDownloadRequestDTO.languageName,
    });
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[downloadBulkVideos] ${error}`);
    throw error;
  }
}
