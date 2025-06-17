import {
  getTask,
  getTaskResources,
  getTasks,
  getTasksCount,
  getTasksPendingStaffAssignment,
  getTaskUploadedFiles,
} from "@/apis/task";
import { getAssistants } from "@/apis/user";
import { useAuthContext } from "@/auth/hooks";
import { useQuery } from "@tanstack/react-query";
import { AssistantDTO, ResourceItemDTO, StaffType, TaskDTO } from "hvo-shared";

export const useGetAssistants = () => {
  const { profile } = useAuthContext();
  const userId = profile!.id;

  const {
    data: assistants,
    isLoading,
    error,
    refetch,
  } = useQuery<AssistantDTO[]>({
    queryKey: ["settings/assistants", userId],
    queryFn: async () => {
      return await getAssistants({ managerId: userId });
    },
  });

  return { assistants, isLoading, error, refetch };
};
