import SvgColor from "@/components/svg-color";
import { IconButton, Stack } from "@mui/material";

export default function FilterMenu() {
  return (
    <Stack>
      <IconButton
        size="large"
        sx={{
          p: "11px",
          backgroundColor: "common.white",
          border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        }}
      >
        <SvgColor
          src="/assets/icons/filter.svg"
          color="primary.surface"
          sx={{ width: 24, height: 24 }}
        />
      </IconButton>
    </Stack>
  );
}
