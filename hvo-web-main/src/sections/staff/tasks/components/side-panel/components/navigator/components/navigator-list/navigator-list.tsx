import { useGetStaffVideos, useGetStaffVideosCount } from "@/use-queries/staff";
import { Stack, Typography, Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import VideoItem, { VideoItemSkeleton } from "./components/video-item";
import { useRouter, useSearchParams } from "next/navigation";
import { paths } from "@/routes/paths";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { useAuthContext } from "@/auth/hooks";
import Iconify from "@/components/iconify";
import SelectableVideoItem from "./components/selectable-video-item";

export default function NavigatorList() {
  const { profile } = useAuthContext();
  const router = useRouter();
  const { count } = useGetStaffVideosCount();
  const {
    isMultiSelectActive,
    videoId,
    videos,
    isVideosLoading,
    handleVideoSelection,
    checkedVideos,
    setCheckedVideos,
    setBulkMethod,
  } = useStaffContext();

  // const [checkedVideos, setCheckedVideos] = useState<Record<number, boolean>>({});
  // const { videos: _videos, isLoading } = useGetStaffVideos({ limit: 10 });

  // const searchParams = useSearchParams();
  // const videoId = searchParams.get("videoId");
  // const taskId = searchParams.get("taskId");

  // const videos = useMemo(() => {
  //     return _videos?.pages.map((page) => page).flat() || [];
  // }, [_videos]);

  // Handle automatic selection of first video when none is selected
  // useEffect(() => {
  //     if (!isLoading && videos.length > 0 && (!videoId || !taskId)) {
  //         const firstVideo = videos[0];
  //         const firstTask = firstVideo.tasks[0];
  //         if (firstVideo && firstTask) {
  //             router.push(paths.dashboard.staff.tasksNew(firstVideo.id, firstTask.taskId));
  //         }
  //     }
  // }, [isLoading, videos, videoId, taskId, router]);

  // Handle video selection
  const handleVideoClick = (video) => {
    const firstTaskId = video.tasks[0].taskId;
    // router.push(paths.dashboard.staff.tasksNew(video.id, firstTaskId));
    handleVideoSelection(video.id, firstTaskId);
  };

  // Handle checkbox changes
  // const handleCheckChange = (videoId: number, checked: boolean) => {
  //         setCheckedVideos(prev => ({
  //             ...prev,
  //             [videoId]: checked
  //         }));
  // };

  if (isVideosLoading) {
    return (
      <Stack sx={{ flex: "1 1 auto", overflow: "auto" }}>
        {Array.from({ length: count ?? 5 }).map((_, index) => (
          <VideoItemSkeleton key={index} />
        ))}
      </Stack>
    );
  }

  const handleCheckChange = (videoId: number) => (checked: boolean) => {
    const newCheckedVideos = checked
      ? [...checkedVideos, videoId]
      : checkedVideos.filter((id) => id !== videoId);
    setCheckedVideos(newCheckedVideos);
    if (newCheckedVideos.length === 0) {
      setBulkMethod("none");
    }
  };

  return (
    <Stack spacing={1} sx={{ width: "100%" }}>
      {isVideosLoading &&
        Array.from({ length: 10 }).map((_, i) => <VideoItemSkeleton key={i} />)}

      {!isVideosLoading && videos?.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            textAlign: "center",
            py: 8,
            px: 2,
          }}
        >
          <Iconify
            icon="mdi:video-off-outline"
            width={48}
            height={48}
            sx={{ mb: 2, color: "text.disabled", opacity: 0.6 }}
          />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
            No Videos Available
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 280 }}
          >
            No videos have been assigned yet. New content will appear here when
            available.
          </Typography>
        </Box>
      )}

      {!isVideosLoading && videos?.length > 0 && (
        <Stack spacing={1} sx={{ flex: "1 1 auto", overflow: "auto" }}>
          {videos?.map((video) =>
            isMultiSelectActive ? (
              <SelectableVideoItem
                key={video.id}
                video={video}
                isChecked={checkedVideos.includes(video.id)}
                onCheckChange={(checked) =>
                  handleCheckChange(video.id)(checked)
                }
                staffType={profile?.staffType!}
              />
            ) : (
              <VideoItem
                key={video.id}
                video={video}
                isSelected={video.id === +(videoId ?? 0)}
                onClick={() => handleVideoClick(video)}
                staffType={profile?.staffType!}
              />
            )
          )}
        </Stack>
      )}
    </Stack>
  );
}
