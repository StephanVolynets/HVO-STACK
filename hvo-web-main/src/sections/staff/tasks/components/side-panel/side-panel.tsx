import { Box, Stack, Typography } from "@mui/material";
import Navigator from "./components/navigator/navigator";


export default function SidePanel() {
    return (
        <Stack sx={{ width: 320 }}>
            <Navigator />
        </Stack>
    );
}