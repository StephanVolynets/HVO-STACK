import { Stack, Typography } from "@mui/material";
import SvgColor from "@/components/svg-color";

export default function TaskAvailableSoon() {
    return (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} px={4} py={2} sx={{
            borderRadius: 100,
            border: `1px solid #FFDB99`,
            backgroundColor: "#FFFDFA"
        }}>
            <SvgColor src="/assets/icons/clock.svg" color="#1A1100" />
            <Typography variant="bodyLarge" color="#1A1100">The task will be available soon</Typography>
        </Stack>
    )
}