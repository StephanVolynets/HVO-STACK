import { CustomChip } from "@/components/custom-chip";
import { useGetVideosCount, useGetVideosCountForVendor } from "@/use-queries/video";
import { Stack, Typography } from "@mui/material";

export default function NavigatorHeader() {
  const { videosCount } = useGetVideosCountForVendor();
  return (
    <Stack direction="row" alignItems="center" px={2} py={1.5} spacing={1}>
      <Typography variant="bodyLarge">Videos</Typography>
      <CustomChip textVariant="bodySmallStrong">{videosCount || 0}</CustomChip>
    </Stack>
  );
}
