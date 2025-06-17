import { Stack } from "@mui/material";
import SearchInput from "./components/search-input";
import CreatorFilter from "./components/creator-filter";

export default function SearchAndFilters() {
  return (
    <Stack p={2} spacing={1}>
      <SearchInput />
      <CreatorFilter />
    </Stack>
  );
}
