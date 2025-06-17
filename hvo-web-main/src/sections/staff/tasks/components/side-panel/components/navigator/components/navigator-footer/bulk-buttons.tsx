import SvgColor from "@/components/svg-color";
import { Button, Stack } from "@mui/material";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";
export default function BulkButtons() {
    const { setBulkMethod, checkedVideos } = useStaffContext();
    return (
        <Stack direction="row" spacing={0.5} p={1.5}>
            <Button disabled={checkedVideos.length === 0} variant="outlined" fullWidth startIcon={<SvgColor src="/assets/icons/download.svg" />} onClick={() => setBulkMethod('download')}>Download</Button>
            <Button disabled={checkedVideos.length === 0} variant="contained" fullWidth startIcon={<SvgColor src="/assets/icons/upload.svg" />} onClick={() => setBulkMethod('upload')} color="secondary">Upload</Button>
        </Stack >
    );
}