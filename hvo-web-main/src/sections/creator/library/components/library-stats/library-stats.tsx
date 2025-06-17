import { Divider, Stack } from "@mui/material";
import StatsCard, { StatsMode } from "./components/stats-card";
import { useGetCreatorStats } from "@/use-queries/creator";

export default function LibraryStats() {
  const { creatorStats } = useGetCreatorStats();

  return (
    <Stack
      direction="row"
      display="flex"
      sx={{
        backgroundColor: "common.white",
        borderRadius: "16px",
        // border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        overflow: "hidden",
      }}
    >
      <StatsCard
        mode={StatsMode.Queue}
        videosCount={creatorStats?.videos_in_queue}
      />
      {/* <Divider sx={{ height: "auto" }} orientation="vertical" /> */}
      <StatsCard
        mode={StatsMode.InProgress}
        videosCount={creatorStats?.videos_in_progress}
      />
      {/* <Divider sx={{ height: "auto" }} orientation="vertical" /> */}
      <StatsCard
        mode={StatsMode.Completed}
        videosCount={creatorStats?.videos_completed}
      />
    </Stack>
  );
}
