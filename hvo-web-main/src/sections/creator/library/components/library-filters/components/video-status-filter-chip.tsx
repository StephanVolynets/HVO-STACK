import { CustomChip } from "@/components/custom-chip";
import Iconify from "@/components/iconify";
import { IconButton, Stack, Typography } from "@mui/material";
import { useLibraryFilters } from "../../../hooks/use-library-filters";
import { VideoStatus } from "hvo-shared";
import SvgColor from "@/components/svg-color";
import { useGetCreatorStats } from "@/use-queries/creator";

export default function VideoStatusFilterChip() {
  const { videoStatus, setVideoStatus } = useLibraryFilters();
  const { creatorStats } = useGetCreatorStats();

  const getCount = () => {
    switch (videoStatus) {
      case VideoStatus.BACKLOG:
        return creatorStats?.videos_in_queue;
      case VideoStatus.IN_PROGRESS:
        return creatorStats?.videos_in_progress;
      case VideoStatus.COMPLETED:
        return creatorStats?.videos_completed;
    }
  };

  const getColor = () => {
    switch (videoStatus) {
      case VideoStatus.BACKLOG:
        return "#1A1A1A";
      case VideoStatus.IN_PROGRESS:
        return "#0A46A9";
      case VideoStatus.COMPLETED:
        return "#00B280";
    }
  };

  const getCountColor = () => {
    switch (videoStatus) {
      case VideoStatus.BACKLOG:
        return "#1A1A1A";
      case VideoStatus.IN_PROGRESS:
        return "#4285F4";
      case VideoStatus.COMPLETED:
        return "#004D00";
    }
  };

  const getBackgroundColor = () => {
    switch (videoStatus) {
      case VideoStatus.BACKLOG:
        return "#F4F4F4";
      case VideoStatus.IN_PROGRESS:
        return "#F7F9FF";
      case VideoStatus.COMPLETED:
        return "#F2FBF2";
    }
  };

  const getText = () => {
    switch (videoStatus) {
      case VideoStatus.BACKLOG:
        return "In Queue";
      case VideoStatus.IN_PROGRESS:
        return "In Progress";
      case VideoStatus.COMPLETED:
        return "Completed";
    }
  };

  if (!videoStatus) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      px={2}
      py={1}
      borderRadius={100}
      sx={{ border: "1px solid #E6E6E6", backgroundColor: "common.white" }}
      spacing={0.5}
    >
      <Typography variant="bodyRegularStrong" color={getColor()}>
        {getText()}
      </Typography>
      <CustomChip
        textVariant="bodySmallStrong"
        backgroundColor={getBackgroundColor()}
        textColor={getCountColor()}
      >
        {getCount()}
      </CustomChip>
      <IconButton size="small" onClick={() => setVideoStatus(videoStatus)}>
        {/* <Iconify icon="mingcute:close-line" width={14} /> */}
        <SvgColor
          src={`/assets/icons/icon-close.svg`}
          color={getColor()}
          sx={{ width: 18, height: 18 }}
        />
      </IconButton>
    </Stack>
  );
}
