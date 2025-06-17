import {
  countCreators,
  findCreatorSummaries,
  getAllCreatorsBasic,
  getCreatorLanguages,
  getCreatorStats,
} from "@/apis/creator";
import { useAuthContext } from "@/auth/hooks";
import { useQuery } from "@tanstack/react-query";
import { CreatorBasicDTO, CreatorStatsDTO, CreatorSummaryDTO, LanguageDTO } from "hvo-shared";

export const useGetCreatorSummaries = (page: number, limit: number) => {
  const {
    data: creatorSummaries,
    isLoading,
    error,
    refetch,
  } = useQuery<CreatorSummaryDTO[]>({
    queryKey: ["creators/summaries", page, limit],
    queryFn: async () => await findCreatorSummaries(page, limit),
  });

  return { creatorSummaries, isLoading, error, refetch };
};

export const useCountCreators = () => {
  const { data: creatorsCount, isSuccess: isCountCreatorsSuccess } = useQuery<number>({
    queryKey: ["creators/count"],
    queryFn: async () => await countCreators(),
  });

  return { creatorsCount, isCountCreatorsSuccess };
};

export const useGetAllCreatorsBasic = () => {
  const {
    data: creatorsBasic,
    isLoading,
    error,
  } = useQuery<CreatorBasicDTO[]>({
    queryKey: ["creators/all-basic"],
    queryFn: async () => await getAllCreatorsBasic(),
  });

  return { creatorsBasic, isLoading, error };
};

export const useGetCreatorStats = () => {
  const { user } = useAuthContext();
  const creatorId = user?.email;

  const {
    data: creatorStats,
    isLoading,
    error,
  } = useQuery<CreatorStatsDTO>({
    queryKey: ["creators/stats", creatorId],
    queryFn: async () => await getCreatorStats(creatorId),
  });

  return { creatorStats, isLoading, error };
};

export const useGetCreatorLanguages = () => {
  const { user } = useAuthContext();
  const creatorId = user?.email;

  const {
    data: languages,
    isLoading,
    error,
    refetch,
  } = useQuery<LanguageDTO[]>({
    queryKey: ["creators/languages", creatorId],
    queryFn: async () => await getCreatorLanguages(creatorId),
  });

  return { languages, isLoading, error, refetch };
};
