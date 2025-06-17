import { Stack } from "@mui/material";
import { StaffNavigator } from "./components/navigator";
import { StaffContent } from "./components/staff-content";
// import VideoNavigator from "./components/navigator/video-navigator";
// import { VideoContent } from "./components/video-content";

export default function StaffPanel() {
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
      <StaffNavigator />
      <StaffContent />
    </Stack>
  );
}
