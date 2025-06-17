import { Stack } from "@mui/material";
import NavigatorControls from "./components/navigator-controls";
import NavigatorHeader from "./components/navigator-header";
import NavigatorList from "./components/navigator-list";
import NavigatorFooter from "./components/navigator-footer";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import BulkButtons from "./components/navigator-footer/bulk-buttons";

export default function Navigator() {
  const { isMultiSelectActive } = useStaffContext();

  return (
    <Stack sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Fixed header section */}
      <Stack px={1.5} pt={3} pb={1.5} spacing={1.5}>
        <NavigatorHeader />
        <NavigatorControls />
      </Stack>

      {/* Scrollable list section */}
      <Stack
        px={1.5}
        sx={{
          flexGrow: 1,
          overflow: "auto",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "4px",
          },
        }}
      >
        <NavigatorList />
      </Stack>

      {/* {isMultiSelectActive && <BulkButtons />} */}

      <NavigatorFooter />
    </Stack>
  );
}
