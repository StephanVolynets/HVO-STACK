import IOSSwitch from "@/components/inputs/ios-switch";
import SvgColor from "@/components/svg-color";
import { Stack, Typography } from "@mui/material";
import { useLibraryContext } from "../../../contexts/library-context";

export default function DownloadResourcesButton() {
  const { isDownloadResourcesEnabled, setIsDownloadResourcesEnabled } = useLibraryContext();

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      p={1.5}
      pl={2.5}
      sx={{
        borderRadius: 100,
        border: (theme) => `1px solid ${theme.palette.common.mainBorder}`,
        backgroundColor: "common.white",
      }}
    >
      <Typography fontSize={18} fontWeight={400} sx={{ flexGrow: 1, color: "common.border" }}>
        Download Dubs
      </Typography>
      <IOSSwitch checked={isDownloadResourcesEnabled} onChange={() => setIsDownloadResourcesEnabled(!isDownloadResourcesEnabled)} />
    </Stack>
  );
}
