import SvgColor from "@/components/svg-color";
import { IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/material";
import { VideoSummaryDTO } from "hvo-shared";

interface VideoItemProps {
  video: VideoSummaryDTO;
}

export default function VideoItem({ video }: VideoItemProps) {
  return (
    <Stack
      direction="row"
      sx={{
        borderRadius: "16px",
        backgroundColor: "common.white",
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        overflow: "hidden",
        minHeight: 65,
      }}
      p={1}
      spacing={2}
      alignItems="center"
    >
      <IconButton
        // onClick={handleVideoClick}
        sx={{
          border: "1px solid #E6E6E6",
          borderRadius: 100,
          backgroundColor: "common.white",
          width: 48,
          height: 48,
        }}
      >
        <SvgColor src="/assets/icons/video-play.svg" color="#1A1A1A" />
      </IconButton>

      <Stack spacing={1}>
        <Typography
          variant="bodyLargeStrong"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {video.title}
        </Typography>
        <Typography
          variant="bodySmall"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {video.description}
        </Typography>
      </Stack>
    </Stack>
  );
}
