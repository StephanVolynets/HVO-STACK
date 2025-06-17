import { generateFolderUrl } from "@/apis/storage";
import { useQuery } from "@tanstack/react-query";

export const useGetFolderUrl = (folderId: string | null | undefined) => {
  console.log("Getting folder link for folderId: ", folderId);
  const { data: folderLink } = useQuery<string | null>({
    queryKey: ["storage/generate-folder-url", folderId],
    queryFn: async () => {
      if (folderId) {
        return await generateFolderUrl(folderId);
      } else {
        return null;
      }
    },
  });

  return { folderLink };
};
