import { Stack } from "@mui/material";
import SearchInput from "./components/search-input";
import CreatorFilter from "./components/creator-filter";
import FilterMenu from "./components/filter-menu";
import ActiveFiltersChips from "./components/active-filters-chips";

export default function InboxFilters() {
  return (
    <Stack direction="row" spacing={1} justifyContent="flex-start">
      <SearchInput />
      <CreatorFilter />
      {/* <FilterMenu /> */}
      <ActiveFiltersChips />
    </Stack>
  );
}
