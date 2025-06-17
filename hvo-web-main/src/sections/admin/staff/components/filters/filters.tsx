import { Stack } from "@mui/material";
import SearchInput from "./components/search-input";
import FilterMenu from "./components/filter-menu";
import LanguageFilter from "./components/language-filter";
import PhaseFilter from "./components/phase-filter";

export default function StaffFilters() {
  return (
    <Stack direction="row" spacing={1} justifyContent="flex-start">
      <SearchInput />
      {/* <LanguageFilter /> */}
      <PhaseFilter />
      <FilterMenu />
    </Stack>
  );
}
