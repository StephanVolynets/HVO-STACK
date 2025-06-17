import { useEffect, useState } from "react";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import DownloadGenerating from "./components/download-generating";
import DownloadReady from "./components/download-ready";
import { downloadBulkVideos } from "@/apis/staff";

export interface BulkDownloadRequestDTO {
  videos: {
    id: number;
    taskIds: number[];
  }[];
  languageName: string;
}

export default function Step3Download() {
  const {
    videos,
    checkedVideos,
    chosenLanguage,
    setChosenLanguage,
    setBulkActionsStep,
  } = useStaffContext();
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>();

  async function handleDownload(
    bulkDownloadRequestDTO: BulkDownloadRequestDTO
  ) {
    try {
      const response = await downloadBulkVideos(bulkDownloadRequestDTO);
      setDownloadUrl(response);
      // // Simulate API delay
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // // Mock URL for testing
      // const mockUrl = "https://example.com/mock-download.zip";
      // setDownloadUrl(mockUrl);
    } catch (error) {
      console.error("Error downloading videos:", error);
    }
  }

  const handleBack = () => {
    setChosenLanguage(null);
    setBulkActionsStep(1);
  };

  useEffect(() => {
    const bulkDownloadRequestDTO: BulkDownloadRequestDTO = {
      videos: videos
        ?.filter((video) => checkedVideos.includes(video.id))
        .map((video) => ({
          id: video.id,
          taskIds: video.tasks
            .filter((task) => task.languageId === chosenLanguage?.id)
            .map((task) => task.taskId),
        }))
        .filter((video) => video.taskIds.length > 0),
      languageName: chosenLanguage?.name!,
    };

    handleDownload(bulkDownloadRequestDTO);
  }, [chosenLanguage]);

  if (!downloadUrl) {
    return <DownloadGenerating />;
  }

  return <DownloadReady downloadUrl={downloadUrl} onBack={handleBack} />;
}
