import { useStaffContext } from "@/sections/admin/staff/contexts/staff-context";

import { Stack, Typography } from "@mui/material";
import VideoItem from "./components/video-item";

export default function StaffContentDetails() {
  const { selectedStaff } = useStaffContext();

  if (!selectedStaff) {
    return null;
  }

  // console.log(
  //   "Video titles:",
  //   selectedStaff?.videos?.map((video) => selectedStaff.id + " " + video.id)
  // );

  console.log("Selected staff", selectedStaff);

  return (
    <Stack
      key={selectedStaff.id}
      sx={{
        backgroundColor: "common.background",
        borderRadius: "24px",
        borderTop: "1px solid #E6E6E6",
        boxShadow: "0px 4px 8px 0px rgba(38, 38, 38, 0.05) inset",
        height: "100%",
        minHeight: 0,
        p: 2,
        overflow: "auto",
      }}
      spacing={1}
    >
      {selectedStaff.videos.filter((video) => video.title).length === 0 && (
        <Stack
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography variant="bodyLargeStrong">0 Videos</Typography>
          <Typography variant="bodySmall" color="common.surfaceVariant">
            No videos have been assigned to this staff member yet
          </Typography>
        </Stack>
      )}
      {selectedStaff.videos
        ?.filter((video) => video.title)
        .map((video) => (
          <VideoItem key={`${selectedStaff.id}-${video.id}`} video={video} />
        ))}
    </Stack>
  );
}
