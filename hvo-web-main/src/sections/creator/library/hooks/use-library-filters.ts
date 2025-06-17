import { useQuery, useQueryClient } from "@tanstack/react-query";
import { VideoStatus } from "hvo-shared";

const initialTimePeriod = "ALL";
const initialVideoStatus = null;
const initialSearchTerm = "";

export const useLibraryFilters = () => {
  const queryClient = useQueryClient();

  // Setters for each filter separately
  const setTimePeriod = (timePeriod: string) => {
    queryClient.setQueryData(["library/timePeriod"], timePeriod);
  };

  // Setters for each filter separately
  const setVideoStatus = (newVideoStatus: VideoStatus | null) => {
    const _videoStatus = newVideoStatus === videoStatus ? null : newVideoStatus;
    queryClient.setQueryData(["library/videoStatus"], _videoStatus);
  };

  const setSearchTerm = (searchTerm: string) => {
    queryClient.setQueryData(["library/searchTerm"], searchTerm);
  };

  // Getters for each filter with default values
  const { data: timePeriod } = useQuery({
    queryKey: ["library/timePeriod"],
    queryFn: () => queryClient.getQueryData<string>(["library/timePeriod"]) || initialTimePeriod,
    initialData: initialTimePeriod,
  });

  const { data: videoStatus } = useQuery({
    queryKey: ["library/videoStatus"],
    queryFn: () => queryClient.getQueryData<VideoStatus>(["library/videoStatus"]) || initialVideoStatus,
    initialData: initialVideoStatus,
  });

  const { data: searchTerm } = useQuery({
    queryKey: ["library/searchTerm"],
    queryFn: () => queryClient.getQueryData<string>(["library/searchTerm"]) || initialSearchTerm,
    initialData: initialSearchTerm,
  });

  return { timePeriod, setTimePeriod, videoStatus, setVideoStatus, searchTerm, setSearchTerm };
};
