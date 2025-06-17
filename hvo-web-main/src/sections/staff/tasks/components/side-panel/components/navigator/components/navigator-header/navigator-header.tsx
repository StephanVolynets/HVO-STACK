import { CustomChip } from "@/components/custom-chip";
import { useGetStaffVideosCount } from "@/use-queries/staff";
import { Stack, Typography } from "@mui/material";

export default function NavigatorHeader() {
    const { count } = useGetStaffVideosCount();
    return (
        <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="bodyLargeStrong">Videos</Typography>
            <CustomChip textVariant="bodySmallStrong">{count || 0}</CustomChip>
        </Stack>
    );
}