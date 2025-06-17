import { Stack } from "@mui/material";
import VideoNavigator from "./components/navigator/video-navigator";
import { VideoContent } from "./components/video-content";

export default function VideosPanel() {
  return (
    <Stack
      direction="row"
      sx={{
        backgroundColor: "common.white",
        borderRadius: "24px",
        flex: 1,
        overflow: "hidden",
        minHeight: 0,
        height: "100%",
      }}
    >
      <VideoNavigator />
      <VideoContent />
    </Stack>
  );
}
