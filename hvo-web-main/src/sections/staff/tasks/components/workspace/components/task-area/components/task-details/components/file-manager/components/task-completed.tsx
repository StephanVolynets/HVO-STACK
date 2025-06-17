import { Stack, Typography } from "@mui/material";
import SvgColor from "@/components/svg-color";

export default function TaskCompleted() {
    return (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} px={4} py={2} sx={{
            borderRadius: 100,
            border: `1px solid #CCFFF1`,
            backgroundColor: "#FAFFFA"
        }}>
            <SvgColor src="/assets/icons/check-circle.svg" color="common.surfaceGreen" />
            <Typography variant="bodyLarge" color="common.surfaceGreen">You have completed the task</Typography>
        </Stack>
    )
}