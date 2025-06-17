import { FlagEmoji } from "@/components/flag-emoji";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { useGetStaffCreators } from "@/use-queries/staff";
import { Avatar, IconButton, Stack, Typography } from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import BulkUploadFileManager from "./components/bulk-upload-file-manager";
import SelectedVideosBadge from "./components/selected-videos-badge";
import Iconify from "@/components/iconify";
import { useBoolean } from "@/hooks/use-boolean";
import SuccessfulUploadState from "./components/successful-upload-state";
import VideoTitle from "@/sections/creator/shared-video/components/video-title";

interface Props {
  handleNextStep: () => void;
}

export default function Step3Upload({ handleNextStep }: Props) {
  const {
    checkedVideos,
    videos,
    chosenLanguage,
    setBulkActionsStep,
    refetchVideos,
  } = useStaffContext();
  const { creators } = useGetStaffCreators();
  const [selectedVideoTitles, setSelectedVideoTitles] = useState<string[]>([]);

  const isUploadCompleted = useBoolean();

  const selectedVideos = useMemo(() => {
    return videos.filter(
      (video) =>
        checkedVideos.includes(video.id) &&
        video.tasks.some((task) => task.languageId === chosenLanguage?.id)
    );
  }, [checkedVideos, videos, chosenLanguage?.id]);

  useEffect(() => {
    if (selectedVideos.length > 0 && selectedVideoTitles.length === 0) {
      setSelectedVideoTitles(selectedVideos.map((video) => video.title));
    }
  }, [selectedVideos]);

  const onSubmit = () => {
    const selectedVideosLength = selectedVideos.length;
    const videosLength = videos.length;

    // setBulkActionsStep(1);
    isUploadCompleted.onTrue();
    refetchVideos();

    if (selectedVideosLength === videosLength) {
      setBulkActionsStep(0);
    }
  };

  const handleBack = () => {
    setBulkActionsStep(1);
  };

  return (
    <Stack flex={1} spacing={2}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1.25}
        position="relative"
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <IconButton
            sx={{
              height: "48px",
              width: "48px",
              borderRadius: "100px",
              backgroundColor: "common.white",
              border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
            }}
            onClick={handleBack}
          >
            <Iconify icon="mdi:arrow-left" />
          </IconButton>
        </Stack>

        <Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1.25}
            sx={{
              backgroundColor: "common.white",
              border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
              borderRadius: "100px",
              px: 3,
              py: 1.5,
            }}
          >
            <FlagEmoji countryCode={chosenLanguage?.code!} maxHeight={8} />
            <Typography
              fontSize={18}
              fontWeight={400}
              color="primary.surface"
              sx={{ opacity: 0.7 }}
            >
              {chosenLanguage?.name}
            </Typography>
          </Stack>
        </Stack>
        <Stack>
          <SelectedVideosBadge videoTitles={selectedVideoTitles} />
        </Stack>
        <Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1.25}
            sx={{
              backgroundColor: "common.white",
              border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
              borderRadius: "100px",
              px: 3,
              py: 1.5,
            }}
          >
            <Avatar
              sx={{ width: 16, height: 16 }}
              src={creators?.[0]?.photo_url ?? undefined}
            />
            <Typography
              fontSize={18}
              fontWeight={400}
              color="primary.surface"
              sx={{ opacity: 0.7 }}
            >
              {creators?.[0]?.full_name}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      {isUploadCompleted.value ? (
        <SuccessfulUploadState totalVideos={selectedVideoTitles.length} />
      ) : (
        <BulkUploadFileManager handleNextStep={onSubmit} />
      )}
    </Stack>
  );
}
