import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { Button, Stack } from "@mui/material";
import { useMemo } from "react";
import VideoItem from "./components/video-item";
import BulkViewInfo from "./components/info";
import SvgColor from "@/components/svg-color";
import EmptyState from "./components/empty-state";

interface Props {
  onStepComplete: () => void;
}

export default function Step1SelectVideos({ onStepComplete }: Props) {
  const { checkedVideos, setCheckedVideos, videos, setBulkMethod } =
    useStaffContext();

  const selectedVideos = useMemo(() => {
    return videos.filter((video) => checkedVideos.includes(video.id));
  }, [checkedVideos, videos]);

  const onDelete = (id: number) => {
    setCheckedVideos(checkedVideos.filter((videoId) => videoId !== id));
  };

  const handleDownload = () => {
    setBulkMethod("download");
    onStepComplete();
  };

  const handleUpload = () => {
    setBulkMethod("upload");
    onStepComplete();
  };

  return (
    <Stack
      flex={1}
      spacing="14px"
      p={1.5}
      sx={{
        borderRadius: "24px 24px 40px 40px",
        backgroundColor: "common.white",
        boxShadow: "0px 4px 16px 0px rgba(38, 38, 38, 0.05)",
      }}
    >
      <BulkViewInfo />

      {selectedVideos.length === 0 && <EmptyState />}

      <Stack spacing={2} flex={selectedVideos.length > 0 ? 1 : 0}>
        {selectedVideos.map((video) => (
          <VideoItem
            key={video.id}
            video={video}
            onDelete={() => onDelete(video.id)}
          />
        ))}
      </Stack>

      <Stack direction="row" spacing={0.5} p={1.5}>
        <Button
          disabled={checkedVideos.length === 0}
          variant="contained"
          fullWidth
          startIcon={<SvgColor src="/assets/icons/download.svg" />}
          onClick={handleDownload}
        >
          Download Resources
        </Button>
        <Button
          disabled={checkedVideos.length === 0}
          variant="contained"
          fullWidth
          startIcon={<SvgColor src="/assets/icons/upload.svg" />}
          onClick={handleUpload}
        >
          Bulk Submit
        </Button>
      </Stack>
    </Stack>
  );
}
