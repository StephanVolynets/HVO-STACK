import { useQuery, useQueryClient } from "@tanstack/react-query";

// const initialTimePeriod = "ALL";
const initialCreatorId = null;
const initialSearchTerm = "";

export const useInboxFilters = () => {
  const queryClient = useQueryClient();

  // Setters for each filter separately
  // const setTimePeriod = (timePeriod: string) => {
  //   queryClient.setQueryData(["inbox/timePeriod"], timePeriod);
  // };

  const setCreatorId = (creatorId: number | null) => {
    queryClient.setQueryData(["inbox/creatorId"], creatorId);
  };

  const setSearchTerm = (searchTerm: string) => {
    queryClient.setQueryData(["inbox/searchTerm"], searchTerm);
  };

  // Getters for each filter with default values
  // const { data: timePeriod } = useQuery({
  //   queryKey: ["inbox/timePeriod"],
  //   queryFn: () => queryClient.getQueryData<string>(["inbox/timePeriod"]) || initialTimePeriod,
  //   initialData: initialTimePeriod,
  // });

  const { data: creatorId } = useQuery({
    queryKey: ["inbox/creatorId"],
    queryFn: () => queryClient.getQueryData<number | null>(["inbox/creatorId"]) || initialCreatorId,
    initialData: initialCreatorId,
  });

  const { data: searchTerm } = useQuery({
    queryKey: ["inbox/searchTerm"],
    queryFn: () => queryClient.getQueryData<string>(["inbox/searchTerm"]) || initialSearchTerm,
    initialData: initialSearchTerm,
  });

  return { creatorId, setCreatorId, searchTerm, setSearchTerm };
};
