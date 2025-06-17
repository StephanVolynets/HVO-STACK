import { useQuery, useQueryClient } from "@tanstack/react-query";
import { InboxVideoDTO } from "hvo-shared";

export const useSelectedLanguage = () => {
  const queryClient = useQueryClient();

  const setSelectedLanguage = (languageId: number) => {
    queryClient.setQueryData(["preview/selectedLanguage"], languageId);
  };

  const { data: selectedLanguage } = useQuery<number | null>({
    queryKey: ["preview/selectedLanguage"],
  });

  return { selectedLanguage, setSelectedLanguage };
};
