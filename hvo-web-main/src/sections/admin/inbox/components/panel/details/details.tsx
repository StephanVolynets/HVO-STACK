import { Divider, Stack } from "@mui/material";
import Overview from "./components/overview";
import { Content } from "./components/content";

export default function Details() {
  return (
    <Stack flex={1}>
      <Overview />

      <Divider />

      <Content />
    </Stack>
  );
}
