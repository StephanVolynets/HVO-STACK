import {
  getTask,
  getTaskResources,
  getTasks,
  getTasksCount,
  getTasksPendingStaffAssignment,
  getTaskUploadedFiles,
} from "@/apis/task";
import { useAuthContext } from "@/auth/hooks";
import { useQuery } from "@tanstack/react-query";
import { ResourceItemDTO, StaffTaskDTO, StaffType, TaskDTO } from "hvo-shared";

export const useGetTasksPendingStaffAssignment = (staffId: number) => {
  const { data: tasks } = useQuery({
    queryKey: ["tasks/pending-staff-assignment", staffId],
    queryFn: async () => {
      return await getTasksPendingStaffAssignment(staffId);
    },
  });

  return { tasks };
};

// export const useGetTasks = () => {
//   const { selectedTask, selectTask } = useSelectedTask();
//   const { searchTerm, filter } = useTasksFilters();

//   const { user } = useAuthContext();
//   const staffId = user?.email;
//   // const staffId = user?.uid;

//   const {
//     data: tasks,
//     isLoading,
//     error,
//   } = useQuery<TaskDTO[]>({
//     queryKey: ["tasks/tasks", filter, searchTerm, staffId],
//     queryFn: async () => {
//       {
//         const tasks = await getTasks(1, 10, staffId, filter, searchTerm);
//         // if (!tasks.some((task) => task.id === selectedTask)) {
//         //   selectTask(tasks[0].id);
//         // }
//         return tasks;
//       }
//     },
//   });

//   return { tasks, isLoading, error };
// };

// export const useGetTask = () => {
//   const { selectedTask } = useSelectedTask();

//   const {
//     data: task,
//     isLoading,
//     error,
//   } = useQuery<TaskDTO | null>({
//     queryKey: ["tasks/task", selectedTask],
//     queryFn: async () => {
//       if (!selectedTask) return null;
//       return await getTask(selectedTask);
//     },
//   });

//   return { task, isLoading, error };
// };

// export const useGetTasksCount = () => {
//   const { user } = useAuthContext();
//   const { searchTerm, filter } = useTasksFilters();
//   const staffId = user?.email;

//   const {
//     data: tasksCount,
//     isLoading,
//     error,
//   } = useQuery<number>({
//     queryKey: ["tasks/count", filter, searchTerm, staffId],
//     queryFn: async () => {
//       return await getTasksCount(staffId, filter, searchTerm);
//     },
//   });

//   return { tasksCount, isLoading, error };
// };

// export const useGetTaskResources = () => {
//   // const { selectedTask } = useSelectedTask();
//   const { task } = useGetTask();
//   const folderId = task?.resources_folder_id;
//   const taskId = task?.id;
//   const videoId = task?.video?.id;

//   const {
//     data: resourceItems,
//     isLoading,
//     error,
//   } = useQuery<ResourceItemDTO[]>({
//     queryKey: ["tasks/resources", taskId],
//     queryFn: async () => {
//       if (!folderId) return [];
//       return await getTaskResources({ folderId, taskId: taskId!, videoId: videoId! });
//     },
//   });

//   return { resourceItems, isLoading, error };
// };


export const useGetTaskResources = ({ task }: { task: StaffTaskDTO }) => {
  // const { selectedTask } = useSelectedTask();
  // const { task } = useGetTask();
  const folderId = task?.resources_folder_id;
  const taskId = task?.id;
  const videoId = task?.videoId;

  const {
    data: resourceItems,
    isLoading,
    error,
  } = useQuery<ResourceItemDTO[]>({
    queryKey: ["tasks/resources", taskId],
    queryFn: async () => {
      if (!folderId) return [];
      return await getTaskResources({ folderId, taskId: taskId!, videoId: videoId! });
    },
  });

  return { resourceItems, isLoading, error };
};


// export const useGetTaskUploadedFiles = () => {
//   // const { selectedTask } = useSelectedTask();
//   // const { selectedTask } = useSelectedTask();
//   const { task } = useGetTask();
//   const folderId = task?.uploaded_files_folder_id;
//   const taskId = task?.id;

//   const {
//     data: uploadedFiles,
//     isLoading,
//     error,
//     refetch,
//   } = useQuery<ResourceItemDTO[]>({
//     queryKey: ["tasks/uploaded-files", taskId],
//     queryFn: async () => {
//       if (!folderId) return [];
//       return await getTaskUploadedFiles({ folderId, taskId: taskId! });
//     },
//   });

//   return { uploadedFiles, isLoading, error, refetch };
// };
