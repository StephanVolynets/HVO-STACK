import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { LibraryVideo } from "./components/library-video";
import { useAuthContext } from "@/auth/hooks";
import { useGetLibraryVideos, useGetVideosCount } from "@/use-queries/video";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
// import VideoStatusFilterChip from "../library-filters-new/components/video-status-filter-chip";
// import SearchInput from "../library-filters/components/search-input";
import { CustomChip } from "@/components/custom-chip";
import { VideoStatus } from "hvo-shared";
import DownloadNotificationModal from "./components/download-notification-modal";

export default function LibraryVideos() {
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetLibraryVideos();
  const { videosCount } = useGetVideosCount();
  const { ref, inView } = useInView();
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const { user } = useAuthContext();

  const videos = useMemo(() => {
    return data?.pages.map((page) => page).flat();
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleVideoSelect = (videoId: number, status: VideoStatus) => {
    // Only allow selection if the video is completed
    if (status !== VideoStatus.COMPLETED) {
      return;
    }

    setSelectedVideos((prev) => {
      if (prev.includes(videoId)) {
        return prev.filter((id) => id !== videoId);
      } else {
        return [...prev, videoId];
      }
    });
  };
  return (
    <Stack spacing={2}>
      <Stack spacing={1.5}>
        {videos?.map((video) => (
          <Box key={video.id} sx={{ flex: 1, overflow: "hidden" }}>
            {/* <LibraryVideo video={video} checked={selectedVideos.includes(video.id)} onCheckboxChange={handleVideoSelect} /> */}
            <LibraryVideo video={video} />
          </Box>
        ))}
        {isFetchingNextPage && (
          <Box
            my={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress size="30px" />
          </Box>
        )}

        <div ref={ref} />
      </Stack>
      <DownloadNotificationModal
        open={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        email={user?.email || ""}
      />
    </Stack>
  );
}
