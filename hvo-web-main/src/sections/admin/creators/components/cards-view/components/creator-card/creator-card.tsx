import { Divider, Stack } from "@mui/material";
import CreatorOverview from "./components/creator-ovierview";
import StatsCard, { StatsMode } from "./components/stats-card";
import { CreatorSummaryDTO } from "hvo-shared";

type Props = {
  creatorSummary: CreatorSummaryDTO;
};

export default function CreatorCard({ creatorSummary }: Props) {
  return (
    <Stack
      direction="row"
      display="flex"
      sx={{
        borderRadius: "16px",
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        backgroundColor: "common.white",
        overflow: "hidden",
      }}
    >
      <CreatorOverview creatorSummary={creatorSummary} />
      <Divider sx={{ height: "auto" }} orientation="vertical" />
      <StatsCard
        mode={StatsMode.Queue}
        todaysCount={0}
        videosCount={creatorSummary.videos_in_queue}
      />
      <Divider sx={{ height: "auto" }} orientation="vertical" />
      <StatsCard
        mode={StatsMode.InProgress}
        todaysCount={0}
        videosCount={creatorSummary.videos_in_progress}
      />{" "}
      <Divider sx={{ height: "auto" }} orientation="vertical" />
      <StatsCard
        mode={StatsMode.Completed}
        todaysCount={0}
        videosCount={creatorSummary.videos_completed}
      />
    </Stack>
  );
}
