import { Stack } from "@mui/material";
import VideoContentHeader from "./components/header";
import VideoContentTabs from "./components/tabs";
import { VideoContentDetails } from "./components/details";
import HandleChanges from "./components/handle-changes";

export default function VideoContent() {
  return (
    <Stack spacing={1.5} p={1.5} sx={{ flex: 1, minHeight: 0 }}>
      <VideoContentHeader />
      <VideoContentTabs />
      <VideoContentDetails />
      {/* <HandleChanges /> */}
    </Stack>
  );
}
