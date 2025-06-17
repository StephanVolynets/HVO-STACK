import IOSSwitch from "@/components/inputs/ios-switch";
import SvgColor from "@/components/svg-color";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
import { Stack, Typography } from "@mui/material";
export default function MultiSelectToggle() {
  const { isMultiSelectActive, toggleMultiSelect } = useStaffContext();

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      p={1.5}
      pl={2.5}
      sx={{
        height: 56,
        borderRadius: 100,
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
      }}
    >
      <SvgColor src="/assets/icons/select-multiple.svg" />
      <Typography
        fontSize={18}
        fontWeight={400}
        sx={{ flexGrow: 1, color: "common.border" }}
      >
        Select multiple
      </Typography>
      <IOSSwitch checked={isMultiSelectActive} onChange={toggleMultiSelect} />
    </Stack>
  );
}
