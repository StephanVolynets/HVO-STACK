import { Stack } from "@mui/material";

import { Typography } from "@mui/material";
import { Header } from "./components/header";
import { TaskArea } from "./components/task-area";
import { Feedbacks } from "./components/feedbacks";

export default function Workspace() {
  return (
    <Stack flex={1} sx={{ minWidth: 0, overflow: "hidden" }}>
      <Header />
      <TaskArea />
    </Stack>
  );
}
