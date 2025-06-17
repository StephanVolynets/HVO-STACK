import { Divider, Stack } from "@mui/material";
import { Navigator } from "./navigator";
import { Details } from "./details";

export default function Panel() {
  return (
    <Stack
      flex={1}
      direction="row"
      sx={{ backgroundColor: "common.white", border: "1px solid #E6E6E6", borderRadius: "16px" }}
      height="600px"
      maxHeight="600px"
    >
      <Navigator />

      <Divider orientation="vertical" flexItem />

      <Details />
    </Stack>
  );
}
