import SvgColor from "@/components/svg-color";
import { Stack } from "@mui/material";
import MultiSelectToggle from "./components/multi-select-toggle";
import SearchInput from "./components/search-input";
import VideoFilter from "./components/video-filter";
import CreatorFilter from "./components/creator-filter";
import { useStaffContext } from "@/sections/staff/tasks/contexts/staff-context";

export default function NavigatorControls() {
    const { isMultiSelectActive } = useStaffContext();
    return (
        <Stack spacing={1}>
            <SearchInput />
            <MultiSelectToggle />
            {isMultiSelectActive ? <CreatorFilter /> : <VideoFilter />}
        </Stack>
    );
}           