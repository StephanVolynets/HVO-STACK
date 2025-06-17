import { Stack } from "@mui/material";
import StaffContentHeader from "./components/header";
import { StaffContentDetails } from "./components/details";

export default function StaffContent() {
  return (
    <Stack spacing={1.5} p={1.5} sx={{ flex: 1, minHeight: 0 }}>
      <StaffContentHeader />
      <StaffContentDetails />
    </Stack>
  );
}
