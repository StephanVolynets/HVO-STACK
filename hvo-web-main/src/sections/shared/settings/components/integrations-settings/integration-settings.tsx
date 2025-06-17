import { Box, Stack } from "@mui/material";
import IntegrationsItem from "./components/item";

export default function IntegrationSettings() {
  return (
    <Stack direction="row" padding={2} spacing={1.5}>
      <IntegrationsItem variant="box" />
      {/* <IntegrationsItem variant="youtube" />
      <IntegrationsItem variant="sonix" /> */}
      <Box flex={1} />
      <Box flex={1} />
    </Stack>
  );
}
