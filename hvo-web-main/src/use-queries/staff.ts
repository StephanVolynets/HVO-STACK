import { getStaff, getStaffByTaskId, getStaffCount, getStaffCreators, getStaffTask, getStaffVideos, getStaffVideosCount } from "@/apis/staff";
import { useStaffContext } from "@/sections/admin/staff/contexts/staff-context";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { CreatorBasicDTO, SelectStaffDTO, StaffSummaryDTO, StaffTaskDTO, StaffVideoDTO } from "hvo-shared";


export const useGetStaffCount = () => {
  const {search: searchTerm, languageId, phase: _role} = useStaffContext();

  const languagesString = languageId === -1 ? null : languageId?.toString();//languages?.join(",");
  const role = _role === "-1" ? null : _role;

  const { data: count, isSuccess } = useQuery<number>({
    queryKey: ["staff", searchTerm, languagesString, role],
    queryFn: async () => await getStaffCount({ searchTerm, languageIds: languagesString || null, role: role || null}),
  });

  return { count, isSuccess };
};


export const useGetStaff = ({ limit = 10 }: { limit?: number }) => {
  // const { searchTerm, languages, role } = useStaffFilters();
  // const { selectedStaff, setSelectedStaff } = useSelectedStaff();
  const {search: searchTerm, languageId, phase: _role, selectedStaff, setSelectedStaff} = useStaffContext();


  const languagesString = languageId === -1 ? null : languageId?.toString();//languages?.join(",");

  const role = _role === "-1" ? null : _role;

  const {
    data: staff,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<StaffSummaryDTO[]>({
    queryKey: ["staff", languagesString || -1, searchTerm, role],
    queryFn: async ({ pageParam = 1 }) => {
      const staff = await getStaff({
        page: pageParam as number,
        limit,
        searchTerm,
        languageIds: languagesString,
        role: role || null,
      });
      // If new results do not contain the selected video, select the first one
      if (!staff.some((staffItem) => staffItem.id === selectedStaff?.id)) {
        setSelectedStaff(staff[0]);
      }
      return staff;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length + 1;
    },
  });

  return { staff, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading };
};

export const useGetStaffByTaskId = (taskId: number) => {
  const {
    data: staff,
    isLoading,
    error,
  } = useQuery<SelectStaffDTO[]>({
    queryKey: ["staff/task", taskId],
    queryFn: async () => await getStaffByTaskId(taskId),
  });

  return { staff, isLoading, error };
};


// -------- Staff Portal --------

export const useGetStaffVideosCount = () => {
  const { data: count, isSuccess } = useQuery<number>({
    queryKey: ["staff/videos/count"],
    queryFn: async () => await getStaffVideosCount(),
  });

  return { count, isSuccess };
};

export const useGetStaffVideos = ({ limit = 10, taskId, filter, searchTerm, creatorId }: { limit?: number; taskId?: number, filter: string, searchTerm: string, creatorId?: number }) => {
  const {
    data: videos,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<StaffVideoDTO[]>({
    queryKey: ["staff/videos", taskId, filter, searchTerm, creatorId],
    queryFn: async ({ pageParam = 1 }) => {
      const videos = await getStaffVideos(pageParam as number, limit, taskId || undefined, filter, searchTerm, creatorId);
      return videos;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length + 1;
    },
  });

  return { videos, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch };
};

export const useGetStaffTask = (taskId: number | undefined) => {
  const { data: task, isLoading } = useQuery<StaffTaskDTO>({
    queryKey: ["staff/task", taskId],
    queryFn: async () => await getStaffTask(taskId as number),
    enabled: !!taskId,
  });

  return { task, isLoading };
};

export const useGetStaffCreators = () => {
  const { data: creators, isLoading } = useQuery<CreatorBasicDTO[]>({
    queryKey: ["staff/creators"],
    queryFn: async () => await getStaffCreators(),
  });

  return { creators, isLoading };
};
