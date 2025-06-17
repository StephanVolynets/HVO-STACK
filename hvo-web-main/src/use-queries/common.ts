import { getAllLanguages } from "@/apis/common";
import { useQuery } from "@tanstack/react-query";
import { LanguageDTO } from "hvo-shared";

export const useGetAllLanguages = () => {
  const {
    data: languages,
    isLoading,
    error,
  } = useQuery<LanguageDTO[]>({
    queryKey: ["common/languages"],
    queryFn: async () => await getAllLanguages(),
  });

  return { languages, isLoading, error };
};
