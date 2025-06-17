import SvgColor from "@/components/svg-color";
import { Typography } from "@mui/material";

import { Stack } from "@mui/material";

export default function SmartUploadInfo() {
    return (
        <Stack
            sx={{
                backgroundColor: "rgba(38, 38, 38, 0.05)",
                borderRadius: 100,
                width: 'fit-content'
            }}
            direction="row"
            spacing={0.5}
            p={0.5}
            pr={1}
            alignItems="center"
            mt={0.5}
            mb={1.5}
        >
            <SvgColor src="/assets/icons/filled-info.svg" color="primary.main" sx={{ width: 20, height: 20 }} />
            <Typography variant="caption">Automatically uploads to relevant folder</Typography>
        </Stack>
    )
}