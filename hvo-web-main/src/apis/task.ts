import { get, post } from "@/services/api";
import { AssignStaffDTO, ResourceItemDTO, StaffType, TaskDTO, UpdateTaskStaffDTO } from "hvo-shared";

export async function getTasksPendingStaffAssignment(staffId: number) {
  try {
    const response = await get(`tasks/pending-staff-assignment`, {
      params: {
        staffId,
      },
    });
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getTasksPendingStaffAssignment] ${error}`);
  }
}

export async function assignStaff(assignStaff: AssignStaffDTO) {
  try {
    await post(`tasks/assign-staff`, assignStaff);
  } catch (error) {
    console.error(`[assignStaffToVideo] ${error}`);
  }
}

export async function updateTaskStaff(updateTaskStaffDTO: UpdateTaskStaffDTO) {
  try {
    await post(`tasks/update-staff`, updateTaskStaffDTO);
  } catch (error) {
    console.error(`[updateStaff] ${error}`);
  }
}

export async function getTasks(
  page: number,
  limit: number,
  staffId: string,
  filter: string,
  searchTerm: string
): Promise<TaskDTO[]> {
  try {
    const response = await get(`tasks/${staffId}`, {
      params: {
        page,
        limit,
        filter,
        searchTerm,
      },
    });

    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getTasks] ${error}`);
    throw error;
  }
}

export async function getTask(taskId: number): Promise<TaskDTO> {
  try {
    const response = await get(`tasks/${taskId}/details`);
    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getTask] ${error}`);
    throw error;
  }
}

export async function getTasksCount(staffId: string, filter: string, searchTerm: string): Promise<number> {
  try {
    const response = await get(`tasks/count`, {
      params: { staffId, filter, searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error(`[getTasksCount] Error:`, error);
    throw error;
  }
}

export async function getTaskResources({
  folderId,
  taskId,
  videoId,
}: {
  folderId: string;
  taskId: number;
  videoId: number;
}): Promise<ResourceItemDTO[]> {
  try {
    const response = await get(`tasks/resources`, {
      params: {
        folderId,
        taskId,
        videoId,
      },
    });

    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getTaskResources] ${error}`);
    throw error;
  }
}

export async function getTaskUploadedFiles({
  folderId,
  taskId,
}: {
  folderId: string;
  taskId: number;
}): Promise<ResourceItemDTO[]> {
  try {
    const response = await get(`tasks/uploaded-files`, {
      params: {
        folderId,
        taskId,
      },
    });

    const data = await response.data;

    return data;
  } catch (error) {
    console.error(`[getTaskUploadedFiles] ${error}`);
    throw error;
  }
}

export async function completeTask(taskId: number) {
  try {
    await post(`tasks/${taskId}/complete`);
  } catch (error) {
    console.error(`[assignStaffToVideo] ${error}`);
  }
}
