import SvgColor from "@/components/svg-color";
import { Box, Button, Stack, Typography } from "@mui/material";
import {
  getLineColor,
  getCountColor,
  getFollowUpText,
  getTitleText,
  getVideoStatus,
} from "./helpers";
import { useLibraryFilters } from "../../../hooks/use-library-filters";

export enum StatsMode {
  Queue = "Queue",
  InProgress = "In Progress",
  Completed = "Completed",
}

type Props = {
  mode: StatsMode;
  videosCount: number | number | undefined;
};

export default function StatsCard({ mode, videosCount }: Props) {
  const videoStatus = getVideoStatus(mode);
  const { videoStatus: selectedVideoStatus, setVideoStatus } =
    useLibraryFilters();

  return (
    <Stack
      flex={1}
      alignItems="center"
      justifyContent="center"
      spacing={0.5}
      sx={{
        // borderTop: `3px solid ${getBorderColor(mode)}`,
        cursor: "pointer",
        backgroundColor:
          videoStatus === selectedVideoStatus
            ? "rgba(38, 38, 38, 0.10)"
            : "common.white",
        "&:hover": {
          backgroundColor: "rgba(38, 38, 38, 0.05)",
        },
      }}
      p={1}
      pb={2}
      onClick={() => setVideoStatus(videoStatus)}
    >
      <Box
        sx={{
          mx: 1,
          height: 4,
          alignSelf: "stretch",
          borderRadius: "100px",
          background: getLineColor(mode),
        }}
      />

      <Stack alignItems="center">
        <Typography variant="bodyRegular" color="primary.main">
          {getTitleText(mode)}
        </Typography>
        <Typography
          variant="display1"
          fontWeight={700}
          sx={{ color: getCountColor(mode) }}
        >
          {videosCount || 0}
        </Typography>
      </Stack>
    </Stack>
  );
}
