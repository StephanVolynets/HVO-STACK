import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useMemo } from "react";

interface Props {
  totalVideos: number;
}

export default function SuccessfulUploadState({ totalVideos }: Props) {
  const {
    setBulkActionsStep,
    toggleMultiSelect,
    checkedVideos,
    videos,
    chosenLanguage,
  } = useStaffContext();

  const selectedVideos = useMemo(() => {
    return videos.filter(
      (video) =>
        checkedVideos.includes(video.id) &&
        video.tasks.some((task) => task.languageId === chosenLanguage?.id)
    );
  }, [checkedVideos, videos, chosenLanguage?.id]);

  const handleBack = () => {
    setBulkActionsStep(1);
  };

  const handleDone = () => {
    toggleMultiSelect();
  };

  return (
    <Stack
      flex={1}
      spacing={1.5}
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "100%",
        position: "relative",
      }}
    >
      <Box
        component="img"
        src="/assets/images/check-circle-green.png"
        sx={{
          width: 192,
          height: 192,
        }}
      />
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Typography fontSize={32} fontWeight={500} color="#333333">
          Successfully uploaded files for
        </Typography>
        <Box
          component="span"
          px={2.5}
          py={1}
          mx={1.25}
          sx={{
            borderRadius: "20px",
            backgroundColor: "rgba(38, 38, 38, 0.05)",
            border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
            color: "rgba(51, 51, 51, 0.7)",
          }}
        >
          {totalVideos} Videos
        </Box>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button size="extraLarge" variant="outlined" onClick={handleBack}>
          Upload Another Language
        </Button>
        <Button variant="outlined" size="extraLarge" onClick={handleDone}>
          Done
        </Button>
      </Stack>
    </Stack>
  );
}
