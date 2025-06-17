import { Stack } from "@mui/material";
import DownloadResourcesButton from "./components/download-resources-button";
import SearchInput from "./components/search-input";
import VideoStatusFilterChip from "./components/video-status-filter-chip";

export default function LibraryFilters() {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack direction="row" display="flex" alignItems="center" spacing={1}>
        <SearchInput />
        <VideoStatusFilterChip />
      </Stack>

      <DownloadResourcesButton />
    </Stack>
  );
}
